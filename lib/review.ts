import { query } from "./db";
import { reviewTableName } from "./constants";
import Filter from "bad-words";

const filter = new Filter();

export async function deleteReviewByTemplate(template_id: number) {
  let statement = "DELETE FROM " + reviewTableName + " WHERE template_id = ?";
  let values = [filter.clean(String(template_id))];
  return await query(statement, values);
}
