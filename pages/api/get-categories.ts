import { NextApiHandler } from "next";
import Filter from "bad-words";
import { getCategories } from "../../lib/textrazor";
import nlp from "compromise";
import uclassify from "uclassify";
import { query, buildStatementForInsert, getColumnValue } from "../../lib/db";
import { templateTableName } from "../../lib/constants";
import { storeMarkdown } from "../../lib/markdown";

const filter = new Filter();

const getCategoriesHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { text } = req.body;
  try {
    if (!text) {
      return res.status(400).json({
        message: "`text` is required",
      });
    }
    const categories = await getCategories(text);
    console.log(categories);
    return res.json(categories);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export default getCategoriesHandler;
