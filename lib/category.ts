import { query, buildStatementForInsert } from "./db";
import { categoryTableName, templateCategoryTableName } from "./constants";
import Filter from "bad-words";

const filter = new Filter();

async function getOrCreateCategory(name: string) {
  let id: string;
  let results = await getCategoryByName(name);
  console.log(results);
  if (Object.keys(results).length == 0) {
    let { statement, values } = buildStatementForInsert(
      { name: name },
      categoryTableName
    );
    console.log(statement, values);
    results = await query(statement, values);
    id = results["insertId"];
  } else {
    id = results[0].id;
  }
  return id;
}

async function storeTemplateCategory(category_id: number, template_id: number) {
  let key_value = {
    template_id: template_id,
    category_id: category_id,
  };
  let { statement, values } = buildStatementForInsert(
    key_value,
    templateCategoryTableName
  );
  return await query(statement, values);
}

export async function storeCategoryForTemplate(
  name: string,
  template_id: number
) {
  const category_id = (await getOrCreateCategory(name)) as any;
  await storeTemplateCategory(category_id, template_id);
}

export async function getCategoryForTemplate(template_id: number) {
  let statement = "SELECT name FROM ";
  statement += templateCategoryTableName;
  statement += " JOIN ";
  statement += categoryTableName;
  statement +=
    " ON template_category.category_id=category.id WHERE template_id=?";
  const values = [filter.clean(String(template_id))];
  const categories = (await query(statement, values)) as [];
  let res = [];
  for (const category of categories) {
    res.push(category["name"]);
  }
  return res;
}

export async function deleteCategoryByTemplate(template_id: number) {
  let statement =
    "DELETE FROM " + templateCategoryTableName + " WHERE template_id = ?";
  let values = [filter.clean(String(template_id))];
  return await query(statement, values);
}

async function getCategoryByName(name: any) {
  let statement = "SELECT * FROM " + categoryTableName + " WHERE name = ?";
  let values = [filter.clean(String(name))];
  return await query(statement, values);
}
