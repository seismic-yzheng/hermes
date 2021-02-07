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
import MarkdownForms from "components/markdowns/form";

import EmailEditor from "react-email-editor";

export default function EditTemplate() {
  const emailEditorRef = useRef(null);
  const testRef = useRef(null);
  const [previewing, setPreviewing] = useState(false);
  const router = useClientRouter();
  const { id } = router.query;
  const { templateData, isLoading } = getTemplate(id as string);
  const [markdowns, setMarkdowns] = useState({});
  const [html, setHTML] = useState("<p>Loading...</p>");

  const preview = async (event: any) => {
    setPreviewing(true);
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        markdowns: markdowns,
      }),
    });
    const text = await res.text();
    setPreviewing(false);
    if (!res.ok) throw Error();
    setHTML(text);
  };

  if (!isLoading) {
    return (
      <div>
        <TopNavBar previewing={previewing} previewButton={preview} />
        <Container fluid>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={6} md={4}>
              <MarkdownForms
                markdownValue={templateData.markdowns}
                markdowns={markdowns}
                setMarkdowns={setMarkdowns}
                preview={preview}
              />
            </Col>
            <Col xs={6} md={8}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}
