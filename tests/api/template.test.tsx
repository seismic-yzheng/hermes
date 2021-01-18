import { createRequest, createResponse } from "node-mocks-http";
import templatesHandler from "../../pages/api/templates";
import templateHandler from "../../pages/api/template/[id]";
import createTemplateHandler from "../../pages/api/template";
import {
  createTemplateTable,
  truncateTemplateTable,
  createMarkdownTable,
  truncateMarkdownTable,
} from "../../lib/db_schema";
import { getRandomInt, sleep } from "../../lib/helper";
import { getMarkdown } from "../../lib/markdown";

jest.setTimeout(30000);

async function getTestMarkdown(type = "string", default_value = undefined) {
  const id = await getRandomInt(1000);
  let markdown = { name: "markdown" + id, type: type };
  if (default_value) {
    markdown["default_value"] = default_value;
  }
  return markdown;
}

const createTemplate = async (
  user: string = "user:test",
  markdowns = undefined
) => {
  const id = await getRandomInt(1000);
  const name = "test" + id;
  const html = "test_html" + id;
  let body = {
    name: name,
    creator: user,
    html: html,
    markdowns: markdowns,
  };
  if (markdowns) {
    body["markdown"] = markdowns;
  }
  const request = createRequest({
    method: "POST",
    body: body,
  });
  const response = createResponse();
  await createTemplateHandler(request, response);
  return { response, name, user, html };
};

const getTemplate = async (id) => {
  const request = createRequest({
    method: "GET",
    query: {
      id: id,
    },
  });
  const response = createResponse();
  await templateHandler(request, response);
  return response;
};

const getTemplates = async (query: {}) => {
  const request = createRequest({
    method: "GET",
    query: query,
  });
  const response = createResponse();
  await templatesHandler(request, response);
  return response;
};

const deleteTemplate = async (id) => {
  const request = createRequest({
    method: "DELETE",
    query: {
      id: id,
    },
  });
  const response = createResponse();
  await templateHandler(request, response);
  return response;
};

const getIDs = (data: []) => {
  let received = [] as number[];
  data.forEach((item) => {
    received.push(item["id"]);
  });
  return received;
};

describe("CRUD test for template", () => {
  beforeAll(async () => {
    await createTemplateTable();
    await createMarkdownTable();
  });
  afterAll(async () => {
    await truncateMarkdownTable();
    await truncateTemplateTable();
  });
  test("create template with markdown", async () => {
    const markdown = await getTestMarkdown();
    const { response } = await createTemplate(undefined, [markdown]);
    expect(response._getStatusCode()).toBe(200);
  });
  test("get template with markdown", async () => {
    let markdown = await getTestMarkdown();
    let { response } = await createTemplate(undefined, [markdown]);
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    const data = response._getJSONData();
    expect(data["id"]).toBe(id);
    markdown["default_value"] = null;
    expect(data["markdowns"]).toEqual([markdown]);
  });
  test("query template with markdowns", async () => {
    let markdowns = [await getTestMarkdown(), await getTestMarkdown()];
    let { response } = await createTemplate(undefined, markdowns);
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await getTemplates({ id: id });
    expect(response._getStatusCode()).toBe(200);
    const data = response._getJSONData()[0];
    expect(data["id"]).toBe(id);
    for (let markdown of markdowns) {
      markdown["default_value"] = null;
    }
    expect(data["markdowns"]).toEqual(markdowns);
  });
  test("update template with markdowns", async () => {
    let markdowns = [
      await getTestMarkdown(undefined, "test"),
      await getTestMarkdown(undefined, "test"),
    ];
    let { response } = await createTemplate();
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    let request = createRequest({
      method: "PUT",
      query: {
        id: id,
      },
      body: {
        name: "test2",
        creator: "user:2",
        html: "test_html2",
        markdowns: markdowns,
      },
    });
    response = createResponse();
    await templateHandler(request, response);
    expect(response._getStatusCode()).toBe(200);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    let data = response._getJSONData();
    expect(data["id"]).toBe(id);
    expect(data["markdowns"]).toEqual(markdowns);
    markdowns[0]["default_value"] = "test2";
    markdowns[1] = await getTestMarkdown();
    request = createRequest({
      method: "PUT",
      query: {
        id: id,
      },
      body: {
        name: "test2",
        creator: "user:2",
        html: "test_html2",
        markdowns: markdowns,
      },
    });
    response = createResponse();
    await templateHandler(request, response);
    expect(response._getStatusCode()).toBe(200);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    data = response._getJSONData();
    expect(data["id"]).toBe(id);
    markdowns[1]["default_value"] = null;
    expect(data["markdowns"]).toEqual(markdowns);
  });
  test("delete template with markdown", async () => {
    let markdowns = [await getTestMarkdown(), await getTestMarkdown()];
    let { response } = await createTemplate(undefined, markdowns);
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await deleteTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(404);
    const res = (await getMarkdown(id)) as any[];
    expect(res.length).toBe(0);
  });
  test("create template", async () => {
    const { response } = await createTemplate();
    expect(response._getStatusCode()).toBe(200);
  });
  test("get template", async () => {
    let { response } = await createTemplate();
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()["id"]).toBe(id);
  });
  test("delete template", async () => {
    let { response } = await createTemplate();
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await deleteTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(404);
  });
  test("update template", async () => {
    let { response } = await createTemplate();
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    let request = createRequest({
      method: "PUT",
      query: {
        id: id,
      },
      body: {
        name: "test2",
        creator: "user:2",
        html: "test_html2",
      },
    });
    response = createResponse();
    await templateHandler(request, response);
    expect(response._getStatusCode()).toBe(200);
  });
  test("query templates", async () => {
    let ids = [] as string[];
    let names = [] as string[];
    const user = "user:" + (await getRandomInt(1000));
    for (let i = 0; i < 10; i++) {
      let { response, name } = await createTemplate(user);
      expect(response._getStatusCode()).toBe(200);
      ids.push(response._getJSONData()["id"]);
      names.push(name);
      await sleep(1000);
    }
    // query ids
    let response = await getTemplates({ id: ids.slice(0, 5) });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 5));
    // query names
    response = await getTemplates({ name: names.slice(0, 5) });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 5));
    // query creator
    response = await getTemplates({ creator: user });
    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData().length).toBe(10);
    // test pagination
    response = await getTemplates({ creator: user, limit: 5, offset: 0 });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 5));
    response = await getTemplates({ creator: user, limit: 5, offset: 5 });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(5, 10));
    // test order
    response = await getTemplates({ creator: user, order_by: "created_at" });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids);
    response = await getTemplates({
      creator: user,
      order_by: "created_at",
      sort_by: "DESC",
    });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData()).reverse()).toEqual(ids);
  });
});
