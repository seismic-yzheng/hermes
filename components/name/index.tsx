import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.css";

const Name = (props) => {
  const setName = props.setName;
  const name = props.name;

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setName(value);
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          aria-label="Markdown"
          aria-describedby="basic-addon2"
          value={name}
          onChange={(e) => handleNameChange(e)}
        />
      </InputGroup>
    </div>
  );
};

export default Name;
