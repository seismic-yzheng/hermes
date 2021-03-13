const path = require("path");
const envPath = path.resolve(process.cwd(), ".env.local");

console.log({ envPath });

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

async function query(q) {
  try {
    const results = await db.query(q);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}

// Create "entries" table if doesn't exist
async function createTemplateTable() {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS template (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      html TEXT NOT NULL,
      design JSON NOT NULL,
      subject TEXT DEFAULT NULL,
      creator VARCHAR(32) NOT NULL,
      likes INT NOT NULL DEFAULT 0,
      used INT NOT NULL DEFAULT 0,
      rate INT NOT NULL DEFAULT -1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at
        TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
    `);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

async function createMarkdownTable() {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS markdown (
      id INT AUTO_INCREMENT,
      type VARCHAR(16) NOT NULL,
      name VARCHAR(128) NOT NULL,
      PRIMARY KEY (id)
    )
    `);

    await query(`
    CREATE TABLE IF NOT EXISTS template_markdown (
      template_id INT NOT NULL,
      markdown_id INT NOT NULL,
      default_value VARCHAR(128) DEFAULT NULL,
      PRIMARY KEY (template_id, markdown_id),
      FOREIGN KEY (template_id) REFERENCES template(id),
      FOREIGN KEY (markdown_id) REFERENCES markdown(id)
    )
    `);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

async function createCategoryTable() {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT,
      name VARCHAR(128) NOT NULL,
      PRIMARY KEY (id)
    )
    `);

    await query(`
    CREATE TABLE IF NOT EXISTS template_category (
      template_id INT NOT NULL,
      category_id INT NOT NULL,
      PRIMARY KEY (template_id, category_id),
      FOREIGN KEY (template_id) REFERENCES template(id),
      FOREIGN KEY (category_id) REFERENCES category(id)
    )
    `);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

async function migrate() {
  await createTemplateTable();
  await createMarkdownTable();
  await createCategoryTable();
  console.log("migration ran successfully");
}
migrate().then(() => process.exit());
