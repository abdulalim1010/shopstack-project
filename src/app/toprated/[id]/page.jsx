"use client";

import { use, useEffect, useState } from "react";

export default function Details({ params }) {
  const { id } = use(params);

  const [product, setProduct] = useState(null);

  useEffect(() => {

    fetch(`/api/toprated/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));

  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (

    <div className="p-10 grid grid-cols-2 gap-10">

      <img src={product.frontImage} />

      <div>

        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="mt-4">{product.description}</p>

        <h2 className="text-xl mt-4">${product.price}</h2>

        <div className="flex gap-4 mt-6">

          <button className="bg-black text-white px-6 py-2">
            Add To Cart
          </button>

          <button className="bg-orange-500 text-white px-6 py-2">
            Buy Now
          </button>

        </div>

      </div>

    </div>

  );
}
