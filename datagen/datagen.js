const path = require("path");
const fs = require("async-file");

const envPath = path.resolve(process.cwd(), ".env.local");

require("dotenv").config({ path: envPath });

const mysql = require("serverless-mysql");

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT),
  },
});

async function query(q, values) {
  try {
    console.log(q, values);
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}
const dir = "./datagen/templates/";
const htmlDir = "./datagen/html/";

async function createReview(template_id, reviews) {
  for (review_item of reviews) {
    const { review, rate, user } = review_item;
    await query(
      "INSERT INTO review (review, rate, user, template_id) VALUES (?, ?, ?, ?)",
      [review, rate, user, template_id]
    );
  }
}
async function createMarkdown(template_id, markdowns) {
  for (markdown of markdowns) {
    const { name, type, default_value } = markdown;
    let id;
    let res = await query("SELECT * FROM markdown WHERE type=? AND name=?", [
      name,
      type,
    ]);
    if (Object.keys(res).length == 0) {
      res = await query("INSERT INTO markdown (type, name) VALUES (?, ?)", [
        type,
        name,
      ]);
      id = res["insertId"];
    } else {
      id = res[0].id;
    }
    if (default_value) {
      await query(
        "INSERT INTO template_markdown (template_id, markdown_id, default_value) VALUES (?, ?, ?)",
        [type, name, default_value]
      );
    } else {
      await query(
        "INSERT INTO template_markdown (template_id, markdown_id) VALUES (?, ?)",
        [template_id, id]
      );
    }
  }
}
async function createTemplate(
  name,
  design,
  subject,
  creator,
  likes,
  used,
  total_rate,
  rate_count,
  shared,
  html
) {
  const rate = total_rate / rate_count;
  const res = await query(
    "INSERT INTO template (name, design, subject, creator, likes, used, " +
      "total_rate, rate_count, shared, rate, html) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      JSON.stringify(design),
      subject,
      creator,
      likes,
      used,
      total_rate,
      rate_count,
      shared,
      rate,
      html,
    ]
  );
  return res["insertId"];
}

async function datagen() {
  for (file of await fs.readdir(dir)) {
    const data = JSON.parse(await fs.readFile(dir + file));
    const html = await fs.readFile(
      htmlDir + file.substr(0, file.lastIndexOf(".")) + ".html"
    );
    try {
      const template_id = await createTemplate(
        data["name"],
        data["design"],
        data["subject"],
        data["creator"],
        data["likes"],
        data["used"],
        data["total_rate"],
        data["rate_count"],
        data["shared"],
        html
      );
      console.log(template_id);
      await createMarkdown(template_id, data["markdowns"]);
      await createReview(template_id, data["reviews"]);
    } catch (e) {
      throw Error(e.message);
    }
  }
}

datagen().then(() => process.exit());
