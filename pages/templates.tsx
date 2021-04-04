import Skeleton from "react-loading-skeleton";
import React, { useState } from "react";
import Templates from "@/components/templates";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNavBar from "components/nav";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useClientRouter } from "use-client-router";

import { getTemplates } from "@/lib/swr-hooks";

export default function TemplatesPage(init_params) {
  console.log(init_params);
  const [params, setParams] = useState(init_params);
  const [sortBy, setSortBy] = useState("default");
  const { data, isLoading } = getTemplates(params);

  if (isLoading) {
    return <div>loading</div>;
  }

  const getLatest = async (event: any) => {
    let new_params = { ...params };
    new_params["order_by"] = "created_at";
    new_params["sort_by"] = "DESC";
    setParams(new_params);
    setSortBy("Latest");
  };

  const getHottest = async (event: any) => {
    let new_params = { ...params };
    new_params["order_by"] = "used";
    new_params["sort_by"] = "DESC";
    setParams(new_params);
    console.log("---------------");
    setSortBy("Hottest");
  };

  const getHighestRated = async (event: any) => {
    let new_params = { ...params };
    new_params["order_by"] = "rate";
    new_params["sort_by"] = "DESC";
    setParams(new_params);
    console.log("---------------");
    setSortBy("Highest rated");
  };

  const sortByDefault = async (event: any) => {
    let new_params = { ...params };
    if ("order_by" in new_params) {
      delete new_params["order_by"];
    }
    if ("sort_by" in new_params) {
      delete new_params["sort_by"];
    }
    setParams(new_params);
    console.log("---------------");
    setSortBy("Default");
  };

  return (
    <div>
      <TopNavBar />
      <Container>
        <Row>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4} style={{ marginTop: 25 }}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Sort by</InputGroup.Text>
              </InputGroup.Prepend>
              <DropdownButton
                id="dropdown-basic-button"
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={sortBy}
              >
                <Dropdown.Item onClick={getLatest}>Latest</Dropdown.Item>
                <Dropdown.Item onClick={getHottest}>Hottest</Dropdown.Item>
                <Dropdown.Item onClick={getHighestRated}>
                  Highest rated
                </Dropdown.Item>
                <Dropdown.Item onClick={sortByDefault}>Default</Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </Col>
        </Row>
        <Templates templates={data} />
      </Container>
    </div>
  );
}

TemplatesPage.getInitialProps = async (ctx) => {
  let init_params = {};
  if (ctx.query.user && ctx.query.user == "current") {
    init_params = { creators: ["user:1"] };
  }
  return init_params;
};
