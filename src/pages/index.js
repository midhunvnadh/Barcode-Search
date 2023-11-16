import axios from "axios";
import React, { useState } from "react";

export default function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(`/api/product/${searchTerm}`)
      .then(({ data }) => {
        setResults(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        alert("Error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="bg-gray-300 p-6">
        <div className="w-full text-center text-black font-bold text-3xl mb-4">
          <h2>Search for products</h2>
        </div>
        <form
          className="flex items-center justify-center gap-2 w-full"
          onSubmit={search}
        >
          <div className="w-3/4">
            <input
              type="number"
              className="w-full rounded-md p-3 outline-none outline-none transition-all hover:ring-2 hover:ring-blue-600 hover:ring-opacity-50"
              placeholder="Enter Barcode number / Scan with a reader"
              onChange={({ target }) => {
                setSearchTerm(target.value);
              }}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-600 p-3 rounded-md font-bold text-white "
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="p-3">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-center">
            {results && (
              <div className="flex flex-col gap-3">
                {!results.main &&
                  results.others &&
                  results.others.length === 0 && <div>No results found</div>}
                {results.main && (
                  <div className="bg-gray-300 p-3 rounded-md">
                    <div className="mb-3">
                      <h2 className="font-bold text-3xl">Main Result</h2>
                    </div>
                    <div>{<div>{results.main}</div>}</div>
                  </div>
                )}
                {results.others && results.others.length > 0 && (
                  <div className="bg-gray-300 p-3 rounded-md">
                    <div className="mb-3">
                      <h2 className="font-bold text-3xl">Other Results</h2>
                    </div>
                    <div>
                      {results.others.map((result, i) => (
                        <div key={`result-${i}-${result}`}>{result}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
