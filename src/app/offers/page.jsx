"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function OfferPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers")
      .then(res => res.json())
      .then(data => {
        // Filter only active offers
        const activeOffers = data.filter(offer => offer.isActive !== false);
        setOffers(activeOffers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch offers:", err);
        setLoading(false);
      });
  }, []);

  // Default offer if no offers exist
  const defaultOffer = {
    title: "Super Bike Mega Offer",
    subtitle: "Get the best superbikes with exclusive discounts. Limited time offer for motorcycle lovers.",
    discount: "30% OFF",
    image: "https://images.unsplash.com/photo-1558981403-c5f9891c2c06",
    buttonText: "Shop Now",
    buttonLink: "/mainproducts"
  };

  const displayOffers = offers.length > 0 ? offers : [defaultOffer];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900">
      {displayOffers.map((offer, index) => (
        <div 
          key={index}
          className="min-h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-12">

            {/* LEFT TEXT */}
            <div className="text-white space-y-6 animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-bold">
                {offer.title}
              </h1>

              <p className="text-gray-300 text-lg">
                {offer.subtitle}
              </p>

              {offer.discount && (
                <div className="text-3xl font-bold text-orange-500">
                  {offer.discount}
                </div>
              )}

              <div className="flex gap-4">
                <Link
                  href={offer.buttonLink || "/mainproducts"}
                  className="bg-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition transform hover:scale-105"
                >
                  {offer.buttonText || "Shop Now"}
                </Link>

                <Link
                  href="/contact"
                  className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-black transition"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center">
              <Image
                src={offer.image || "https://images.unsplash.com/photo-1558981403-c5f9891c2c06"}
                alt={offer.title}
                width={600}
                height={400}
                className="rounded-xl shadow-2xl animate-float"
              />

              {/* glow effect */}
              <div className="absolute -z-10 w-72 h-72 bg-orange-500 blur-3xl opacity-30 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .animate-float{
          animation: float 4s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity:0; transform:translateY(30px); }
          to { opacity:1; transform:translateY(0); }
        }

        .animate-fadeIn{
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
