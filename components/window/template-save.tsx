import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import CustomTagsInput from "@/components/tags-input";

export default function TemplateSaveWindow(props) {
  const [name, setName] = useState("");
  const saveTemplate = props.saveTemplate;
  const handleClose = () => props.setShow(false);
  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Save template
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Name"
              aria-describedby="basic-addon1"
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
        </div>
        <div>
          <CustomTagsInput
            categories={props.categories}
            setCategories={props.setCategories}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => saveTemplate(e, name)}>Save</Button>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
