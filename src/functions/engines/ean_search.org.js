import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";

export default async function ean_search_org(query) {
  const userAgent = new UserAgent();
  const { data } = await axios.get(`https://www.ean-search.org/?q=${query}`, {
    headers: {
      "User-Agent": userAgent.toString(),
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  const $ = cheerio.load(data);

  const results = $(".product-name");

  var products = [];

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    const text = $(product).text();
    products.push(text);
  }

  products = products.map((product) => removeSpecialCharacters(product));
  return products;
}
