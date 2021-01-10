import mysql from 'serverless-mysql'
import Filter from 'bad-words'

const filter = new Filter()

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
    throw Error(e.message)
  }
}

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
    `)
    console.log('migration ran successfully')
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

export async function truncateTemplateTable() {
  try {
    await query(`TRUNCATE TABLE template`)
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

export const buildStatementForUpdate = async (body: {}, table: string, columns: string[], id: number) => {
  let statement = 'UPDATE '
  statement += table
  statement += ' SET '
  let values = [] as string[]
  let attrs = [] as string[]
  columns.forEach(item => {
    if (item in body) {
      attrs.push(item + ' = ?')
      values.push(filter.clean(String(body[item])))
    }
  })
  statement += attrs.join(',')
  statement += 'WHERE id = ?'
  values.push(filter.clean(String(id)))
  return { statement: statement, values: values }
}

export const getLimit = async (req) => {
  if ('limit' in req.query) {
    return Number(req.query['limit'])
  }
  return undefined
}

export const getOffset = async (req) => {
  if ('offset' in req.query) {
    return Number(req.query['offset'])
  }
  return undefined
}

export const getOrderBy = async (req, allowed: string[]) => {
  if ('order_by' in req.query) {
    const order_by = String(req.query['order_by'])
    validateOrderBy(order_by, allowed)
    return order_by
  }
  return undefined
}

export const getSortBy = async (req) => {
  if ('sort_by' in req.query) {
    const sort_by = String(req.query['sort_by'])
    validateSortBy(sort_by)
    return sort_by
  }
  return 'ASC'
}

export const validateSortBy = async (sort_by: string) => {
  if (!['DESC', 'ASC'].includes(sort_by)) {
    throw new Error("invalid sort")
  }
}

export const validateOrderBy = async (order_by: string, allowed: string[]) => {
  if (!allowed.includes(order_by)) {
    throw new Error("invalid order")
  }
}

export const buildStatementForQuery = async (
  query: {}, table: string, columns: string[], order_by: string = undefined, sort_by: string = 'ASC',
  limit: number = undefined, offset: number = undefined
) => {
  let statement = 'SELECT * FROM '
  statement += table

  let values = [] as string[]
  let attrs = [] as string[]
  columns.forEach(col => {
    if (col in query) {
      let col_val = query[col]
      if (col_val instanceof Array) {
        let sub_attrs = [] as string[]
        col_val.forEach(item => {
          sub_attrs.push('?')
          values.push(filter.clean(String(item)))
        })
        attrs.push(col + ' in (' + sub_attrs.join(',') + ')')
      }
      else {
        attrs.push(col + '= ?')
        values.push(filter.clean(String(col_val)))
      }
    }
  })
  if (attrs.length > 0) {
    statement += ' WHERE '
    statement += attrs.join(' AND ')
  }
  if (order_by != undefined) {
    statement += ' ORDER BY '
    statement += order_by
    statement += ' '
    statement += sort_by
  }
  if (limit != undefined) {
    statement += ' LIMIT '
    statement += limit
  }
  if (offset != undefined) {
    statement += ' OFFSET '
    statement += offset
  }
  return { statement: statement, values: values }
}

export const buildStatementForQueryByID = async (table: string, id: number) => {
  let statement = 'SELECT * FROM '
  statement += table
  statement += ' WHERE id = ?'
  let values = [filter.clean(String(id))]
  return { statement: statement, values: values }
}

export const buildStatementForDelete = async (table: string, id: number) => {
  let statement = 'DELETE FROM '
  statement += table
  statement += ' WHERE id = ?'
  let values = [filter.clean(String(id))]
  return { statement: statement, values: values }
}

export const buildStatementForInsert = async (body: {}, table: string, columns: string[]) => {
  let statement = 'INSERT INTO '
  statement += table
  let values = [] as string[]
  let attrs = [] as string[]
  columns.forEach(item => {
    if (item in body) {
      attrs.push('?')
      values.push(filter.clean(String(body[item])))
    }
    else {
      throw new Error("missing required column")
    }
  })
  statement += ' ( '
  statement += columns.join(',')
  statement += ' ) VALUES ( '
  statement += attrs.join(',')
  statement += ' )'
  return { statement: statement, values: values }
}