import { NextApiHandler } from "next";
import { query, buildStatementForInsert, getColumnValue } from "../../lib/db";
import { templateTableName } from "../../lib/constants";
import { storeMarkdownForTemplate } from "../../lib/markdown";
import { storeCategoryForTemplate } from "../../lib/category";
import { storeTemplate } from "../../lib/template";

const createTemplateHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { name, creator, html, design } = req.body;
  try {
    if (!name || !creator || !html || !design) {
      return res.status(400).json({
        message: "`name`, `creator`, `html` and `design` are required",
      });
    }
    const id = await storeTemplate(req.body);
    return res.json({ id: id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export default createTemplateHandler;
