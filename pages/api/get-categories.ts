import { NextApiHandler } from "next";
import Filter from "bad-words";
import { getCategories } from "lib/textrazor";

const filter = new Filter();

const getCategoriesHandler: NextApiHandler = async (req, res) => {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { text } = req.body;
  try {
    if (!text) {
      return res.status(400).json({
        message: "`text` is required",
      });
    }
    const categories = await getCategories(text);
    // const categories = ["abc", "efg"];
    return res.json(categories);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export default getCategoriesHandler;
