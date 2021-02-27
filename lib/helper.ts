import { createTransport, createTestAccount } from "nodemailer";

export async function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function sleep(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  html: string
) {
  let transporter = createTransport({
    host: "172.17.8.100",
    port: 32500,
    secure: false,
  });

  let mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`error: ${error}`);
      throw new Error("fail to send");
    }
    console.log(`Message Sent ${info.response}`);
  });
}
