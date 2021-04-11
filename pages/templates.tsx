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
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Pagination from "react-bootstrap/Pagination";

import { getTemplates } from "@/lib/swr-hooks";

export default function TemplatesPage(init_params) {
  let params_ = init_params["params"] || {};
  const limit = 5;
  params_["limit"] = limit;
  params_["offset"] = 0;

  const [params, setParams] = useState(params_);
  const [sortBy, setSortBy] = useState("default");

  const { data, isLoading } = getTemplates(params);
  const [activePage, setActivePage] = useState(1);

  if (isLoading) {
    return <div>loading</div>;
  }

  const { count, results } = data;
  let items = [];
  const setPage = async (number: number) => {
    let new_params = { ...params };
    new_params["offset"] = (number - 1) * limit;
    setParams(new_params);
    setActivePage(number);
  };

  let totalPage = Math.ceil(count / limit);
  for (let number = 1; number <= totalPage; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={(e) => setPage(number)}
      >
        {number}
      </Pagination.Item>
    );
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
    setSortBy("Most popular");
  };

  const getHighestRated = async (event: any) => {
    let new_params = { ...params };
    new_params["order_by"] = "rate";
    new_params["sort_by"] = "DESC";
    setParams(new_params);
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
    setSortBy("Default");
  };

  const setKeywordsFromList = async (keywords: any) => {
    let new_params = { ...params };
    if (keywords) {
      new_params["keywords"] = keywords;
    } else {
      delete new_params["keywords"];
    }
    setParams(new_params);
  };

  return (
    <div>
      <TopNavBar
        keywords={params["keywords"] || []}
        setKeywords={setKeywordsFromList}
      />
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
                <Dropdown.Item onClick={getHottest}>Most popular</Dropdown.Item>
                <Dropdown.Item onClick={getHighestRated}>
                  Highest rated
                </Dropdown.Item>
                <Dropdown.Item onClick={sortByDefault}>Default</Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </Col>
        </Row>
        <Templates templates={results} />
        <Row>
          <Col xs={12} md={10}></Col>
          <Col xs={6} md={2} style={{ marginTop: 25 }}>
            <style jsx global>{`
              .page-link {
                position: relative;
                display: block;
                padding: 0.5rem 0.75rem;
                margin-left: -1px;
                line-height: 1.25;
                color: #1a202c;
                background-color: #fff;
                border: 1px solid #dee2e6;
              }
              .page-item.active .page-link {
                z-index: 3;
                color: #fff;
                background-color: #1a202c;
                border-color: #1a202c;
              }
            `}</style>
            <Pagination>{items}</Pagination>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

TemplatesPage.getInitialProps = async (ctx) => {
  let init_params = {};
  if (ctx.query.user && ctx.query.user == "current") {
    init_params["params"] = { creators: ["user:1"] };
  }
  return init_params;
};
