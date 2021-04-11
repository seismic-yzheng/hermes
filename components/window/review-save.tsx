import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Router from "next/router";
import StarRatingComponent from "react-star-rating-component";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ReivewSaveWindow(props) {
  const [review, setReview] = useState("");
  const [rate, setRate] = useState(0);

  const save = async () => {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review: review,
        user: "user:1",
        rate: rate,
        template_id: props.id,
      }),
    });
    if (!res.ok) {
      props.setErrorWindowShow(true);
    } else {
      Router.push(`/templates`);
    }
  };

  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Rate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div style={{ fontSize: 36, textAlign: "center" }}>
            <StarRatingComponent
              name="template rate"
              starCount={5}
              value={rate}
              onStarClick={(nextValue) => setRate(nextValue)}
              renderStarIcon={(index, value) => {
                return (
                  <span>
                    <i
                      className={index <= value ? "fas fa-star" : "far fa-star"}
                    />
                  </span>
                );
              }}
            />
          </div>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">review</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              as="textarea"
              aria-label="Name"
              aria-describedby="basic-addon1"
              onChange={(e) => setReview(e.target.value)}
            />
          </InputGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => save()}>Submit</Button>
        <Button onClick={(e) => Router.push(`/templates`)}>Skip</Button>
      </Modal.Footer>
    </Modal>
  );
}
