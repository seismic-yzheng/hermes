import { NextApiHandler } from "next";
import { render, updateTemplateUsed } from "../../lib/template";

const sendEmailHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    const { id, markdowns, subject } = req.body;
    const rendered = await await render(id, markdowns, subject);
    if (!rendered) {
      res.status(404).json({ message: "template not found" });
    }
    const recipients = req.body["recipients"];
    const html = rendered["html"];
    const emailSubject = rendered["subject"];
    const fake_sender = "test@test.com";
    // await sendEmail(fake_sender, recipients, emailSubject, html);
    await updateTemplateUsed(id);
    return res.json("ok");
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default sendEmailHandler;
