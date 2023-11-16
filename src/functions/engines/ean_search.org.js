import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";

export default async function ean_search_org(query) {
  const userAgent = new UserAgent();
  const response = await fetch(`https://www.upcitemdb.com/upc/${query}`, {
    headers: {
      "User-Agent": userAgent.toString(),
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  const data = await response.text();
  const $ = cheerio.load(data);

  const result = $("p")[4].text();

  return [removeSpecialCharacters(result)];
}
