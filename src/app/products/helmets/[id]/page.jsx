"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function HelmetDetails() {

  const { id } = useParams();
  const [helmet, setHelmet] = useState(null);

  useEffect(() => {
    fetch(`/api/helmets/${id}`)
      .then(res => res.json())
      .then(data => setHelmet(data));
  }, [id]);

  if (!helmet) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

      <img
        src={helmet.image}
        className="w-full rounded"
      />

      <div>

        <h1 className="text-3xl font-bold mb-4">
          {helmet.name}
        </h1>

        <p className="text-gray-600 mb-4">
          {helmet.description}
        </p>

        <p className="text-2xl font-semibold mb-6">
          ${helmet.price}
        </p>

        <div className="flex gap-4">

          <button className="bg-yellow-500 text-white px-6 py-2 rounded">
            Add to Cart
          </button>

          <button className="bg-green-600 text-white px-6 py-2 rounded">
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}