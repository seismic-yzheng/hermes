export async function getCategories(text: string) {
  const textrazorURL = "https://api.textrazor.com";
  const max_category = 5;
  const body =
    "extractors=topics,categories&classifiers=textrazor_newscodes&text=" + text;
  const result = await fetch(textrazorURL, {
    method: "POST",
    headers: { "x-textrazor-key": process.env.TEXTRAZOR_API_KEY },
    body: body,
  });
  if (result.status != 200) {
    throw Error("error fetch textrazor");
  }
  let response = await result.json();
  response = response["response"];
  const topics = response["topics"];
  const categories = response["categories"];
  let res = [] as string[];
  if (categories) {
    categories.forEach((category) => {
      if (res.length >= max_category) {
        return res;
      }
      let label = category["label"].split(">");
      if (label.length > 1) {
        res.push(label[label.length - 1]);
      } else {
        res.push(label[0]);
      }
    });
  }
  if (res.length < max_category && topics) {
    topics.forEach((topic) => {
      if (res.length >= max_category) {
        return res;
      }
      res.push(topic["label"]);
    });
  }

  return res;
}
