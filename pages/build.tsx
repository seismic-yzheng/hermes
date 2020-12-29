import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/button'

import EmailEditor from 'react-email-editor';


const App = (props) => {
  const emailEditorRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  const exportHtml = async (event: any) => {
    setSubmitting(true)
    event.preventDefault()
    try {
      emailEditorRef.current.editor.exportHtml(async (data: any) => {
        const { design, html } = data
        const res = await fetch('/api/create-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "test",
            "creator": "user:1",
            "html": html
          }),
        })
        setSubmitting(false)
        const json = await res.json()
        if (!res.ok) throw Error(json.message)
      })
    } catch (e) {
      throw Error(e.message)
    }
  }

  const onLoad = () => {
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true),
      () => { setRendered(false); }
  });
  var url;

  if (rendered) {
    if (window !== undefined) {
      url = window.location.protocol + '//' + window.location.host;
      console.log(url);
    }
    return (
      <div>
        <div>
          <Button disabled={submitting} type="submit" onClick={exportHtml}>
            {submitting ? 'Creating ...' : 'Create'}
          </Button>
        </div>

        <EmailEditor
          ref={emailEditorRef}
          onLoad={onLoad}
        />
      </div>
    );
  }
  else {
    return <p>Loading...</p>;
  }
};

export default App
