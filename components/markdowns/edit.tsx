import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.css";

const Markdowns = (props) => {
  const markdownList = props.markdownList ? props.markdownList : [];
  const setMarkdownList = props.setMarkdownList;

  // handle input change
  const handleMarkdownChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...markdownList];
    list[index]["name"] = value;
    setMarkdownList(list);
  };

  const handleDefaultValueChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...markdownList];
    list[index]["default_value"] = value;
    setMarkdownList(list);
  };

  // handle click event of the Remove button
  const handleMarkDownRemoveClick = (index) => {
    const list = [...markdownList];
    list.splice(index, 1);
    setMarkdownList(list);
  };

  // handle click event of the Add button
  const handleMarkdownAddClick = () => {
    setMarkdownList([
      ...markdownList,
      { name: "", type: "string", default_value: "" },
    ]);
  };

  const handleMarkdownSelect = (e, index) => {
    const list = [...markdownList];
    list[index]["type"] = e;
    setMarkdownList(list);
  };

  return (
    <div>
      <Alert variant="secondary">
        <Alert.Link href="https://mustache.github.io/">Mustache</Alert.Link>{" "}
        markdowns.
      </Alert>
      {markdownList.map((x, i) => (
        <div className="box" key={i}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Markdown"
              aria-label="Markdown"
              aria-describedby="basic-addon2"
              value={markdownList[i]["name"]}
              onChange={(e) => handleMarkdownChange(e, i)}
            />
            <FormControl
              placeholder="Default value"
              aria-label="Default value"
              aria-describedby="basic-addon2"
              value={
                markdownList[i]["default_value"]
                  ? markdownList[i]["default_value"]
                  : undefined
              }
              onChange={(e) => handleDefaultValueChange(e, i)}
            />
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={markdownList[i]["type"]}
              id="input-group-dropdown-1"
              data-toggle="dropdown"
              onSelect={(e) => handleMarkdownSelect(e, i)}
            >
              <Dropdown>
                <Dropdown.Item href="#" eventKey="string">
                  string
                </Dropdown.Item>
                <Dropdown.Item href="#" eventKey="dict">
                  dict
                </Dropdown.Item>
                <Dropdown.Item href="#" eventKey="list">
                  list
                </Dropdown.Item>
              </Dropdown>
            </DropdownButton>
            <InputGroup.Append>
              {markdownList.length !== 1 && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleMarkDownRemoveClick(i)}
                >
                  Remove
                </Button>
              )}
              {markdownList.length - 1 === i && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleMarkdownAddClick()}
                >
                  Add
                </Button>
              )}
            </InputGroup.Append>
          </InputGroup>
        </div>
      ))}
    </div>
  );
};

export default Markdowns;
