import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import TopNavBar from "components/nav";

export default function IndexPage() {
  return (
    <div>
      <TopNavBar />
      <h1 style={{ textAlign: "center", marginTop: 50 }}>Welcome to Hermes</h1>
    </div>
  );
}
