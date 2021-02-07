import Skeleton from "react-loading-skeleton";

import Templates from "@/components/templates";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNavBar from "components/nav";

import { getTemplates } from "@/lib/swr-hooks";

export default function EntriesPage() {
  const { templateData, isLoading } = getTemplates();

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div>
      <TopNavBar />
      <Container>
        <Row>
          <Templates templates={templateData} />
        </Row>
      </Container>
    </div>
  );
}
