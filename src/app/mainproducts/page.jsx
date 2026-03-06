"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MainProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mainproducts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API did not return array:", data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-700">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">
        Motorcycle Products
      </h1>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden h-56">
              <img
                src={product.frontImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            </div>

            {/* Product Info */}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {product.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{product.brand}</p>
              <p className="text-indigo-600 font-bold text-lg mt-2">
                ${product.price}
              </p>

              {/* View Details Button */}
              <Link
                href={`/mainproducts/${product._id}`}
                className="block mt-4 text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}