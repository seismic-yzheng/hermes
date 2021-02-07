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
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/templates">Hermes</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/templates">Templates</Nav.Link>
          <Nav.Link href="/build">Build</Nav.Link>
        </Nav>
        {createButton && (
          <Button
            disabled={creating}
            variant="outline-info"
            type="submit"
            onClick={createButton}
          >
            {creating ? "Creating ..." : "Create"}
          </Button>
        )}
        {saveButton && (
          <Button disabled={saving} variant="outline-info" onClick={saveButton}>
            {saving ? "Saving ..." : "Save"}
          </Button>
        )}
        {previewButton && (
          <Button
            disabled={previewing}
            variant="outline-info"
            onClick={previewButton}
          >
            {previewing ? "Previewing ..." : "Preview"}
          </Button>
        )}
      </Container>
    </Navbar>
  );
}
