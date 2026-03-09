"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function HelmetDetails() {
  const params = useParams();
  const id = params?.id;
  const [helmet, setHelmet] = useState(null);
  const [loading, setLoading] = useState(() => !id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    
    fetch(`/api/helmets/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch helmet");
        }
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setHelmet(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 text-xl mb-4">Error: {error}</p>
        <Link href="/products/helmets" className="text-blue-600 hover:underline">
          Back to Helmets
        </Link>
      </div>
    );
  }

  if (!helmet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 text-xl mb-4">Helmet not found</p>
        <Link href="/products/helmets" className="text-blue-600 hover:underline">
          Back to Helmets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products/helmets" className="text-gray-500 hover:text-blue-600">Helmets</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{helmet.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gray-100">
              {helmet.image ? (
                <img
                  src={helmet.image}
                  alt={helmet.name}
                  className="w-full h-full object-cover min-h-[400px]"
                />
              ) : (
                <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-6xl">⛑️</span>
                </div>
              )}
              {!helmet.inStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12">
              {helmet.brand && (
                <p className="text-blue-600 font-medium mb-2">{helmet.brand}</p>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {helmet.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(helmet.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm">({helmet.rating || 0} rating)</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {helmet.description || "No description available for this product."}
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900">
                  ${helmet.price}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  disabled={!helmet.inStock}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    helmet.inStock 
                      ? "relative overflow-hidden bg-yellow-500 hover:shadow-xl transform hover:-translate-y-1" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  style={helmet.inStock ? {
                    background: 'linear-gradient(90deg, #eab308 0%, #ca8a04 100%)',
                    backgroundSize: '200% 100%'
                  } : {}}
                  onMouseEnter={(e) => {
                    if (helmet.inStock) e.target.style.backgroundPosition = '100% 0';
                  }}
                  onMouseLeave={(e) => {
                    if (helmet.inStock) e.target.style.backgroundPosition = '0 0';
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {helmet.inStock ? "Add to Cart" : "Out of Stock"}
                  </span>
                </button>
                
                <button 
                  disabled={!helmet.inStock}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    helmet.inStock 
                      ? "relative overflow-hidden bg-green-600 hover:shadow-xl transform hover:-translate-y-1" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  style={helmet.inStock ? {
                    background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                    backgroundSize: '200% 100%'
                  } : {}}
                  onMouseEnter={(e) => {
                    if (helmet.inStock) e.target.style.backgroundPosition = '100% 0';
                  }}
                  onMouseLeave={(e) => {
                    if (helmet.inStock) e.target.style.backgroundPosition = '0 0';
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Buy Now
                  </span>
                </button>
              </div>

              {/* Features - Dynamic from product data */}
              {(helmet.features && helmet.features.length > 0) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Features:</h3>
                  <ul className="space-y-2 text-gray-600">
                    {helmet.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link 
            href="/products/helmets" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Helmets
          </Link>
        </div>
      </div>
    </div>
  );
}
