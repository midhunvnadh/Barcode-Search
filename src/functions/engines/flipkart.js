import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";

import writeFile from "../write_file";

export default async function flipkart_search(query) {
  const userAgent = new UserAgent();
  const { data } = await axios.get(
    `https://www.flipkart.com/search?q=${query}`,
    {
      headers: {
        "User-Agent": userAgent.toString(),
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    }
  );
  const $ = cheerio.load(data);

  const results = $(".s1Q9rs, ._4rR01T, .css-16my406");

  var products = [];

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    const text = $(product).text();
    products.push(text);
  }

  products = products.map((product) => removeSpecialCharacters(product));
  return products;
}
