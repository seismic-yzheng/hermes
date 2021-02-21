import Template from "./template";
import CardDeck from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Templates({ templates }) {
  if (templates) {
    return (
      <Container>
        <Row
          style={{ textAlign: "center", marginBottom: 50 }}
          className="show-gird"
        >
          {templates.map((e) => (
            <Col style={{ textAlign: "center", marginTop: 50 }}>
              <Template id={e.id} name={e.name} html={e.html} />
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
