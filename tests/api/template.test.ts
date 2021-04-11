import { createRequest, createResponse } from "node-mocks-http";
import templatesHandler from "../../pages/api/templates";
import templateHandler from "../../pages/api/template/[id]";
import sendEmailHandler from "../../pages/api/send-email";
import createTemplateHandler from "../../pages/api/template";
import reviewHandler from "../../pages/api/review";
import {
  createTemplateTable,
  truncateTemplateTable,
  createMarkdownTable,
  truncateMarkdownTable,
  createCategoryTable,
  truncateCategoryTable,
  createReviewTable,
  truncateReviewTable,
} from "../../lib/db_schema";
import { getUID, sleep } from "../../lib/helper";
import { getMarkdownForTemplate } from "../../lib/markdown";

jest.setTimeout(30000);

async function getTestMarkdown(
  name = undefined,
  type = "string",
  default_value = undefined
) {
  if (name == undefined) {
    const id = await getUID();
    name = "markdown" + id;
  }
  let markdown = { name: name, type: type };
  if (default_value) {
    markdown["default_value"] = default_value;
  }
  return markdown;
}

async function getTestCategories(num = 2) {
  let res = [];
  for (let i = 0; i < num; i++) {
    res.push("category" + (await getUID()));
  }
  return res;
}

