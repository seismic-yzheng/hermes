import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.css";

const Subject = (props) => {
  const setSubject = props.setSubject;
  const subject = props.subject;

  const handleMarkdownChange = (e) => {
    const { name, value } = e.target;
    setSubject(value);
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Subject</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          aria-label="Markdown"
          aria-describedby="basic-addon2"
          value={subject}
          onChange={(e) => handleMarkdownChange(e)}
        />
      </InputGroup>
    </div>
  );
};

export default Subject;
