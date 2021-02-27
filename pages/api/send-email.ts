import { NextApiHandler } from "next";
import { render } from "../../lib/template";
import { sendEmail } from "../../lib/helper";

const sendEmailHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    const rendered = await render(req.body["id"], req.body["markdowns"]);
    const recipients = req.body["recipients"];
    console.log(recipients);
    if (!rendered) {
      res.status(404).json({ message: "template not found" });
    }
    const fake_sender = "test@test.com";
    await sendEmail(fake_sender, recipients, "", rendered);
    return res.json(rendered);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default sendEmailHandler;
