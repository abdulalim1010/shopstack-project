"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiShoppingCart, FiEye } from "react-icons/fi";

export default function HelmetsPage() {
  const [helmets, setHelmets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/helmets")
      .then(res => res.json())
      .then(data => {
        setHelmets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching helmets:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Motorcycle Helmets
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Premium quality helmets for your safety and style. Choose from our wide selection of certified helmets.
          </p>
        </div>

        {/* Filters/Sort could go here */}

        {/* Products Grid */}
        {helmets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {helmets.map((helmet, index) => (
              <div 
                key={helmet._id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {helmet.image ? (
                    <img
                      src={helmet.image}
                      alt={helmet.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-6xl">⛑️</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {!helmet.inStock && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <Link
                      href={`/products/helmets/${helmet._id}`}
                      className="bg-white p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors transform scale-0 group-hover:scale-100"
                      style={{ transitionDelay: '0.1s' }}
                    >
                      <FiEye size={20} />
                    </Link>
                    <button
                      disabled={!helmet.inStock}
                      className="bg-white p-3 rounded-full hover:bg-yellow-500 hover:text-white transition-colors transform scale-0 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ transitionDelay: '0.2s' }}
                    >
                      <FiShoppingCart size={20} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {helmet.brand && (
                    <p className="text-blue-600 text-sm font-semibold mb-1">
                      {helmet.brand}
                    </p>
                  )}
                  
                  <h2 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                    {helmet.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(helmet.rating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">({helmet.rating || 0})</span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${helmet.price}
                    </span>
                    <Link
                      href={`/products/helmets/${helmet._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">⛑️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Helmets Available
            </h2>
            <p className="text-gray-600 mb-6">
              Check back later for our collection of premium helmets.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
