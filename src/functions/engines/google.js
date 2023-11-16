import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";
import writeFile from "../write_file";

export default async function google_search(query) {
  const userAgent = new UserAgent();
  const { data } = await axios.get(`https://www.google.com/search?q=${query}`, {
    headers: {
      "User-Agent": userAgent.toString(),
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  const $ = cheerio.load(data);
  writeFile("../../../../../google.html", data);
  const results = $(
    ".LC20lb.MBeuO.DKV0Md, .v7jaNc.ynAwRc.MBeuO.q8U8x.oewGkc.LeUQr"
  );

  try {
    console.log(results);
    const text = results.text();
    console.log(text);
  } catch (e) {
    console.log(e);
  }

  var products = [];

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    const text = $(product).text();
    products.push(text);
  }

  products = products.map((product) => removeSpecialCharacters(product));
  return products;
}
