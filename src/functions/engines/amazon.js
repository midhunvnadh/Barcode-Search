import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";
import writeFile from "../write_file";

export default async function amazon_search(query) {
  const userAgent = new UserAgent();
  const { data } = await axios.get(`https://www.amazon.com/s?k=${query}`, {
    headers: {
      "User-Agent": userAgent.toString(),
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  const $ = cheerio.load(data);
  writeFile("../../../../../scrape.html", data);

  const results = $(
    ".a-size-base-plus.a-color-base.a-text-normal, .a-size-small.a-color-base.a-text-normal"
  );

  var products = [];

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    const text = $(product).text();
    products.push(text);
  }
  products = [...new Set(products)];

  products = products.map((product) => removeSpecialCharacters(product));

  products = products.map((product) => {
    return { name: product, price: "" };
  });
  return products;
}
