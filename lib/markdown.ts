import {
  query,
  buildStatementForQuery,
  buildStatementForInsert,
  getColumnValue,
  buildStatementForUpdate,
} from "./db";
import { templateMarkdownTableName, markdownTableName } from "./constants";
import Filter from "bad-words";

const filter = new Filter();

async function getMarkdownID(name: string, type: string) {
  const key_value = { name: name, type: type };
  let id: string;
  let { statement, values } = buildStatementForQuery(
    key_value,
    markdownTableName
  );
  let results = await query(statement, values);
  if (Object.keys(results).length == 0) {
    let { statement, values } = buildStatementForInsert(
      key_value,
      markdownTableName
    );
    results = await query(statement, values);
    id = results["insertId"];
  } else {
    id = results[0].id;
  }
  return id;
}

async function insertMarkdown(
  markdown_id: number,
  template_id: number,
  default_value = undefined
) {
  let key_value = {
    template_id: template_id,
    markdown_id: markdown_id,
  };
  if (default_value) {
    key_value["default_value"] = default_value;
  }
  let { statement, values } = buildStatementForInsert(
    key_value,
    templateMarkdownTableName
  );
  return await query(statement, values);
}

export async function storeMarkdown(
  name: string,
  type: string,
  template_id: number,
  default_value = undefined
) {
  const markdown_id = (await getMarkdownID(name, type)) as any;
  return await insertMarkdown(markdown_id, template_id, default_value)[
    "insertId"
  ];
}

async function updateDefaultValue(default_value) {
  let statement = "UPDATE ";
  statement += templateMarkdownTableName;
  statement += " SET default_value=?";
  let values = [null];
  if (default_value) {
    values = [default_value];
  }
  return await query(statement, values);
}

export async function getMarkdown(template_id: number) {
  let statement = "SELECT name, type, default_value FROM ";
  statement += templateMarkdownTableName;
  statement += " JOIN ";
  statement += markdownTableName;
  statement +=
    " ON template_markdown.markdown_id=markdown.id WHERE template_id=?";
  const values = [filter.clean(String(template_id))];
  return await query(statement, values);
}

export async function deleteMarkdown(template_id: number) {
  let statement = "DELETE FROM ";
  statement += templateMarkdownTableName;
  statement += " WHERE template_id = ?";
  let values = [filter.clean(String(template_id))];
  return await query(statement, values);
}
