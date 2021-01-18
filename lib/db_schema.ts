import { query, truncateTable } from "./db";

export async function createTemplateTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS template (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        html TEXT NOT NULL,
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
    console.log("created template table");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

export async function truncateTemplateTable() {
  await truncateTable("template");
}

export async function createMarkdownTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS markdown (
        id INT AUTO_INCREMENT,
        type VARCHAR(16) NOT NULL,
        name VARCHAR(128) NOT NULL,
        PRIMARY KEY (id)
      )
      `);
    console.log("created template_markdown table");
    await query(`
      CREATE TABLE IF NOT EXISTS template_markdown (
        template_id INT NOT NULL,
        markdown_id INT NOT NULL,
        default_value VARCHAR(128),
        PRIMARY KEY (template_id, markdown_id),
        FOREIGN KEY (template_id) REFERENCES template(id),
        FOREIGN KEY (markdown_id) REFERENCES markdown(id)
      )
      `);
    console.log("created template_markdown table");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

export async function truncateMarkdownTable() {
  await truncateTable("markdown");
  await truncateTable("template_markdown");
}
