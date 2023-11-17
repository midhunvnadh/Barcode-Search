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
  const results = $(".MjjYud");

  var products = [];

  for (var i = 0; i < results.length; i++) {
    const product = results[i];
    var price = "";

    const possibePriceClasses = $(product).find(".KeHKI, .fG8Fp.uo4vr span");

    for (var j = 0; j < possibePriceClasses.length; j++) {
      const possiblePrice = possibePriceClasses[j];
      const possiblePriceText = $(possiblePrice).text();
      const extractedPrice = extractPrice(possiblePriceText);
      if (extractedPrice) {
        price = possiblePriceText;
      }
    }

    const name = $(product)
      .find(".v7jaNc.ynAwRc.MBeuO.q8U8x.oewGkc.LeUQr, .LC20lb.MBeuO.DKV0Md")
      .text();

    if (name) products.push({ name: removeSpecialCharacters(name), price });
  }

  return products;
}

function extractPrice(str) {
  // Regular expression to match the numeric value in the string
  const regex = /(?:\$|€|₹)[+-]?\d+(\.\d+)?/g;

  // Extracting the matched value using the regex
  const match = str.match(regex);

  // If a match is found, return the matched value, else return null
  return match ? match[0].slice(1) : null;
}
