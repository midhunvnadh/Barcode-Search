import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "./removeSpecialChars";

export default async function upcitemdb_com(query) {
  try {
    const response = await fetch(`https://www.upcitemdb.com/upc/${query}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
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

    products = products.map((product) => removeSpecialCharacters(product));
    return products;
  } catch (e) {
    return [];
  }
}
