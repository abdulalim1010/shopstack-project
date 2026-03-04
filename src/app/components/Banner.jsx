"use client";
import Image from "next/image";

export default function Banner() {
  return (
    <section className="bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center py-12">
        
        {/* Left: Text */}
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Ride Your Dream Motorcycle
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Discover the ultimate performance, style, and freedom on two wheels.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Explore Bikes
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium">
              Contact Us
            </button>
          </div>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
          <Image
            src="/banners.jpg" // ✅ just string path from public folder
            alt="Motorcycle"
            width={700}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>

      </div>
    </section>
  );
}