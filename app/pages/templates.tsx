import Skeleton from 'react-loading-skeleton'

import Container from '@/components/container'
import Entries from '@/components/templates'

import { useTemplates } from '@/lib/swr-hooks'

export default function EntriesPage() {
  const { templates, isLoading } = useTemplates()

  if (isLoading) {
    return (
      <div>
        <Container>
          <Skeleton width={180} height={24} />
          <Skeleton height={48} />
          <div className="my-4" />
          <Skeleton width={180} height={24} />
          <Skeleton height={48} />
          <div className="my-4" />
          <Skeleton width={180} height={24} />
          <Skeleton height={48} />
        </Container>
      </div>
    )
  }

  return (
    <div>
      <Container>
        <Entries templates={templates} />
      </Container>
    </div>
  )
}
