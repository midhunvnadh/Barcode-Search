import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "./removeSpecialChars";

export default async function flipkart_search(query) {
  const { data } = await axios.get(
    `https://www.flipkart.com/search?q=${query}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept-Encoding": "gzip, deflate, br",
      },
    }
  );
  const $ = cheerio.load(data);

  const results = $(".s1Q9rs, ._4rR01T");

  var products = [];

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    const text = $(product).text();
    products.push(text);
  }

  products = products.map((product) => removeSpecialCharacters(product));
  return products;
}
