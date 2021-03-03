import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.css";
import Alert from "react-bootstrap/Alert";

const MarkdownForms = (props) => {
  const markdownValue = props.markdownValue;
  const markdowns = props.markdowns;

  const setMarkdowns = props.setMarkdowns;

  const handleMarkdownChange = (e, index) => {
    const { name, value } = e.target;
    const temp = { ...markdowns };
    temp[markdownValue[index]["name"]] = value;
  };

  if (markdownValue) {
    console.log(markdownValue);
    return (
      <div>
        <Alert variant="secondary">
          <Alert.Link href="https://mustache.github.io/">Mustache</Alert.Link>{" "}
          markdowns.
        </Alert>
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
