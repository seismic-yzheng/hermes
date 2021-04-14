import React, { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getTemplate, getReview } from "../../lib/swr-hooks";
import { useClientRouter } from "use-client-router";
import TopNavBar from "components/nav";
import MarkdownForms from "components/markdowns/form";
import ServerErrorWindow from "components/window/server-error";
import ReviewSaveWindow from "components/window/review-save";
import Router from "next/router";
import EmailSendWindow from "components/window/send";
import Subject from "components/subject";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Review from "components/review";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

export default function EditTemplate() {
  const user = "user:1";
  const [previewing, setPreviewing] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useClientRouter();
  const { id } = router.query;
  const { templateData, isLoading } = getTemplate(id as string);
  const { reviewData, reviewIsLoading } = getReview(id as string);
  const [markdowns, setMarkdowns] = useState(undefined);
  const [sendWindowShow, setSendWindowShow] = useState(false);
  const [reviewWindowShow, setReviewWindowShow] = useState(false);
  const [html, setHTML] = useState(undefined);
  const [previewSubject, setPreviewSubject] = useState("");
  const [errorWindowShow, setErrorWindowShow] = useState(false);
  const [subject, setSubject] = useState("");
  const [previewed, setPreviewed] = useState(false);

  const preview = async (event: any) => {
    setPreviewing(true);
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        markdowns: markdowns,
        subject: subject,
      }),
    });
    setPreviewing(false);
    if (!res.ok) {
      setErrorWindowShow(true);
    } else {
      const res_json = await res.json();
      setHTML(res_json["html"]);
      setPreviewSubject(res_json["subject"]);
      setPreviewed(true);
    }
  };

  const send = async (event: any, recipients: string) => {
    setSending(true);
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        markdowns: markdowns,
        recipients: recipients,
        subject: subject,
      }),
    });
    setSending(false);
    if (!res.ok) {
      setErrorWindowShow(true);
    } else {
      if (templateData.creator != user) {
        setReviewWindowShow(true);
      } else {
        Router.push(`/templates?creators=user:1`);
      }
    }
  };

  if (!isLoading && !reviewIsLoading) {
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
      if (templateData.subject) {
        setSubject(templateData.subject);
      }
      setHTML(templateData.html);
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
        <ReviewSaveWindow
          show={reviewWindowShow}
          id={templateData.id}
          setErrorWindowShow={setErrorWindowShow}
        />
        <ServerErrorWindow
          show={errorWindowShow}
          onHide={() => setErrorWindowShow(false)}
        />
        <Container fluid>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={6} md={4}>
              <Subject setSubject={setSubject} subject={subject} />
              <MarkdownForms
                markdownValue={templateData.markdowns}
                markdowns={markdowns}
                setMarkdowns={setMarkdowns}
                preview={preview}
              />
              <Review reviews={reviewData} />
            </Col>
            <Col xs={6} md={8}>
              {!previewed && (
                <div>
                  <Alert variant="danger">
                    Press preview button to see rendered Email.
                  </Alert>
                  <div style={{ marginBottom: "10px" }}>Template:</div>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              )}
              {previewed && (
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Subject</Form.Label>
                    <FormControl
                      aria-label="Subject"
                      aria-describedby="basic-addon2"
                      value={previewSubject}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Body</Form.Label>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </Form.Group>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}
