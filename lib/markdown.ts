import { query, buildStatementForInsert } from "./db";
import { templateMarkdownTableName, markdownTableName } from "./constants";
import Filter from "bad-words";

const filter = new Filter();

async function getOrCreateMarkdown(name: string, type: string) {
  let id: string;
  let results = await getMarkdownByNameAndType(name, type);
  console.log(results);
  if (Object.keys(results).length == 0) {
    let { statement, values } = buildStatementForInsert(
      { name: name, type: type },
      markdownTableName
    );
    console.log(statement, values);
    results = await query(statement, values);
    id = results["insertId"];
  } else {
    id = results[0].id;
  }
  return id;
}

async function storeTemplateMarkdown(
  markdown_id: number,
  template_id: number,
  default_value = undefined
) {
  // const res = await getTemplateMarkdownByIDs(template_id, markdown_id);
  // if (Object.keys(res).length == 0) {
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
  //}
}

export async function storeMarkdownForTemplate(
  name: string,
  type: string,
  template_id: number,
  default_value = undefined
) {
  console.log(name, type);
  const markdown_id = (await getOrCreateMarkdown(name, type)) as any;
  await storeTemplateMarkdown(markdown_id, template_id, default_value);
}

export async function getMarkdownForTemplate(template_id: number) {
  let statement = "SELECT name, type, default_value FROM ";
  statement += templateMarkdownTableName;
  statement += " JOIN ";
  statement += markdownTableName;
  statement +=
    " ON template_markdown.markdown_id=markdown.id WHERE template_id=?";
  const values = [filter.clean(String(template_id))];
  return await query(statement, values);
}

export async function deleteMarkdownByTemplate(template_id: number) {
  let statement = "DELETE FROM ";
  statement += templateMarkdownTableName;
  statement += " WHERE template_id = ?";
  let values = [filter.clean(String(template_id))];
  return await query(statement, values);
}

async function getTemplateMarkdownByIDs(template_id: any, markdown_id: any) {
  let statement =
    "SELECT * FROM template_markdown WHERE template_id = ? AND markdown_id = ?";
  let values = [
    filter.clean(String(template_id)),
    filter.clean(String(markdown_id)),
  ];
  return await query(statement, values);
}

async function getMarkdownByNameAndType(name: any, type: any) {
  let statement = "SELECT * FROM markdown WHERE name = ? AND type = ?";
  let values = [filter.clean(String(name)), filter.clean(String(type))];
  return await query(statement, values);
}