const createTemplate = async (
  user: string = "user:test",
  markdowns = undefined,
  categories = undefined,
  html = undefined,
  design = undefined
) => {
  const id = await getUID();
  const name = "test" + id;
  if (!html) {
    html = "test_html" + id;
  }
  if (!design) {
    design = { design: "design" };
  }
  let body = {
    name: name,
    creator: user,
    html: html,
    design: design,
    markdowns: markdowns,
    categories: categories,
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

const sendEmail = async (id, markdowns) => {
  const request = createRequest({
    method: "POST",
    body: {
      id: id,
      markdowns: markdowns,
      subject: "",
    },
  });
  const response = createResponse();
  await sendEmailHandler(request, response);
  return response;
};

const createReview = async (
  template_id: Number,
  review: String,
  rate: Number,
  user: string = "user:test"
) => {
  const request = createRequest({
    method: "POST",
    body: {
      review: review,
      template_id: template_id,
      rate: rate,
      user: user,
    },
  });
  const response = createResponse();
  await reviewHandler(request, response);
  return response;
};

const getReview = async (template_id: Number) => {
  const request = createRequest({
    method: "GET",
    query: {
      template_id: template_id,
    },
  });
  const response = createResponse();
  await reviewHandler(request, response);
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
  data["results"].forEach((item) => {
    received.push(item["id"]);
  });
  return received;
};

describe("CRUD test for template", () => {
  beforeAll(async () => {
    await createTemplateTable();
    await createMarkdownTable();
    await createCategoryTable();
    await createReviewTable();
  });
  afterAll(async () => {
    await truncateMarkdownTable();
    await truncateCategoryTable();
    await truncateTemplateTable();
    await truncateReviewTable();
  });
  test("create template with markdowns and categories", async () => {
    const markdown = await getTestMarkdown();
    const { response } = await createTemplate(
      undefined,
      [markdown],
      await getTestCategories()
    );
    expect(response._getStatusCode()).toBe(200);
  });
  test("create and get review", async () => {
    let { response } = await createTemplate();
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    const user = "user:123";
    response = await createReview(id, "test review", 4.5, user);
    expect(response._getStatusCode()).toBe(200);
    response = await getReview(id);
    expect(response._getStatusCode()).toBe(200);
    let data = response._getJSONData();
    expect(data[0].rate).toBe(4.5);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    data = response._getJSONData();
    expect(data.rate).toBe(4.5);

    response = await createReview(id, "test review", 3.5, user);
    expect(response._getStatusCode()).toBe(200);
    response = await getReview(id);
    expect(response._getStatusCode()).toBe(200);
    data = response._getJSONData();
    expect(data.length).toBe(2);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    data = response._getJSONData();
    expect(data.rate).toBe(4);
  });
  test("get template with markdown and categories", async () => {
    let markdown = await getTestMarkdown();
    let categories = await getTestCategories();
    let { response } = await createTemplate(undefined, [markdown], categories);
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    const data = response._getJSONData();
    expect(data["id"]).toBe(id);
    markdown["default_value"] = null;
    expect(data["markdowns"]).toEqual([markdown]);
    expect(data["categories"]).toEqual(categories);
  });
  test("query template with markdowns", async () => {
    let markdowns = [await getTestMarkdown(), await getTestMarkdown()];
    let { response } = await createTemplate(undefined, markdowns);
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await getTemplates({ ids: id });
    expect(response._getStatusCode()).toBe(200);
    const data = response._getJSONData()["results"][0];
    expect(data["id"]).toBe(id);
    for (let markdown of markdowns) {
      markdown["default_value"] = null;
    }
    expect(data["markdowns"]).toEqual(markdowns);
  });
  test("update template with markdowns and categories", async () => {
    let markdowns = [
      await getTestMarkdown(undefined, undefined, "test"),
      await getTestMarkdown(undefined, undefined, "test"),
    ];
    let categories = await getTestCategories();
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
        categories: categories,
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
    expect(data["categories"]).toEqual(categories);
    markdowns[0]["default_value"] = "test2";
    markdowns[1] = await getTestMarkdown();
    categories = await getTestCategories();
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
        categories: categories,
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
    expect(data["categories"]).toEqual(categories);
  });
  test("delete template with markdown", async () => {
    let markdowns = [await getTestMarkdown(), await getTestMarkdown()];
    let { response } = await createTemplate(
      undefined,
      markdowns,
      await getTestCategories()
    );
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    response = await deleteTemplate(id);
    expect(response._getStatusCode()).toBe(200);
    response = await getTemplate(id);
    expect(response._getStatusCode()).toBe(404);
    const res = (await getMarkdownForTemplate(id)) as any[];
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
  test("query templates by user", async () => {
    let ids = [] as string[];
    let names = [] as string[];
    let users = [] as string[];
    for (let i = 0; i < 10; i++) {
      let user = "user:" + (await getUID());
      users.push(user);
      let { response, name } = await createTemplate(user);
      expect(response._getStatusCode()).toBe(200);
      ids.push(response._getJSONData()["id"]);
      names.push(name);
    }
    let response = await getTemplates({ creators: users });
    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()["results"].length).toBe(10);
    response = await getTemplates({
      exclude_creators: [users[0]],
    });
    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()).not.toEqual(
      expect.arrayContaining([ids[0]])
    );
  });
  test("query templates", async () => {
    let ids = [] as string[];
    let names = [] as string[];
    const user = "user:" + (await getUID());
    for (let i = 0; i < 10; i++) {
      let { response, name } = await createTemplate(user, undefined, [i]);
      expect(response._getStatusCode()).toBe(200);
      ids.push(response._getJSONData()["id"]);
      names.push(name);
      await sleep(1000);
    }
    const user2 = "user:" + (await getUID());
    let user2Ids = [] as string[];
    let res = await createTemplate(user2, undefined, ["testCategory1"]);
    user2Ids.push(res["response"]._getJSONData()["id"]);
    res = await createTemplate(user2, undefined, ["testCategory1"]);
    user2Ids.push(res["response"]._getJSONData()["id"]);
    res = await createTemplate(user2, undefined, ["testCategory2"]);
    user2Ids.push(res["response"]._getJSONData()["id"]);
    // query ids
    let response = await getTemplates({ ids: ids.slice(0, 5) });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 5));
    // query names
    response = await getTemplates({ names: names.slice(0, 5) });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 5));
    // query creator
    response = await getTemplates({ creators: [user] });
    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()["results"].length).toBe(10);
    // test pagination
    response = await getTemplates({ creators: [user], limit: 5, offset: 0 });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 5));
    response = await getTemplates({ creators: [user], limit: 5, offset: 5 });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(5, 10));
    // test order
    response = await getTemplates({ creators: [user], order_by: "created_at" });
    expect(response._getStatusCode()).toBe(200);
    // test keywords
    response = await getTemplates({ keywords: "test" });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData()).length).toBeGreaterThanOrEqual(10);
    // test categories
    response = await getTemplates({ categories: [0] });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 1));
    response = await getTemplates({ categories: [0, 1, 2] });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 3));
    response = await getTemplates({ categories: [10000] });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual([]);
    response = await getTemplates({
      creators: [user],
      categories: [0, 1, 2],
    });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(ids.slice(0, 3));
    response = await getTemplates({
      creators: [user2],
      categories: [0, 1, 2],
    });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual([]);
    response = await getTemplates({
      creators: [user2],
      categories: ["testCategory1"],
    });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual(user2Ids.slice(0, 2));
    response = await getTemplates({
      creators: [user2],
      categories: ["testCategory2"],
    });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData())).toEqual([user2Ids[2]]);
    response = await getTemplates({
      creators: [user],
      order_by: "created_at",
      sort_by: "DESC",
    });
    expect(response._getStatusCode()).toBe(200);
    expect(getIDs(response._getJSONData()).reverse()).toEqual(ids);
  });
});

describe("test for sending email", () => {
  beforeAll(async () => {
    await createTemplateTable();
    await createMarkdownTable();
  });
  afterAll(async () => {
    //await truncateMarkdownTable();
    //await truncateTemplateTable();
  });
  test("send email with markdown", async () => {
    const html = `
    <html>
    <body onload="renderHello()">
      <div id="target">Loading...</div>
      <script id="template" type="x-tmpl-mustache">
        Hello {{ name }}!
      </script>
      <script src="https://unpkg.com/mustache@latest"></script>
      <script src="render.js"></script>
    </body>
    </html>`;
    const expected = "ok";
    const markdown = await getTestMarkdown("name", undefined, "John");
    let { response } = await createTemplate(
      undefined,
      [markdown],
      undefined,
      html
    );
    expect(response._getStatusCode()).toBe(200);
    const id = response._getJSONData()["id"];
    const markdowns = { name: "John" };
    response = await sendEmail(id, markdowns);
    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONData()).toEqual(expected);
  });
});
