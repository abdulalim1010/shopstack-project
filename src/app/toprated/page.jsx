"use client";

import { useEffect, useState } from "react";

export default function TopRated() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/toprated")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Top Rated Products</h1>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <div
            key={product._id}
            className="group cursor-pointer bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105"
            onClick={() => (window.location.href = `/toprated/${product._id}`)}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.frontImage}
                alt={product.name}
                className="w-full h-full object-cover transition duration-500 group-hover:opacity-0"
              />
              <img
                src={product.backImage}
                alt={`${product.name} back`}
                className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition duration-500 group-hover:opacity-100"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {product.name}
              </h2>
              <p className="mt-2 text-gray-600 font-medium">${product.price}</p>
              <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}