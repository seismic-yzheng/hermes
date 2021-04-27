import React, { useRef, useState, useEffect } from "react";
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
  const [categories, setCategories] = useState([]);
  const [design, setDesign] = useState("");
  const [html, setHtml] = useState("");
  const [saveWindowShow, setSaveWindowShow] = useState(false);
  const HTMLPrefix = [".", "@", "{"];
  const HTMLPostfix = [";", "}", "{", ","];

  const isHTML = (text: String) => {
    return (
      HTMLPrefix.indexOf(text[0]) > -1 ||
      HTMLPostfix.indexOf(text[text.length - 1]) > -1
    );
  };

  const save = async (event: any, name: any) => {
    emailEditorRef.current.editor.exportHtml(async (data: any) => {
      const { design, html } = data;
      setDesign(design);
      setHtml(html);

      const span = document.createElement("span");
      span.innerHTML = html;
      let HTMLText = [];
      for (const text of span.innerText.split("\n")) {
        const trimmed_text = text.trim();
        if (trimmed_text != "" && !isHTML(trimmed_text)) {
          HTMLText.push(trimmed_text);
        }
      }
      if (HTMLText.length > 0) {
        const res = await fetch("/api/get-categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: HTMLText.join(" "),
          }),
        });

        const json = await res.json();
        setCategories(json);
      } else {
        setCategories([]);
      }

      setSaveWindowShow(true);
    });
  };

  const exportHtml = async (event: any, name: any, shared: boolean = false) => {
    event.preventDefault();
    setCreating(true);
    setSaveWindowShow(false);
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
        categories: categories,
        shared: shared,
      }),
    });

    const json = await res.json();
    setCreating(false);
    if (!res.ok) throw Error(json.message);
    Router.push(`/templates?creators=user:1`);
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
        <TopNavBar createButton={save} creating={creating} />
        <TemplateSaveWindow
          show={saveWindowShow}
          categories={categories}
          setCategories={setCategories}
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
              <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
                style={{ minHeight: "900px" }}
              />
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
