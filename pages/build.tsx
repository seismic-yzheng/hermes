import React, { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Markdowns from "@/components/markdowns/edit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNavBar from "components/nav";
import TemplateSaveWindow from "components/window/template-save";
import Subject from "components/subject";

import EmailEditor from "react-email-editor";
import Router from "next/router";

const App = (props) => {
  const emailEditorRef = useRef(null);
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [markdownList, setMarkdownList] = useState([
    { name: "", type: "string", default_value: "" },
  ]);
  const [saveWindowShow, setSaveWindowShow] = useState(false);

  const exportHtml = async (event: any, name: any) => {
    event.preventDefault();
    setCreating(true);
    setSaveWindowShow(false);
    try {
      emailEditorRef.current.editor.exportHtml(async (data: any) => {
        const { design, html } = data;
        const res = await fetch("/api/template", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            creator: "user:1",
            html: html,
            design: design,
            markdowns: markdownList,
            subject: subject,
          }),
        });
        setCreating(false);
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
        Router.push(`/templates`);
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
    }
    return (
      <div>
        <TopNavBar
          createButton={() => setSaveWindowShow(true)}
          creating={creating}
        />
        <TemplateSaveWindow
          show={saveWindowShow}
          setShow={setSaveWindowShow}
          saveTemplate={exportHtml}
        />
        <Container fluid>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={6} md={4}>
              <Subject setSubject={setSubject} subject={subject} />
              <hr />
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
};

export default App;
