import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";

import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Router from "next/router";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";

function Template({ id, name, html }) {
  const [deleting, setDeleting] = useState(false);

  async function deleteTemplate() {
    setDeleting(true);
    let res = await fetch(`/api/template/${id}`, {
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
        <Card.Title>{name}</Card.Title>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Card.Link href={`/edit/${id}`}>Edit</Card.Link>
        <Card.Link href={`/send/${id}`}>Send</Card.Link>
        <Card.Link onClick={deleteTemplate}>Delete</Card.Link>
      </Card.Body>
    </Card>
  );
}

export default Template;
