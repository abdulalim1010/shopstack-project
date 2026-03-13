"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { triggerCartNotification } from "@/lib/notifications";

export default function Details({ params }) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch(`/api/toprated/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      setMessage({ type: "error", text: "Please login to add items to cart" });
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          name: product.name,
          price: product.price,
          image: product.frontImage,
          quantity: 1,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Added to cart successfully!" });
        // Trigger cart notification
        triggerCartNotification("Added to cart!");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Failed to add to cart" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      alert("Please login to purchase");
      router.push("/signin");
      return;
    }

    // Redirect to checkout info page with product details
    const params = new URLSearchParams();
    params.set("productId", id);
    params.set("productName", product.name);
    params.set("productPrice", product.price.toString());
    params.set("productImage", product.frontImage || "");
    params.set("quantity", "1");
    
    router.push(`/checkout/info?${params.toString()}`);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl text-gray-600">Loading product details...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-orange-500 transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/toprated" className="text-gray-500 hover:text-orange-500 transition-colors">Top Rated</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="bg-gray-100 p-6">
              {product.frontImage ? (
                <img 
                  src={product.frontImage} 
                  alt={product.name} 
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105" 
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
              {product.backImage && (
                <img 
                  src={product.backImage} 
                  alt={`${product.name} back`} 
                  className="w-full h-[300px] object-cover rounded-lg shadow-lg mt-4 transition-transform duration-500 hover:scale-105" 
                />
              )}
            </div>

            {/* Product Details */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                {product.brand && (
                  <p className="text-orange-500 font-medium mb-2">{product.brand}</p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-6 text-gray-700 text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-8">
                <p className="text-4xl font-bold text-indigo-600">
                  ${product.price}
                </p>
                <p className="mt-2 text-green-600 font-medium">
                  {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </p>

                {/* Action Buttons with Gradient Hover */}
                <div className="flex gap-4 mt-8">
                  <button 
                    className="flex-1 relative overflow-hidden bg-gray-900 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(90deg, #1a1a1a 0%, #333 100%)',
                      backgroundSize: '200% 100%'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundPosition = '100% 0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundPosition = '0 0';
                    }}
                    onClick={handleAddToCart}
                    disabled={loading || !product.inStock}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {loading ? "Adding..." : "Add To Cart"}
                    </span>
                  </button>
                  <button 
                    className="flex-1 relative overflow-hidden bg-orange-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
                      backgroundSize: '200% 100%'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundPosition = '100% 0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundPosition = '0 0';
                    }}
                    onClick={handleBuyNow}
                    disabled={loading || !product.inStock}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {loading ? "Processing..." : "Buy Now"}
                    </span>
                  </button>
                </div>

                {/* Message Display */}
                {message.text && (
                  <div className={`mt-4 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link 
            href="/toprated" 
            className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Top Rated
          </Link>
        </div>
      </div>
    </div>
  );
}
