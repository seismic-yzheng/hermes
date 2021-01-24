import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";

import ButtonLink from "@/components/button-link";
import Button from "@/components/button";
import Router from "next/router";

function Template({ id, name, html }) {
  const [deleting, setDeleting] = useState(false);

  async function deleteEntry() {
    setDeleting(true);
    let res = await fetch(`/api/delete-template?id=${id}`, {
      method: "DELETE",
    });
    let json = await res.json();
    if (!res.ok) throw Error(json.message);
    mutate("/api/get-templates");
    setDeleting(false);
  }
  async function editTemplate() {}
  return (
    <div>
      <div className="flex items-center">
        <div>{name}</div>
        <div className="flex ml-4">
          <Button
            disabled={deleting}
            onClick={deleteEntry}
            className="h-5 py-0 mx-1"
          >
            {deleting ? "Deleting ..." : "Delete"}
          </Button>
          <Button
            onClick={() => Router.push(`/edit/${id}`)}
            className="h-5 py-0 mx-1"
          >
            EDIT
          </Button>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default Template;
