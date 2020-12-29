import { useState } from 'react'
import Link from 'next/link'
import { mutate } from 'swr'

import ButtonLink from '@/components/button-link'
import Button from '@/components/button'

function Template({ id, name, html }) {
  const [deleting, setDeleting] = useState(false)

  async function deleteEntry() {
    setDeleting(true)
    let res = await fetch(`/api/delete-template?id=${id}`, { method: 'DELETE' })
    let json = await res.json()
    if (!res.ok) throw Error(json.message)
    mutate('/api/get-templates')
    setDeleting(false)
  }
  return (
    <div>
      <div className="flex items-center">
        <Link href={`/template/${id}`}>
          <a className="font-bold py-2">{name}</a>
        </Link>
        <div className="flex ml-4">
          <Button
            disabled={deleting}
            onClick={deleteEntry}
            className="h-5 py-0 mx-1"
          >
            {deleting ? 'Deleting ...' : 'Delete'}
          </Button>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default Template
