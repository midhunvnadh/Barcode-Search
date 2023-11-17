import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";

export default async function upcitemdb_com(query) {
  const userAgent = new UserAgent();
  const response = await fetch(`https://www.upcitemdb.com/upc/${query}`, {
    headers: {
      "User-Agent": userAgent.toString(),
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  const data = await response.text();
  const $ = cheerio.load(data);

  var products = [];
  const results = $(".num li");

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    const text = $(product).text();
    products.push(text);
  }

  products = products.map((product) => {
    return {
      name: removeSpecialCharacters(product),
    };
  });
  return products;
}
