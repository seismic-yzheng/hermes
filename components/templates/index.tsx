import Template from "./template";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Templates({ templates, user }) {
  if (templates) {
    return (
      <Container>
        <Row
          style={{ textAlign: "center", marginBottom: 50 }}
          className="show-gird"
        >
          {templates.map((e) => (
            <Col key={e.id} style={{ textAlign: "center", marginTop: 30 }}>
              <Template template={e} user={user} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  } else {
    return null;
  }
}

export default Templates;
