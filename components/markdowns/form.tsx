import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.css";

const MarkdownForms = (props) => {
  const markdownValue = props.markdownValue;
  const markdowns = props.markdowns;

  const setMarkdowns = props.setMarkdowns;
  //console.log(temp);
  // const [changeMarkdowns, setChangeMarkdowns] = useState(temp);
  //useEffect(() => {
  //  setMarkdowns(temp);
  //});

  const handleMarkdownChange = (e, index) => {
    const { name, value } = e.target;
    //const list = { ...changeMarkdowns };
    //list[markdownValue[index]["name"]] = value;
    // setChangeMarkdowns(list);
    const temp = { ...markdowns };
    temp[markdownValue[index]["name"]] = value;
    console.log(temp);
    setMarkdowns(temp);

    console.log(markdowns);
  };

  if (markdownValue) {
    console.log(markdownValue);
    return (
      <div>
        <h3>
          <a href="https://mustache.github.io/">Mustache</a> markdowns
        </h3>
        {markdownValue.length == 0 ? (
          <p>no markdown found</p>
        ) : (
          markdownValue.map((x, i) => (
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
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">
                    {markdownValue[i]["type"]}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </div>
          ))
        )}
      </div>
    );
  }
};

export default MarkdownForms;
