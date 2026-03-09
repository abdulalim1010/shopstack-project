"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HelmetsPage() {

  const [helmets, setHelmets] = useState([]);

  useEffect(() => {
    fetch("/api/helmets")
      .then(res => res.json())
      .then(data => setHelmets(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Motorcycle Helmets
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {helmets.map((helmet) => (

          <div key={helmet._id} className="border rounded-lg shadow hover:shadow-lg transition">

            <img
              src={helmet.image}
              alt={helmet.name}
              className="w-full h-60 object-cover rounded-t"
            />

            <div className="p-4">

              <h2 className="text-lg font-semibold">
                {helmet.name}
              </h2>

              <p className="text-gray-600">
                ${helmet.price}
              </p>

              <Link
                href={`/products/helmets/${helmet._id}`}
                className="block mt-3 bg-blue-600 text-white text-center py-2 rounded"
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