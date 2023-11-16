import amazon_search from "@/functions/amazon";
import flipkart_search from "@/functions/flipkart";
import upcitemdb_com from "@/functions/upcitemdb_com";

export default async function handler(req, res) {
  const { uid } = req.query;

  const flipkart_results = await flipkart_search(uid);
  const amazon_results = await amazon_search(uid);
  const upcitemdb_com_results = await upcitemdb_com(uid);

  const shopping_results = [...flipkart_results, ...amazon_results];
  const shopping_results_rd = [...new Set(shopping_results)];

  const results = {
    main: upcitemdb_com_results,
    others: shopping_results_rd,
  };

  return res.status(200).json(results);
}
