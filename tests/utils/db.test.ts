import {
  buildWhereStatement,
  buildSelectStatement,
  buildFromStatement,
  buildStatementForQueryWithJoin,
  buildStatementForQuery,
} from "../../lib/db";

describe("test for build query statement", () => {
  test("build where statement", async () => {
    const expect_statement =
      " WHERE template.name= ? AND template.creator in (?,?) AND template_category.id!= ? AND category.name= ?";
    const expect_values = [
      "testTemplate",
      "user:1",
      "user:2",
      "12345",
      "testCategory",
    ];

    const { whereStatement, values } = buildWhereStatement(
      {
        template: {
          name: { value: "testTemplate", include: true },
          creator: { value: ["user:1", "user:2"], include: true },
        },
        template_category: { id: { value: "12345", include: false } },
        category: { name: { value: "testCategory", include: true } },
      },
      undefined
    );
    expect(whereStatement).toBe(expect_statement);
    expect(values).toEqual(expect_values);
  });
  test("build empty where statement", async () => {
    const { whereStatement, values } = buildWhereStatement({}, undefined);
    expect(whereStatement).toBe("");
    expect(values).toEqual([]);
  });
  test("build select statement", async () => {
    const expect_statement =
      "SELECT template.id , template.name , category.name , template_category.*";
    const statement = buildSelectStatement({
      template: ["id", "name"],
      category: ["name"],
      template_category: [],
    });
    expect(statement).toBe(expect_statement);
  });
  test("build from statement", async () => {
    const expect_statement =
      " FROM template LEFT JOIN template_category ON template.id = template_category.template_id LEFT JOIN category ON template_category.category_id = category.id";
    const statement = buildFromStatement(
      ["template", "template_category", "category"],
      [
        "template.id = template_category.template_id",
        "template_category.category_id = category.id",
      ]
    );
    expect(statement).toBe(expect_statement);
  });
  test("build query statement with join", async () => {
    const expect_statement =
      "SELECT template.* , category.* FROM template " +
      "LEFT JOIN template_category " +
      "ON template.id = template_category.template_id " +
      "LEFT JOIN category " +
      "ON template_category.category_id = category.id " +
      "WHERE template.name= ? " +
      "ORDER BY template.created_at ASC " +
      "LIMIT 10 " +
      "OFFSET 10";
    const expect_values = ["testName"];
    const { statement, values } = buildStatementForQueryWithJoin(
      { template: [], category: [] },
      ["template", "template_category", "category"],
      [
        "template.id = template_category.template_id",
        "template_category.category_id = category.id",
      ],
      {
        template: {
          name: { value: "testName", include: true },
        },
      },
      undefined,
      "template.created_at",
      "ASC",
      10,
      10
    );
    expect(statement).toBe(expect_statement);
    expect(values).toEqual(expect_values);
  });
  test("build query statement without join", async () => {
    const expect_statement =
      "SELECT template.* FROM template " +
      "WHERE template.name= ? " +
      "ORDER BY created_at ASC " +
      "LIMIT 10 " +
      "OFFSET 10";
    const expect_values = ["testName"];
    const { statement, values } = buildStatementForQuery(
      { name: { value: "testName", include: true } },
      "template",
      "created_at",
      "ASC",
      10,
      10
    );
    expect(statement).toBe(expect_statement);
    expect(values).toEqual(expect_values);
  });
});
