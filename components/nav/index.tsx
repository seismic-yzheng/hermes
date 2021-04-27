import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

export default function TopNavbar(props) {
  const createButton = props.createButton;
  const creating = props.creating;
  const saving = props.saving;
  const saveButton = props.saveButton;
  const previewing = props.previewing;
  const previewButton = props.previewButton;
  const sending = props.sending;
  const sendButton = props.sendButton;
  const setKeywords = props.setKeywords;
  const keywords = props.keywords;
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Hermes</Navbar.Brand>
        <Nav className="mr-auto">
          <NavDropdown title="Templates" id="collasible-nav-dropdown">
            <NavDropdown.Item href="/templates?creators=user:1">
              My Templates
            </NavDropdown.Item>
            <NavDropdown.Item href="/templates?exclude_creators=user:1&shared=1">
              All Templates
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/build">Build</Nav.Link>
        </Nav>
        {setKeywords && (
          <div>
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
                outline: none;
                padding: 5px;
                min-width: 200px;
              }
            `}</style>
            <TagsInput
              value={keywords}
              onChange={(tags) => setKeywords(tags)}
              inputProps={{ placeholder: "Search" }}
            />
          </div>
        )}
        {createButton && (
          <div className="ml-2">
            <Button
              disabled={creating}
              variant="outline-info"
              type="submit"
              onClick={createButton}
            >
              {creating ? "Creating ..." : "Create"}
            </Button>
          </div>
        )}
        {saveButton && (
          <div className="ml-2">
            <Button
              disabled={saving}
              variant="outline-info"
              onClick={saveButton}
            >
              {saving ? "Saving ..." : "Save"}
            </Button>
          </div>
        )}
        {previewButton && (
          <div className="ml-2">
            <Button
              disabled={previewing}
              variant="outline-info"
              onClick={previewButton}
            >
              {previewing ? "Previewing ..." : "Preview"}
            </Button>
          </div>
        )}
        {sendButton && (
          <div className="ml-2">
            <Button
              disabled={sending}
              variant="outline-info"
              onClick={sendButton}
            >
              {sending ? "Sending ..." : "Send"}
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
}
