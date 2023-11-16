import amazon_search from "@/functions/amazon";
import flipkart_search from "@/functions/flipkart";
import upcitemdb_com from "@/functions/upcitemdb_com";

const searchFunctions = [
  {
    name: "UPCItemDB",
    fn: upcitemdb_com,
  },
  {
    name: "Amazon",
    fn: amazon_search,
  },
  {
    name: "Flipkart",
    fn: flipkart_search,
  },
];

function searchFunctionWrapper(fn, name, arg) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching data from ${name}`);
    fn(arg)
      .then((data) => {
        console.log(`Fetched data from ${name}`);
        resolve(data);
      })
      .catch((e) => {
        console.log(`Failed to fetch data from ${name}`);
        console.error(e);
        resolve([]);
      });
    setTimeout(() => {
      console.log(`Timed out ${name}`);
      resolve([]);
    }, 4000);
  });
}

export default async function handler(req, res) {
  const { uid } = req.query;

  const searchFunctionsPromises = searchFunctions.map(async ({ name, fn }) => {
    return {
      name: name,
      promise: await searchFunctionWrapper(fn, name, uid),
    };
  });
  const searchFunctionsResults = await Promise.all(searchFunctionsPromises);
  var results = {};
  for (var i = 0; i < searchFunctionsResults.length; i++) {
    const searchFunctionResult = searchFunctionsResults[i];
    results[searchFunctionResult.name] = searchFunctionResult.promise;
  }

  const shopping_results = [...results["Flipkart"], ...results["Amazon"]];
  const shopping_results_rd = [...new Set(shopping_results)];

  results = {
    main: results["UPCItemDB"] ? results["UPCItemDB"][0] : "",
    others: shopping_results_rd,
  };

  res.status(200).json(results);
}
