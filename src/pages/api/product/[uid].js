import amazon_search from "@/functions/engines/amazon";
import barcodelookup from "@/functions/engines/barcodelookup";
import ean_search_org from "@/functions/engines/ean_search.org";
import flipkart_search from "@/functions/engines/flipkart";
import go_upc from "@/functions/engines/go_upc";
import upcitemdb_com from "@/functions/engines/upcitemdb_com";

const searchFunctions = [
  {
    name: "UPCItemDB",
    fn: upcitemdb_com,
    category: "main",
  },
  {
    name: "GoUPC",
    fn: go_upc,
    category: "main",
  },
  {
    name: "EANSearch",
    fn: ean_search_org,
    category: "main",
  },
  {
    name: "BarcodeLookup",
    fn: barcodelookup,
    category: "main",
  },
  {
    name: "Amazon",
    fn: amazon_search,
    category: "others",
  },
  {
    name: "Flipkart",
    fn: flipkart_search,
    category: "others",
  },
];

function searchFunctionWrapper(fn, name, arg) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching data from ${name}`);

    var x = setTimeout(() => {
      console.log(`Timed out ${name}`);
      resolve([]);
    }, 4000);
    fn(arg)
      .then((data) => {
        console.log(`Fetched data from ${name}`, data);
        resolve(data);
      })
      .catch((e) => {
        console.log(`Failed to fetch data from ${name}`);
        if (name === "BarcodeLookup") console.log(e);
        resolve([]);
      })
      .finally(() => {
        clearTimeout(x);
      });
  });
}

export default async function handler(req, res) {
  const { uid } = req.query;

  const searchFunctionsPromises = searchFunctions.map(
    async ({ name, fn, category }) => {
      return {
        name: name,
        category: category,
        promise: await searchFunctionWrapper(fn, name, uid),
      };
    }
  );
  const searchFunctionsResults = await Promise.all(searchFunctionsPromises);
  var result = {};
  for (var i = 0; i < searchFunctionsResults.length; i++) {
    const current = searchFunctionsResults[i];
    const { name, category, promise } = current;
    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(...promise);
  }

  const keys = Object.keys(result);
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = [...new Set(result[key])].filter((x) => !!x);
  }

  res.status(200).json(result);
}
