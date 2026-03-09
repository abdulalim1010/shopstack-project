"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-2">
          Discover why thousands of customers trust us for their shopping needs
        </p>
      </div>

      {/* Reviews Row - Horizontal Scroll on Mobile */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 mb-8 snap-x px-2">
        {reviews.slice(0, 5).map((r, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-72 md:w-80 bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow snap-start"
          >
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, starIndex) => (
                <svg 
                  key={starIndex} 
                  className={`w-5 h-5 ${starIndex < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600 font-medium">{r.rating}/5</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 mb-4 line-clamp-3">
              "{r.review}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              {r.image ? (
                <img 
                  src={r.image} 
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  {r.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="text-sm text-gray-500">{r.product}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Reviews Button */}
      <div className="text-center">
        <Link 
          href="/reviews"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          <span>Customer Reviews</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
