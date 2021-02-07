import React, { useRef, useState, useEffect } from "react";
import Button from "@/components/button";
import Markdowns from "components/markdowns";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getTemplate } from "../../lib/swr-hooks";
import { useClientRouter } from "use-client-router";
import Router from "next/router";
import TopNavBar from "components/nav";

import EmailEditor from "react-email-editor";

export default function EditTemplate() {
  const emailEditorRef = useRef(null);
  const testRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const router = useClientRouter();
  const { id } = router.query;
  const { templateData, isLoading } = getTemplate(id as string);
  const [markdownList, setMarkdownList] = useState([
    { name: "", type: "string", default_value: "" },
  ]);

  const saveHtml = async (event: any) => {
    setSaving(true);
    event.preventDefault();
    try {
      emailEditorRef.current.editor.exportHtml(async (data: any) => {
        const { design, html } = data;
        const res = await fetch(`/api/template/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: html,
            design: design,
            markdowns: markdownList,
          }),
        });
        setSaving(false);
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
        Router.push(`/templates`);
      });
    } catch (e) {
      throw Error(e.message);
    }
  };

  const onLoad = () => {
    if (templateData.markdowns && templateData.markdowns.length > 0) {
      setMarkdownList(templateData.markdowns);
    }
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
        <TopNavBar saveButton={saveHtml} saving={saving} />
        <Container fluid>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={6} md={4}>
              <Markdowns
                setMarkdownList={setMarkdownList}
                markdownList={markdownList}
              />
            </Col>
            <Col xs={6} md={8}>
              <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}
