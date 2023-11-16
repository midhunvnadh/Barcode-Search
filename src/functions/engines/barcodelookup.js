import axios from "axios";
const cheerio = require("cheerio");
import removeSpecialCharacters from "../removeSpecialChars";
import UserAgent from "user-agents";
import writeFile from "../write_file";
const https = require("https");
const CloudflareBypasser = require("cloudflare-bypasser");

export default async function barcodelookup(query) {
  let cf = new CloudflareBypasser();
  var data = "";
  try {
    const res = await cf.request(`https://www.barcodelookup.com/${query}`);
    data = res.body;
  } catch (e) {
    return "";
    //console.log("Error: ", e);
  }
  const $ = cheerio.load(data);

  const result = $("h4").text();

  console.log(result);

  return [removeSpecialCharacters(result)];
}
