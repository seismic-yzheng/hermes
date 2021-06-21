import * as Mustache from "mustache";
import {
  getMarkdownForTemplate,
  storeMarkdownForTemplate,
} from "../lib/markdown";
import { storeCategoryForTemplate } from "../lib/category";
import { templateTableName } from "../lib/constants";
import {
  query,
  buildStatementForQueryByID,
  buildStatementForUpdate,
  buildStatementForInsert,
  getColumnValue,
} from "../lib/db";

export async function storeTemplate(kv: object) {
  const key_value = getColumnValue(kv, [
    "name",
    "creator",
    "html",
    "design",
    "subject",
    "shared",
  ]);
  const { statement, values } = buildStatementForInsert(
    key_value,
    templateTableName
  );
  const results = await query(statement, values);
  const id = results["insertId"];
  if ("markdowns" in kv && kv["markdowns"]) {
    for (const markdown of kv["markdowns"]) {
      const { name, type, default_value } = markdown;
      if (name) {
        await storeMarkdownForTemplate(name, type, id, default_value);
      }
    }
  }
  if ("categories" in kv && kv["categories"]) {
    for (const category of Array.from(new Set(kv["categories"]))) {
      await storeCategoryForTemplate(category as string, id);
    }
  }
  return id;
}
export async function getTemplateById(id: number) {
  let { statement, values } = buildStatementForQueryByID(templateTableName, id);
  return await query(statement, values);
}

export async function updateTemplateUsed(id: number) {
  const statement = "UPDATE template SET used=used + 1 WHERE id = ?";
  const values = [id];
  await query(statement, values);
}

export async function updateTemplateRate(id: number, rate: number) {
  let query_ = buildStatementForQueryByID(templateTableName, id);
  let statement = query_["statement"];
  let values = query_["values"];
  let res = (await query(statement, values)) as any;
  res = res[0];
  const total_rate = res.total_rate + rate;
  const rate_count = res.rate_count + 1;
  const new_rate = total_rate / rate_count;
  query_ = buildStatementForUpdate(
    { total_rate: total_rate, rate_count: rate_count, rate: new_rate },
    templateTableName,
    id
  );
  statement = query_["statement"];
  values = query_["values"];
  await query(statement, values);
}

export function apply(template: string, markdowns: object) {
  // markdowns = { test: { name: "abc" } };
  return Mustache.render(template, markdowns);
}

export function convertMarkdownType(type_str: string, value: any) {
  if (type_str == "string") {
    return value;
  } else if (type_str == "list") {
    return JSON.parse(value);
  } else if (type_str == "dict") {
    return JSON.parse(value);
  } else {
    throw Error("Undefined type: " + type_str);
  }
}

export function validAndMergeMarkdowns(
  markdowns: {},
  stored_markdowns: any[]
): {} {
  let res = {};
  for (const stored_markdown of stored_markdowns) {
    let name = stored_markdown.name;
    if (name in markdowns) {
      const value = markdowns[name];
      let converted_value = convertMarkdownType(stored_markdown.type, value);
      res[name] = converted_value;
    } else {
      if (stored_markdown.default_value != undefined) {
        res[name] = stored_markdown.default_value;
      } else {
        throw Error("Undefined markdown: " + name);
      }
    }
  }
  return res;
}

export async function render(
  template_id: number,
  markdowns: any[],
  subject: string
) {
  const results = (await getTemplateById(template_id)) as any[];
  if (results.length == 0) {
    return null;
  }
  const result = results[0];
  const stored_markdowns = (await getMarkdownForTemplate(result.id)) as any[];
  // const validMarkDowns = validAndMergeMarkdowns(markdowns, stored_markdowns);
  let emailSubject = subject ? subject : result.subject;
  if (!emailSubject) {
    emailSubject = "No subject";
  }

  return {
    html: apply(
      result.html,
      validAndMergeMarkdowns(markdowns, stored_markdowns)
    ),
    subject: apply(
      emailSubject,
      validAndMergeMarkdowns(markdowns, stored_markdowns)
    ),
  };
}
