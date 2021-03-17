import { NextApiHandler } from "next";
import {
  query,
  buildStatementForQuery,
  getColumnValueForSearch,
  buildStatementForQueryWithJoin,
} from "../../lib/db";
import { getOrderBy, getSortBy, getLimit, getOffset } from "../../lib/request";
import { templateTableName } from "../../lib/constants";
import { getMarkdownForTemplate } from "../../lib/markdown";

const templatesHandler: NextApiHandler = async (req, res) => {
  if (req.method != "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    let order_by = getOrderBy(req, ["created_at"]);
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
    let statement = undefined;
    let values = undefined;
    if ("categories" in req.query) {
      if (order_by) {
        order_by = "template." + order_by;
      }
      const res = buildStatementForQueryWithJoin(
        { template: [] },
        ["template", "category", "template_category"],
        [
          "template.id = template_category.template_id",
          "template_category.category_id = category.id",
        ],
        {
          category: {
            name: { value: req.query["categories"], include: true },
          },
          template: key_value,
        },
        order_by,
        sort_by,
        limit,
        offset
      );
      statement = res["statement"];
      values = res["values"];
      console.log(statement, values);
    } else {
      const res = buildStatementForQuery(
        key_value,
        templateTableName,
        order_by,
        sort_by,
        limit,
        offset
      );
      statement = res["statement"];
      values = res["values"];
    }
    let results = (await query(statement, values)) as any[];
    for (let result of results) {
      const markdown = await getMarkdownForTemplate(result.id);
      result["markdowns"] = markdown;
    }
    return res.json(results);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
};

export default templatesHandler;
