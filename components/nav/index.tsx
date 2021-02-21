import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";

export default function TopNavbar(props) {
  const createButton = props.createButton;
  const creating = props.creating;
  const saving = props.saving;
  const saveButton = props.saveButton;
  const previewing = props.previewing;
  const previewButton = props.previewButton;
  const sending = props.sending;
  const sendButton = props.sendButton;
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Hermes</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/templates">Templates</Nav.Link>
          <Nav.Link href="/build">Build</Nav.Link>
        </Nav>
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
