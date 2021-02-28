import * as Mustache from "mustache";
import { getMarkdown } from "../lib/markdown";
import { templateTableName } from "../lib/constants";
import { query, buildStatementForQueryByID } from "../lib/db";

export async function getTemplateById(id: number) {
  let { statement, values } = buildStatementForQueryByID(templateTableName, id);
  return await query(statement, values);
}

export function apply(template: string, markdowns: object) {
  return Mustache.render(template, markdowns);
}

export function validMarkdownType(type_str: string, value: any) {
  if (type_str == "string") {
    return value instanceof String;
  } else if ((type_str = "list")) {
    return value instanceof Array;
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
      validMarkdownType(stored_markdown.type, value);
      res[name] = markdowns[name];
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
  const stored_markdowns = (await getMarkdown(result.id)) as any[];
  const validMarkDowns = validAndMergeMarkdowns(markdowns, stored_markdowns);
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
