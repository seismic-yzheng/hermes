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
    console.log("create");
    try {
      const id = await createTemplate(
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
      console.log(id);
    } catch (e) {
      throw Error(e.message);
    }
  }
}

datagen().then(() => process.exit());
// async function datagen(){
//     for (file of fs.readdirSync(dir)) {
//     fs.readFile(dir + file, (err, fileData) => {
// const data = JSON.parse(fileData);
//             const id = await createTemplate(
//                 data["name"],
//                  data["design"],
//                 data["subject"],
//                 data["creator"],
//                 data["likes"],
//                 data["used"],
//                 data["total_rate"],
//                 data["rate_count"],
//                 data["shared"]
//             )
//     });
//     }
// }

// datagen().then(() => process.exit());
// // Create "entries" table if doesn't exist
// async function createTemplateTable() {
//   try {
//     await query(`
//     CREATE TABLE IF NOT EXISTS template (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(128) NOT NULL DEFAULT "",
//       html TEXT NOT NULL,
//       design JSON NOT NULL,
//       subject TEXT DEFAULT NULL,
//       creator VARCHAR(32) NOT NULL,
//       likes INT NOT NULL DEFAULT 0,
//       used INT NOT NULL DEFAULT 0,
//       total_rate FLOAT NOT NULL DEFAULT 0.0,
//       rate_count INT NOT NULL DEFAULT 0,
//       rate FLOAT NOT NULL DEFAULT 0.0,
//       shared BOOLEAN NOT NULL DEFAULT FALSE,
//       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       updated_at
//         TIMESTAMP
//         NOT NULL
//         DEFAULT CURRENT_TIMESTAMP
//         ON UPDATE CURRENT_TIMESTAMP
//     )
//     `);
//   } catch (e) {
//     console.log(e.message);
//     process.exit(1);
//   }
// }

// async function createMarkdownTable() {
//   try {
//     await query(`
//     CREATE TABLE IF NOT EXISTS markdown (
//       id INT AUTO_INCREMENT,
//       type VARCHAR(16) NOT NULL,
//       name VARCHAR(128) NOT NULL,
//       PRIMARY KEY (id)
//     )
//     `);

//     await query(`
//     CREATE TABLE IF NOT EXISTS template_markdown (
//       template_id INT NOT NULL,
//       markdown_id INT NOT NULL,
//       default_value VARCHAR(128) DEFAULT NULL,
//       PRIMARY KEY (template_id, markdown_id),
//       FOREIGN KEY (template_id) REFERENCES template(id),
//       FOREIGN KEY (markdown_id) REFERENCES markdown(id)
//     )
//     `);
//   } catch (e) {
//     console.log(e.message);
//     process.exit(1);
//   }
// }

// async function createCategoryTable() {
//   try {
//     await query(`
//     CREATE TABLE IF NOT EXISTS category (
//       id INT AUTO_INCREMENT,
//       name VARCHAR(128) NOT NULL,
//       PRIMARY KEY (id)
//     )
//     `);

//     await query(`
//     CREATE TABLE IF NOT EXISTS template_category (
//       template_id INT NOT NULL,
//       category_id INT NOT NULL,
//       PRIMARY KEY (template_id, category_id),
//       FOREIGN KEY (template_id) REFERENCES template(id),
//       FOREIGN KEY (category_id) REFERENCES category(id)
//     )
//     `);
//   } catch (e) {
//     console.log(e.message);
//     process.exit(1);
//   }
// }

// async function createReviewTable() {
//   try {
//     await query(`
//     CREATE TABLE IF NOT EXISTS review (
//       id INT AUTO_INCREMENT,
//       review TEXT NOT NULL,
//       rate FLOAT NOT NULL DEFAULT 0.0,
//       user VARCHAR(128) NOT NULL,
//       template_id INT NOT NULL,
//       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (template_id) REFERENCES template(id),
//       PRIMARY KEY (id)
//     )
//     `);
//   } catch (e) {
//     console.log(e.message);
//     process.exit(1);
//   }
// }

// async function migrate() {
//   await createTemplateTable();
//   await createMarkdownTable();
//   await createCategoryTable();
//   await createReviewTable();
//   console.log("migration ran successfully");
// }
// migrate().then(() => process.exit());
