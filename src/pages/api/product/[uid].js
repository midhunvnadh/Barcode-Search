import amazon_search from "@/functions/amazon";
import flipkart_search from "@/functions/flipkart";
import upcitemdb_com from "@/functions/upcitemdb_com";

export default async function handler(req, res) {
  const { uid } = req.query;

  var upcitemdb_com_results = [],
    flipkart_results = [],
    amazon_results = [];
  try {
    flipkart_results = await flipkart_search(uid);
  } catch (e) {
    console.log("Flipkart failed");
  }
  try {
    //amazon_results = await amazon_search(uid);
  } catch (e) {
    console.log("Amazon failed");
  }
  try {
    upcitemdb_com_results = await upcitemdb_com(uid);
  } catch (e) {
    console.log("upcitemdb_com failed");
  }

  const shopping_results = [...flipkart_results, ...amazon_results];
  const shopping_results_rd = [...new Set(shopping_results)];

  const results = {
    main: upcitemdb_com_results,
    others: shopping_results_rd,
  };

  return res.status(200).json(results);
}
