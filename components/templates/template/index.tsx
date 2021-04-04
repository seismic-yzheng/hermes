import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";

import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Router from "next/router";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import StarRatingComponent from "react-star-rating-component";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaFireAlt } from "react-icons/fa";

function Template({ template }) {
  const [deleting, setDeleting] = useState(false);

  async function deleteTemplate() {
    setDeleting(true);
    let res = await fetch(`/api/template/${template.id}`, {
      method: "DELETE",
    });
    let json = await res.json();
    if (!res.ok) throw Error(json.message);
    mutate("/api/templates/");
    setDeleting(false);
  }
  return (
    <Card>
      <Card.Body>
        <Card.Title>{template.name}</Card.Title>

        <div dangerouslySetInnerHTML={{ __html: template.html }} />
        <div style={{ textAlign: "center", marginBottom: "-10px" }}>
          <StarRatingComponent
            name="template rate"
            editing={false}
            starCount={5}
            value={template.rate}
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaFireAlt style={{ color: "red" }}></FaFireAlt>
            <span style={{ marginLeft: "5px", color: "blue" }}>
              {template.used}
            </span>
          </span>
        </div>
        <Card.Link href={`/edit/${template.id}`}>Edit</Card.Link>
        <Card.Link href={`/send/${template.id}`}>View</Card.Link>
        <Card.Link onClick={deleteTemplate}>Delete</Card.Link>
      </Card.Body>
    </Card>
  );
}

export default Template;
