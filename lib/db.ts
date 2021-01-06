import mysql from 'serverless-mysql'

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT),
  },
})

export async function query(
  q: string,
  values: (string | number)[] | string | number = []
) {
  try {
    const results = await db.query(q, values)
    await db.end()
    return results
  } catch (e) {
    console.log(e.message)
    throw Error(e.message)
  }
}

export async function create_template() {
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
    `)
    console.log('migration ran successfully')
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

export async function truncate_template() {
  try {
    await query(`TRUNCATE TABLE template`)
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}