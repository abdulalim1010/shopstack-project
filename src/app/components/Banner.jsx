"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Banner() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/banners?location=banner")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setBanner(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch banner:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center py-12">
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <div className="h-12 bg-gray-300 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
            <div className="w-[700px] h-[500px] bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center py-12">
        
        {/* Left: Text */}
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            {banner?.title || "Ride Your Dream Motorcycle"}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            {banner?.subtitle || "Discover the ultimate performance, style, and freedom on two wheels."}
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            {banner?.buttonText ? (
              <Link href={banner.buttonLink || "/mainproducts"} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                {banner.buttonText}
              </Link>
            ) : (
              <>
                <Link href="/mainproducts" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Explore Bikes
                </Link>
                <Link href="/contact" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium">
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
          {banner && banner.image && banner.image.startsWith('http') ? (
            <Image
              src={banner.image}
              alt="Banner"
              width={700}
              height={500}
              className="rounded-lg shadow-lg object-cover"
            />
          ) : (
            <Image
              src="/banners.jpg"
              alt="Motorcycle"
              width={700}
              height={500}
              className="rounded-lg shadow-lg object-cover"
            />
          )}
        </div>

      </div>
    </section>
  );
}
