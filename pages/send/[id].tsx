import React, { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getTemplate } from "../../lib/swr-hooks";
import { useClientRouter } from "use-client-router";
import TopNavBar from "components/nav";
import MarkdownForms from "components/markdowns/form";
import ServerErrorWindow from "components/window/server-error";
import Router from "next/router";
import EmailSendWindow from "components/window/send";

export default function EditTemplate() {
  const [previewing, setPreviewing] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useClientRouter();
  const { id } = router.query;
  const { templateData, isLoading } = getTemplate(id as string);
  const [markdowns, setMarkdowns] = useState(undefined);
  const [sendWindowShow, setSendWindowShow] = useState(false);
  const [html, setHTML] = useState(
    "<p>Press preview button to see preview.</p>"
  );
  const [errorWindowShow, setErrorWindowShow] = useState(false);

  const preview = async (event: any) => {
    setPreviewing(true);
    console.log(markdowns);
    const res = await fetch("/api/preview", {
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
    if (!res.ok) {
      setErrorWindowShow(true);
    } else {
      setHTML(text);
    }
  };

  const send = async (event: any, recipients: string) => {
    setSending(true);
    console.log(recipients);
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        markdowns: markdowns,
        recipients: recipients,
      }),
    });
    setSending(false);
    if (!res.ok) {
      setErrorWindowShow(true);
    } else {
      Router.push(`/templates`);
    }
  };

  if (!isLoading) {
    if (!markdowns) {
      let temp = {};
      templateData.markdowns.forEach((item) => {
        if (item["default_value"] == null) {
          temp[item["name"]] = "";
        } else {
          temp[item["name"]] = item["default_value"];
        }
      });
      setMarkdowns(temp);
    }
    return (
      <div>
        <TopNavBar
          previewing={previewing}
          previewButton={preview}
          sending={sending}
          sendButton={() => setSendWindowShow(true)}
        />
        <EmailSendWindow
          show={sendWindowShow}
          setShow={setSendWindowShow}
          sendEmail={send}
        />
        <ServerErrorWindow
          show={errorWindowShow}
          onHide={() => setErrorWindowShow(false)}
        />
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
              <h3 style={{ textAlign: "center" }}>Preview</h3>
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
