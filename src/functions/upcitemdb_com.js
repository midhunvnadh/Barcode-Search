import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "./removeSpecialChars";

export default async function upcitemdb_com(query) {
  try {
    const { data } = await axios.get(`https://www.upcitemdb.com/upc/${query}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    const $ = cheerio.load(data);

    var products = [];
    const results = $(".num li");

    console.log(results);

    for (var i = 0; i < results.length; i++) {
      const product = results[i];
      const text = $(product).text();
      products.push(text);
    }

    console.log(products);

    products = products.map((product) => removeSpecialCharacters(product));
    return products;
  } catch (e) {
    console.log(e);
    return [];
  }
}
