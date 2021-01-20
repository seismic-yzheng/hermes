import * as Mustache from "mustache";

export function apply(template: string, markdowns: object) {
  return Mustache.render(template, markdowns);
}
