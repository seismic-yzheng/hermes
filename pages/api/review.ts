import { NextApiHandler } from "next";
import {
  query,
  buildStatementForQuery,
  buildStatementForInsert,
  getColumnValue,
} from "../../lib/db";
import { reviewTableName } from "../../lib/constants";
import { updateTemplateRate } from "../../lib/template";

const getReview = async (req, res) => {
  const { template_id } = req.query;
  try {
    const { statement, values } = buildStatementForQuery(
      { template_id: { value: template_id, include: true } },
      reviewTableName,
      "created_at",
      "DESC"
    );
    let results = (await query(statement, values)) as any[];
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
    return;
  }
};

const createReview = async (req, res) => {
  const { review, rate, user, template_id } = req.body;
  if (!review || !rate || !user || !template_id) {
    return res.status(400).json({
      message: "`review`, `rate`, `user` and `template_id` are required",
    });
  }
  try {
    const key_value = getColumnValue(req.body, [
      "review",
      "rate",
      "user",
      "template_id",
    ]);
    const { statement, values } = buildStatementForInsert(
      key_value,
      reviewTableName
    );
    const results = await query(statement, values);
    const id = results["insertId"];
    await updateTemplateRate(template_id, rate);
    res.json({ id: id });
  } catch (e) {
    res.status(500).json({ message: e.message });
    return;
  }
};

const reviewHandler: NextApiHandler = async (req, res) => {
  const method = req.method;

  switch (method) {
    case "GET":
      return await getReview(req, res);
    case "POST":
      return await createReview(req, res);
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
};

export default reviewHandler;
