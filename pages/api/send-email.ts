import { NextApiHandler } from "next";
import { getMarkdown } from "../../lib/markdown";
import { getTemplateById } from "../api/template/[id]";
import { apply } from "../../lib/template";

function validMarkdownType(type_str: string, value: any) {
  if (type_str == "string") {
    return value instanceof String;
  } else if ((type_str = "list")) {
    return value instanceof Array;
  } else {
    throw Error("Undefined type: " + type_str);
  }
}

function validAndMergeMarkdowns(markdowns: {}, stored_markdowns: any[]): {} {
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

const sendEmailHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    const template_id = req.body["id"];
    let markdowns = req.body["markdowns"];
    const results = (await getTemplateById(template_id)) as any[];
    if (results.length == 0) {
      res.status(404).json({ message: "template not found" });
      return;
    }
    const result = results[0];
    const stored_markdowns = (await getMarkdown(result.id)) as any[];
    const rendered = apply(
      result.html,
      validAndMergeMarkdowns(markdowns, stored_markdowns)
    );
    return res.json(rendered);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default sendEmailHandler;
