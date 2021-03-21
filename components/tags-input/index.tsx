import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

export default function CustomTagsInput(props) {
  return (
    <InputGroup className="mb-2">
      <InputGroup.Prepend>
        <InputGroup.Text id="basic-addon1">Category</InputGroup.Text>
      </InputGroup.Prepend>
      <style jsx global>{`
        .react-tagsinput-tag {
          background-color: #e2e3e5;
          border-radius: 2px;
          border: 1px solid #d6d8db;
          color: #383d41;
          display: inline-block;
          font-family: sans-serif;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 5px;
          margin-right: 5px;
          padding: 5px;
        }
        .react-tagsinput-input {
          background: transparent;
          border: 0;
          color: #777;
          font-family: sans-serif;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 6px;
          margin-top: 1px;
          outline: none;
          padding: 5px;
          width: 120px;
        }
        .react-tagsinput {
          background-color: #fff;
          border: 1px solid #ccc;
          overflow: hidden;
          padding-left: 5px;
          padding-top: 5px;
          max-width: 80%;
        }
      `}</style>
      <TagsInput
        value={props.categories}
        onChange={(tags) => props.setCategories(tags)}
        inputProps={{ placeholder: "Add new category" }}
      />
    </InputGroup>
  );
}
