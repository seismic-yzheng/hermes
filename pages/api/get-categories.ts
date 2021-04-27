import { NextApiHandler } from "next";
import Filter from "bad-words";

const filter = new Filter();

const getCategoriesHandler: NextApiHandler = async (req, res) => {
  const cate = [
    "car",
    "fruit",
    "house",
    "people",
    "computer",
    "lamp",
    "keyboard",
    "speaker",
    "place",
    "country",
    "mouse",
    "laptop",
    "screen",
    "rule",
    "paper",
    "tea",
    "drink",
    "pad",
    "tissue",
  ];
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
    // const categories = await getCategories(text);
    const categories = ["abc", "efg"];
    return res.json(categories);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export default getCategoriesHandler;
