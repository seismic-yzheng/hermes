import React, { useRef, useState, useEffect } from "react";
import Button from "@/components/button";
import { getTemplate } from "../../lib/swr-hooks";
import { useClientRouter } from "use-client-router";
import Router from "next/router";

import EmailEditor from "react-email-editor";

export default function EditTemplate() {
  const emailEditorRef = useRef(null);
  const testRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useClientRouter();
  const { id } = router.query;
  const { templateData, isLoading } = getTemplate(id as string);
  console.log(templateData, isLoading);

  const exportHtml = async (event: any) => {
    console.log(emailEditorRef);
  };
  const onLoad = () => {
    console.log(emailEditorRef);
    console.log(testRef);
    console.log(emailEditorRef.current);
    if (emailEditorRef.current) {
      emailEditorRef.current.editor.loadDesign(JSON.parse(templateData.design));
    } else {
      // emailEditorRef sometimes can't be load when user use browser button to go back and forward
      Router.reload();
    }
  };
  if (!isLoading) {
    return (
      <div>
        <div
          style={{
            backgroundColor: "red",
            height: "35px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span ref={testRef}>Template name: {templateData.name}</span>
          <span>
            <Button disabled={submitting} type="submit" onClick={exportHtml}>
              {submitting ? "Saving ..." : "Save"}
            </Button>
          </span>
        </div>
        <div>
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
        </div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}
