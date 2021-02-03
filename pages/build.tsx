import React, { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Markdowns from "components/markdowns";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import EmailEditor from "react-email-editor";
import Router from "next/router";

const App = (props) => {
  const emailEditorRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [inputList, setInputList] = useState([
    { markdown: "", type: "string" },
  ]);

  const exportHtml = async (event: any) => {
    setSubmitting(true);
    event.preventDefault();
    try {
      emailEditorRef.current.editor.exportHtml(async (data: any) => {
        const { design, html } = data;
        console.log(inputList);
        /*         const res = await fetch("/api/template", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "test",
            creator: "user:1",
            html: html,
            design: design,
          }),
        });
        setSubmitting(false);
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
        Router.push(`/templates`); */
        setSubmitting(false);
      });
    } catch (e) {
      throw Error(e.message);
    }
  };

  const onLoad = () => {
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true),
      () => {
        setRendered(false);
      };
  });
  var url;

  if (rendered) {
    if (window !== undefined) {
      url = window.location.protocol + "//" + window.location.host;
      console.log(url);
    }
    return (
      <Container fluid>
        <Row
          style={{
            backgroundColor: "red",
            height: "35px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            <Button disabled={submitting} type="submit" onClick={exportHtml}>
              {submitting ? "Creating ..." : "Create"}
            </Button>
          </span>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <Col xs={6} md={4}>
            <Markdowns setInputList={setInputList} inputList={inputList} />
          </Col>
          <Col xs={6} md={8}>
            <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
          </Col>
        </Row>
      </Container>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default App;
