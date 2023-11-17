import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

export default function Home() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputRef, setInputFocus] = useFocus();
  const [previousSearchTerm, setPreviousSearchTerm] = useState("");

  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    const searchT = searchTerm || previousSearchTerm;
    if (!searchT) return;
    axios
      .get(`/api/product/${searchT}`)
      .then(({ data }) => {
        setResults(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        alert("Error fetching data");
      })
      .finally(() => {
        setPreviousSearchTerm(searchT);
        setSearchTerm("");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchTerm === "") setInputFocus();
  }, [searchTerm, setInputFocus]);

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
              ref={inputRef}
              type="number"
              className="w-full rounded-md p-3 outline-none outline-none transition-all hover:ring-2 hover:ring-blue-600 hover:ring-opacity-50"
              placeholder={
                previousSearchTerm ||
                "Enter Barcode number / Scan with a reader"
              }
              onChange={({ target }) => {
                setSearchTerm(target.value);
              }}
              value={searchTerm}
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
                {results.main?.length === 0 && results.others?.length === 0 && (
                  <div>No results found</div>
                )}
                {results.main && results.main.length > 0 && (
                  <div className="bg-gray-300 p-3 rounded-md">
                    <div className="mb-3">
                      <h2 className="font-bold text-3xl">Main Result</h2>
                    </div>
                    <div className="flex items-center justify-start flex-wrap w-full">
                      {results.main.map(({ engine, name, image }, i) => (
                        <div
                          className="lg:w-1/4 w-full p-3"
                          key={`result-m-${i}-${name}`}
                        >
                          <div className="flex items-center flex-col gap-2 bg-white  p-3 rounded-md w-full h-full">
                            <div className="w-full">
                              <img
                                src={image || "/placeholder.webp"}
                                alt={name}
                              />
                            </div>
                            <div className="border-t w-full"></div>
                            <div className="">
                              <div className="font-bold">{engine}</div>
                            </div>
                            <div className="border-t w-full"></div>
                            <div className="w-full">{name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {results.others && results.others.length > 0 && (
                  <div className="bg-gray-300 p-3 rounded-md">
                    <div className="mb-3">
                      <h2 className="font-bold text-3xl">Other Results</h2>
                    </div>
                    <div className="flex items-center justify-start flex-wrap w-full">
                      {results.others.map(
                        ({ engine, name, image, price }, i) => (
                          <div
                            className="lg:w-1/4 w-full p-3"
                            key={`result-o-${i}-${name}`}
                          >
                            <div className="flex items-center flex-col gap-2 bg-white  p-3 rounded-md w-full h-full">
                              <div className="w-full">
                                <img
                                  src={image || "/placeholder.webp"}
                                  alt={name}
                                />
                              </div>
                              <div className="border-t w-full"></div>
                              <div className="">
                                <div className="font-bold">
                                  <span>{engine}</span>
                                  {price && (
                                    <span className="font-bold">
                                      {" "}
                                      - {price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="border-t w-full"></div>
                              <div className="w-full">{name}</div>
                            </div>
                          </div>
                        )
                      )}
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
