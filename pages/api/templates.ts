import { NextApiHandler } from "next";
import {
  query,
  buildStatementForQuery,
  getColumnValueForSearch,
} from "../../lib/db";
import { getOrderBy, getSortBy, getLimit, getOffset } from "../../lib/request";
import { templateTableName } from "../../lib/constants";
import { getMarkdown } from "../../lib/markdown";

const templatesHandler: NextApiHandler = async (req, res) => {
  if (req.method != "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    const order_by = getOrderBy(req, ["created_at"]);
    const sort_by = getSortBy(req);
    const limit = getLimit(req);
    const offset = getOffset(req);
    const key_value = getColumnValueForSearch(req.query, {
      ids: { col: "id", include: true },
      exclude_ids: { col: "id", include: false },
      names: { col: "name", include: true },
      exclude_names: { col: "name", include: false },
      creators: { col: "creator", include: true },
      exclude_creators: { col: "creator", include: false },
    });
    let { statement, values } = buildStatementForQuery(
      key_value,
      templateTableName,
      order_by,
      sort_by,
      limit,
      offset
    );
    let results = (await query(statement, values)) as any[];
    for (let result of results) {
      const markdown = await getMarkdown(result.id);
      result["markdowns"] = markdown;
    }
    return res.json(results);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
};

export default templatesHandler;
