import mysql from "serverless-mysql";
import Filter from "bad-words";

const filter = new Filter();

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT),
  },
});

export async function query(
  q: string,
  values: (string | number)[] | string | number = []
) {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (e) {
    console.log(e);
    throw Error(e.message);
  }
}

export function getColumnValue(key_value: object, columns: string[]) {
  let res = {};
  columns.forEach((item) => {
    if (item in key_value) {
      if (key_value[item] == null) {
      } else if (key_value[item] instanceof Object) {
        res[item] = JSON.stringify(key_value[item]);
      } else {
        res[item] = key_value[item];
      }
    }
  });
  return res;
}

export function getColumnValueForSearch(key_value: object, columns: object) {
  let res = {};
  Object.keys(columns).forEach((key) => {
    if (key in key_value) {
      res[columns[key]["col"]] = {
        value: key_value[key],
        include: columns[key]["include"],
      };
    }
  });
  return res;
}

export function buildStatementForUpdate(
  key_value: {},
  table: string,
  id: number
) {
  let statement = "UPDATE ";
  statement += table;
  statement += " SET ";
  let values = [] as string[];
  let attrs = [] as string[];
  Object.keys(key_value).forEach((key) => {
    attrs.push(key + " = ?");
    values.push(filter.clean(String(key_value[key])));
  });
  statement += attrs.join(",");
  statement += " WHERE id = ?";
  values.push(filter.clean(String(id)));
  return { statement: statement, values: values };
}

/*
SELECT template FROM template
JOIN category
JOIN template_category
ON template.id = template_category.template_id AND template_category.category_id = category.id
WHERE template.name = test16156640191948947;

"tableName" : {
  "select": ["*"],
  "keyValue": {"a": "value"},
  "order": {"order_by": "a", "sort_by": "b"}
}


*/

export function buildSelectStatement(
  keyValue: object,
  distinct: Boolean = true
) {
  let values = [] as string[];
  Object.keys(keyValue).forEach((tableName) => {
    let select = [] as string[];
    for (const col of keyValue[tableName]) {
      select.push(tableName + "." + col);
    }
    if (select.length > 0) {
      values.push(select.join(" , "));
    } else {
      values.push(tableName + ".*");
    }
  });
  if (distinct) {
    return "SELECT DISTINCT " + values.join(" , ");
  }
  return "SELECT " + values.join(" , ");
}

export function buildCountStatement(
  count_col: String,
  distinct: Boolean = true
) {
  if (distinct) {
    return "SELECT COUNT(DISTINCT " + count_col + ") ";
  }
  return "SELECT COUNT(" + count_col + ") ";
}

export function buildFromStatement(tables: string[], conditions: string[]) {
  let statement = " FROM " + tables[0];
  if (conditions.length > 0) {
    for (let i = 0; i < conditions.length; i++) {
      statement += " LEFT JOIN " + tables[i + 1];
      statement += " ON " + conditions[i];
    }
  }
  return statement;
}

export function buildWhereStatement(keyValue: object) {
  let whereStatement = "";
  let values = [] as string[];
  let attrs = [] as string[];
  Object.keys(keyValue).forEach((tableName) => {
    Object.keys(keyValue[tableName]).forEach((key) => {
      let { value, include, extraWhereStatement } = keyValue[tableName][key];
      let col = tableName + "." + key;
      if (value instanceof Array) {
        let sub_attrs = [] as string[];
        value.forEach((item) => {
          sub_attrs.push("?");
          values.push(filter.clean(String(item)));
        });
        if (include) {
          attrs.push(col + " in (" + sub_attrs.join(",") + ")");
        } else {
          attrs.push(col + " not in (" + sub_attrs.join(",") + ")");
        }
      } else {
        if (include) {
          attrs.push(col + "= ?");
        } else {
          attrs.push(col + "!= ?");
        }
        values.push(filter.clean(String(value)));
      }
      if (extraWhereStatement) {
        for (const extra of extraWhereStatement) {
          attrs[attrs.length - 1] += extra[1];
          values.push(filter.clean(String(extra[0])));
        }
      }
    });
  });
  if (attrs.length > 0) {
    whereStatement += " WHERE ";
    whereStatement += attrs.join(" AND ");
  }
  return { whereStatement: whereStatement, values: values };
}

export function buildFilterStatement(
  order_by: string = undefined,
  sort_by: string = "ASC",
  limit: number = undefined,
  offset: number = undefined
) {
  let statement = "";
  if (order_by != undefined) {
    statement += " ORDER BY ";
    statement += order_by;
    statement += " ";
    statement += sort_by;
  }
  if (limit != undefined) {
    statement += " LIMIT ";
    statement += limit;
  }
  if (offset != undefined) {
    statement += " OFFSET ";
    statement += offset;
  }
  return statement;
}

export function buildStatementForQueryWithJoin(
  selectKV: object,
  joinTables: string[],
  conditions: string[],
  whereKV: object,
  order_by: string = undefined,
  sort_by: string = "ASC",
  limit: number = undefined,
  offset: number = undefined,
  count_col: string = undefined
) {
  let statement = undefined;
  if (count_col) {
    statement = buildCountStatement(count_col);
  } else {
    statement = buildSelectStatement(selectKV);
  }
  statement += buildFromStatement(joinTables, conditions);
  const { whereStatement, values } = buildWhereStatement(whereKV);
  statement += whereStatement;
  statement += buildFilterStatement(order_by, sort_by, limit, offset);
  return { statement: statement, values: values };
}

export function buildStatementForQuery(
  keyValue: {},
  table: string,
  order_by: string = undefined,
  sort_by: string = "ASC",
  limit: number = undefined,
  offset: number = undefined,
  count_col: string = undefined
) {
  const selectKV = {};
  selectKV[table] = [];
  const whereKV = {};
  whereKV[table] = keyValue;
  return buildStatementForQueryWithJoin(
    selectKV,
    [table],
    [],
    whereKV,
    order_by,
    sort_by,
    limit,
    offset,
    count_col
  );
}

export function buildStatementForQueryByID(table: string, id: number) {
  let statement = "SELECT * FROM ";
  statement += table;
  statement += " WHERE id = ?";
  let values = [filter.clean(String(id))];
  return { statement: statement, values: values };
}

export function buildStatementForDelete(table: string, id: number) {
  let statement = "DELETE FROM ";
  statement += table;
  statement += " WHERE id = ?";
  let values = [filter.clean(String(id))];
  return { statement: statement, values: values };
}

export function buildStatementForInsert(key_value: {}, table: string) {
  let statement = "INSERT INTO ";
  statement += table;
  let values = [] as string[];
  let keys = [] as string[];
  let attrs = [] as string[];
  Object.keys(key_value).forEach((key) => {
    if (String(key_value[key])) {
      attrs.push("?");
      keys.push(key);
      values.push(filter.clean(String(key_value[key])));
    }
  });
  statement += " ( ";
  statement += keys.join(",");
  statement += " ) VALUES ( ";
  statement += attrs.join(",");
  statement += " )";
  return { statement: statement, values: values };
}

export async function truncateTable(table: string) {
  try {
    await query("SET FOREIGN_KEY_CHECKS = 0");
    await query("TRUNCATE TABLE " + table);
    await query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("truncated table " + table);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}
