export const dynamic = 'force-dynamic';

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    
    searchProducts();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Search Results
      </h1>
      <p className="text-gray-600 mb-8">
        {query ? `Showing results for "${query}"` : "Enter a search term to find products"}
      </p>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {results.map((product) => (
            <Link
              key={product._id}
              href={product.source === "toprated" ? `/toprated/${product._id}` : `/mainproducts/${product._id}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="relative overflow-hidden h-56">
                {product.frontImage ? (
                  <img
                    src={product.frontImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{product.brand}</p>
                <p className="text-orange-600 font-bold text-lg mt-2">
                  ${product.price}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {product.source === "toprated" ? "Top Rated" : "Main Product"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : query.length >= 2 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 mt-2">Try different keywords</p>
        </div>
      ) : null}
    </div>
  );
}
