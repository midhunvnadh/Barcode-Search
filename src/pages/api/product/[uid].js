import amazon_search from "@/functions/amazon";
import flipkart_search from "@/functions/flipkart";
import upcitemdb_com from "@/functions/upcitemdb_com";

const searchFunctions = [upcitemdb_com, flipkart_search, amazon_search];

function searchFunctionWrapper(fn, arg) {
  return new Promise((resolve, reject) => {
    console.log("Fetching data from " + fn.name);
    fn(arg)
      .then((data) => {
        console.log("Fetched data from " + fn.name);
        resolve(data);
      })
      .catch((e) => {
        console.log("Failed to fetch data from " + fn.name);
        console.error(e);
        resolve([]);
      });
  });
}

export default async function handler(req) {
  const { uid } = req.query;

  const searchFunctionsPromises = searchFunctions.map(async (fn) => {
    return {
      name: fn.name,
      promise: await searchFunctionWrapper(fn, uid),
    };
  });
  const searchFunctionsResults = await Promise.all(searchFunctionsPromises);
  var results = {};
  for (var i = 0; i < searchFunctionsResults.length; i++) {
    const searchFunctionResult = searchFunctionsResults[i];
    results[searchFunctionResult.name] = searchFunctionResult.promise;
  }

  const shopping_results = [
    ...results.flipkart_search,
    ...results.amazon_search,
  ];
  const shopping_results_rd = [...new Set(shopping_results)];

  results = {
    main: results.upcitemdb_com,
    others: shopping_results_rd,
  };

  return new Response(JSON.stringify(results), {
    status: 200,
  });
}
