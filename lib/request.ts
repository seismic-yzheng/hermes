export function getLimit(req) {
  if ("limit" in req.query) {
    return Number(req.query["limit"]);
  }
  return undefined;
}

export function getOffset(req) {
  if ("offset" in req.query) {
    return Number(req.query["offset"]);
  }
  return undefined;
}

export function getOrderBy(req, allowed: string[]) {
  if ("order_by" in req.query) {
    const order_by = String(req.query["order_by"]);
    validateOrderBy(order_by, allowed);
    return order_by;
  }
  return undefined;
}

export function getSortBy(req) {
  if ("sort_by" in req.query) {
    const sort_by = String(req.query["sort_by"]);
    validateSortBy(sort_by);
    return sort_by;
  }
  return "ASC";
}

export function validateSortBy(sort_by: string) {
  if (!["DESC", "ASC"].includes(sort_by)) {
    throw new Error("invalid sort: " + sort_by);
  }
}

export function validateOrderBy(order_by: string, allowed: string[]) {
  if (!allowed.includes(order_by)) {
    throw new Error("invalid order: " + order_by);
  }
}
