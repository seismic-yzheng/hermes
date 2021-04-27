
import Button from "react-bootstrap/Button";
import TopNavBar from "components/nav";
import Jumbotron from "react-bootstrap/Jumbotron";

export default function IndexPage() {
  return (
    <div>
      <TopNavBar />
      <Jumbotron>
        <h1>Welcome to Hermes</h1>
        <p>
          Hermes is an Email template system that you can build your own
          templates and use them to send Emails!
        </p>
        <p>
          <Button variant="secondary" href="/build">
            Start building one
          </Button>
        </p>
      </Jumbotron>
    </div>
  );
}
