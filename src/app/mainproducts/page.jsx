"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MainProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("/api/mainproducts")
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API did not return array:", data);
          setProducts([]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading products...
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-10 text-center">
        Motorcycle Products
      </h1>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">

        {products.map((product) => (

          <div
            key={product._id}
            className="border rounded-xl p-4 shadow hover:shadow-xl transition duration-300 group"
          >

            {/* Product Image */}
            <div className="overflow-hidden rounded-lg">

              <img
                src={product.image}
                alt={product.name}
                className="h-44 w-full object-cover group-hover:scale-110 transition duration-300"
              />

            </div>

            {/* Product Info */}

            <h2 className="text-lg font-semibold mt-4">
              {product.name}
            </h2>

            <p className="text-gray-500 text-sm">
              {product.brand}
            </p>

            <p className="text-blue-600 font-bold mt-2 text-lg">
              ${product.price}
            </p>

            {/* Button */}

            <Link
              href={`/mainproducts/${product._id}`}
              className="block mt-4 text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              View Details
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}