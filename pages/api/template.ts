import { NextApiHandler } from "next";
import Filter from "bad-words";
import { query, buildStatementForInsert, getColumnValue } from "../../lib/db";
import { templateTableName } from "../../lib/constants";
import { storeMarkdown } from "../../lib/markdown";

const filter = new Filter();

const createTemplateHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { name, creator, html, design, markdowns } = req.body;
  try {
    if (!name || !creator || !html || !design) {
      return res.status(400).json({
        message: "`name`, `creator`, `html` and `design` are required",
      });
    }
    const key_value = getColumnValue(req.body, [
      "name",
      "creator",
      "html",
      "design",
    ]);
    console.log(req.body.design);
    const { statement, values } = buildStatementForInsert(
      key_value,
      templateTableName
    );
    const results = await query(statement, values);
    const id = results["insertId"];
    if (markdowns) {
      for (const markdown of markdowns) {
        const { name, type, default_value } = markdown;
        await storeMarkdown(name, type, id, default_value);
      }
    }
    return res.json({ id: id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default createTemplateHandler;
