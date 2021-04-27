import React, { useRef, useState } from "react";
import Markdowns from "@/components/markdowns/edit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getTemplate } from "../../lib/swr-hooks";
import { useClientRouter } from "use-client-router";
import Router from "next/router";
import TopNavBar from "components/nav";
import Subject from "components/subject";
import Name from "components/name";
import InputGroup from "react-bootstrap/InputGroup";
import CustomTagsInput from "@/components/tags-input";

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
  const [categories, setCategories] = useState([]);
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [shared, setShared] = useState(1);

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
            subject: subject,
            categories: categories,
            name: name,
            shared: shared,
          }),
        });
        setSaving(false);
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
        Router.push(`/templates?creators=user:1`);
      });
    } catch (e) {
      throw Error(e.message);
    }
  };

  const onLoad = () => {
    if (templateData.markdowns && templateData.markdowns.length > 0) {
      setMarkdownList(templateData.markdowns);
    }
    if (templateData.categories && templateData.categories.length > 0) {
      setCategories(templateData.categories);
    }
    setSubject(templateData.subject);
    setName(templateData.name);
    setShared(templateData.shared);
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
              <Name setName={setName} name={name} />
              <Subject setSubject={setSubject} subject={subject} />
              <hr />
              <Markdowns
                setMarkdownList={setMarkdownList}
                markdownList={markdownList}
              />
              <hr />
              <CustomTagsInput
                categories={categories}
                setCategories={setCategories}
              />
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Share</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Checkbox
                  aria-label="Checkbox for sharing"
                  checked={shared}
                  onChange={() => {
                    setShared(1 - shared);
                  }}
                />
              </InputGroup>
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
}
