import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.css";

const Markdowns = (props) => {
  const inputList = props.inputList;
  const setInputList = props.setInputList;
  console.log(inputList);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { markdown: "", type: "String" }]);
  };

  const handleSelect = (e, index) => {
    console.log(e);
    const list = [...inputList];
    list[index]["type"] = e;
    setInputList(list);
  };

  return (
    <div>
      {inputList.map((x, i) => (
        <div className="box" key={i}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Markdown"
              aria-label="Markdown"
              aria-describedby="basic-addon2"
              onChange={(e) => handleInputChange(e, i)}
            />
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title="String"
              id="input-group-dropdown-1"
              data-toggle="dropdown"
              onSelect={(e) => handleSelect(e, i)}
            >
              <Dropdown>
                <Dropdown.Item href="#" eventKey="string">
                  String
                </Dropdown.Item>
                <Dropdown.Item href="#" eventKey="dict">
                  Object
                </Dropdown.Item>
                <Dropdown.Item href="#" eventKey="list">
                  List
                </Dropdown.Item>
              </Dropdown>
            </DropdownButton>
            <InputGroup.Append>
              {inputList.length !== 1 && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleRemoveClick(i)}
                >
                  Remove
                </Button>
              )}
              {inputList.length - 1 === i && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleAddClick()}
                >
                  Add
                </Button>
              )}
            </InputGroup.Append>
          </InputGroup>
        </div>
      ))}
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
    </div>
  );
};

export default Markdowns;
