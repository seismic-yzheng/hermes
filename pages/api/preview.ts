import { NextApiHandler } from "next";
import { render } from "../../lib/template";

const sendEmailHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { id, markdowns, subject } = req.body;
  console.log(markdowns, subject);
  try {
    const rendered = await render(id, markdowns, subject);
    if (!rendered) {
      res.status(404).json({ message: "template not found" });
    }
    return res.json(rendered);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default sendEmailHandler;
