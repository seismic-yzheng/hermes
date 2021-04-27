import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

export default function EmailSendWindow(props) {
  const [recipients, setRecipients] = useState("");
  const sendEmail = props.sendEmail;
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
        <Modal.Title id="contained-modal-title-vcenter">Send Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">recipients</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Name"
              aria-describedby="basic-addon1"
              onChange={(e) => setRecipients(e.target.value)}
            />
          </InputGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => sendEmail(e, recipients)}>Send</Button>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
