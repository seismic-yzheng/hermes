import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.css";

const MarkdownForms = (props) => {
  const markdownValue = props.markdownValue;
  let temp = {};
  markdownValue.forEach((item) => {
    if (item["default_value"] == null) {
      temp[item["name"]] = "";
    } else {
      temp[item["name"]] = item["default_value"];
    }
  });
  const markdowns = props.markdowns;
  const setMarkdowns = props.setMarkdowns;
  const [changeMarkdowns, setChangeMarkdowns] = useState(temp);

  const handleMarkdownChange = (e, index) => {
    const { name, value } = e.target;
    const list = { ...changeMarkdowns };
    list[markdownValue[index]["name"]] = value;
    setChangeMarkdowns(list);
    setMarkdowns(list);
  };

  if (markdownValue) {
    return (
      <div>
        {markdownValue.map((x, i) => (
          <div className="box" key={i}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  {markdownValue[i]["name"]}
                </InputGroup.Text>
              </InputGroup.Prepend>
              {markdownValue[i]["default_value"] != null && (
                <FormControl
                  aria-label="Markdown"
                  aria-describedby="basic-addon2"
                  value={markdownValue[i]["default_value"]}
                  readOnly
                />
              )}
              {markdownValue[i]["default_value"] == null && (
                <FormControl
                  aria-label="Markdown"
                  aria-describedby="basic-addon2"
                  onChange={(e) => handleMarkdownChange(e, i)}
                />
              )}
            </InputGroup>
          </div>
        ))}
        <div style={{ marginTop: 20 }}>{JSON.stringify(changeMarkdowns)}</div>
      </div>
    );
  }
};

export default MarkdownForms;
