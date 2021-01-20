import { NextApiHandler } from "next";
import {
  query,
  buildStatementForUpdate,
  buildStatementForQueryByID,
  buildStatementForDelete,
  getColumnValue,
} from "../../../lib/db";
import { templateTableName } from "../../../lib/constants";
import {
  getMarkdown,
  deleteMarkdown,
  storeMarkdown,
} from "../../../lib/markdown";

const validID = async (id: number) => {
  if (!id) {
    return false;
  }
  if (typeof parseInt(id.toString()) !== "number") {
    return false;
  }
  return true;
};

const deleteTemplate = async (req, res) => {
  const { id } = req.query;
  try {
    if (!validID(id)) {
      return res.status(400).json({ message: "invalid `id`" });
    }
    if (!(await validateTemplateByID(id))) {
      res.status(404).json({ message: "template not found" });
      return;
    }
    await deleteMarkdown(id);
    let { statement, values } = buildStatementForDelete(templateTableName, id);
    await query(statement, values);

    res.status(200).json({ message: "template deleted" });
    return;
  } catch (e) {
    res.status(500).json({ message: e.message });
    return;
  }
};

export const getTemplateById = async (id: number) => {
  let { statement, values } = buildStatementForQueryByID(templateTableName, id);
  return await query(statement, values);
};

const validateTemplateByID = async (id: number) => {
  const results = await getTemplateById(id);
  if (Object.keys(results).length == 0) {
    return false;
  }
  return true;
};

const getTemplate = async (req, res) => {
  const { id } = req.query;
  try {
    if (!validID(id)) {
      return res.status(400).json({ message: "invalid `id`" });
    }
    const results = (await getTemplateById(id)) as any[];
    if (results.length == 0) {
      res.status(404).json({ message: "template not found" });
      return;
    }
    let result = results[0];
    const markdowns = await getMarkdown(result.id);
    result["markdowns"] = markdowns;
    return res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
    return;
  }
};

const updateTemplate = async (req, res) => {
  const { id } = req.query;
  try {
    if (!validID(id)) {
      res.status(400).json({ message: "invalid `id`" });
      return;
    }
    if (!(await validateTemplateByID(id))) {
      res.status(404).json({ message: "template not found" });
      return;
    }
    const key_value = getColumnValue(req.body, ["name", "creator", "html"]);
    let { statement, values } = buildStatementForUpdate(
      key_value,
      templateTableName,
      id
    );
    await query(statement, values);
    if ("markdowns" in req.body) {
      await deleteMarkdown(id);
      for (const markdown of req.body["markdowns"]) {
        const { name, type, default_value } = markdown;
        await storeMarkdown(name, type, id, default_value);
      }
    }

    res.status(200).json({ message: "template updated" });
    return;
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
    return;
  }
};

/**
 * Handler to create template
 * @param  {req} req - request
 * @param  {res} res - response
 */
const templateHandler: NextApiHandler = async (req, res) => {
  const method = req.method;

  switch (method) {
    case "GET":
      return await getTemplate(req, res);
    case "PUT":
      return await updateTemplate(req, res);
    case "DELETE":
      return await deleteTemplate(req, res);
    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
};

export default templateHandler;
