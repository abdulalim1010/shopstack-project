"use client";

import { useEffect, useState, use } from "react";

export default function Details({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/mainproducts/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product)
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-700">
        Loading product details...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="flex-1 grid grid-cols-1 gap-4">
          <img
            src={product.frontImage}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
          />
          {product.backImage && (
            <img
              src={product.backImage}
              alt={`${product.name} back`}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-3 text-gray-600 text-lg">{product.brand}</p>
            <p className="mt-6 text-gray-700 text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-3xl font-bold text-indigo-600">
              ${product.price}
            </p>
            <p className="mt-1 text-green-600 font-medium">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
                Add To Cart
              </button>
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}