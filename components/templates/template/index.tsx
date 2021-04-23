import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";

import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Router, { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import StarRatingComponent from "react-star-rating-component";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaFireAlt } from "react-icons/fa";

function Template({ template, user }) {
  async function deleteTemplate() {
    let res = await fetch(`/api/template/${template.id}`, {
      method: "DELETE",
    });
    let json = await res.json();
    if (!res.ok) throw Error(json.message);
    Router.reload();
  }

  async function copyTemplate(id, user) {
    let res = await fetch("/api/template/" + id + "?user=" + user, {
      method: "POST",
    });
    let json = await res.json();
    if (!res.ok) throw Error(json.message);
    Router.push("/edit/" + json["id"]);
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
        {user == template.creator && (
          <Card.Link href={`/edit/${template.id}`}>Edit</Card.Link>
        )}
        {user != template.creator && (
          <Card.Link href="#" onClick={() => copyTemplate(template.id, user)}>
            Copy
          </Card.Link>
        )}
        <Card.Link href={`/send/${template.id}`}>View</Card.Link>
        {user == template.creator && (
          <Card.Link href="#" onClick={() => deleteTemplate()}>
            Delete
          </Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

export default Template;
