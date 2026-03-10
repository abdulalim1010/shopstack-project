"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Details({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/mainproducts/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
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
      setMessage({ type: "error", text: "Please login to purchase" });
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
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

  useEffect(() => {
    fetch(`/api/mainproducts/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product)
    return (
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
          <Link href="/mainproducts" className="text-gray-500 hover:text-orange-500 transition-colors">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Images */}
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

            {/* Product Info */}
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
                    className="flex-1 relative overflow-hidden bg-gray-900 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/30 group disabled:opacity-50 disabled:cursor-not-allowed"
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
            href="/mainproducts" 
            className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            {/* Motorcycle Features Section */}
<div className="mt-20">

  <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
    Why Riders Choose Premium Motorcycle Gear
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {/* Feature 1 */}
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">

      <div className="text-orange-500 mb-4">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.866 0-7 1.343-7 3v2c0 1.657 3.134 3 7 3s7-1.343 7-3v-2c0-1.657-3.134-3-7-3z" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Maximum Safety
      </h3>

      <p className="text-gray-600">
        Premium motorcycle helmets and gear are engineered to provide
        maximum impact protection. Advanced materials and reinforced
        shell technology help absorb shock during accidents.
      </p>

    </div>

    {/* Feature 2 */}
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">

      <div className="text-orange-500 mb-4">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Advanced Ventilation
      </h3>

      <p className="text-gray-600">
        Modern helmets include multi-channel ventilation systems that
        maintain airflow and keep riders cool during long journeys,
        ensuring maximum comfort on every ride.
      </p>

    </div>

    {/* Feature 3 */}
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">

      <div className="text-orange-500 mb-4">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Crystal Clear Vision
      </h3>

      <p className="text-gray-600">
        Anti-scratch and anti-fog visors provide riders with a clear
        field of vision even in extreme weather conditions, helping
        maintain safety and control on the road.
      </p>

    </div>

  </div>
</div>


{/* Riding Experience Section */}
<div className="mt-20 bg-gray-900 text-white rounded-2xl p-12">

  <div className="grid md:grid-cols-2 gap-12 items-center">

    <div>
      <h2 className="text-3xl font-bold mb-6">
        Built for Passionate Riders
      </h2>

      <p className="text-gray-300 leading-relaxed mb-6">
        Motorcycle riding is not just transportation — it's a lifestyle.
        High-quality riding gear ensures safety, performance, and comfort
        whether you're commuting in the city or exploring long highways.
      </p>

      <p className="text-gray-300 leading-relaxed">
        Professional helmets combine aerodynamics, lightweight materials,
        and advanced safety engineering to deliver the ultimate riding
        experience. Investing in quality gear protects you and enhances
        your confidence on every ride.
      </p>

    </div>

    <div className="grid grid-cols-2 gap-6">

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-orange-400">100%</h3>
        <p className="text-gray-300 text-sm">Rider Protection</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-orange-400">24/7</h3>
        <p className="text-gray-300 text-sm">Comfort Ride</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-orange-400">Premium</h3>
        <p className="text-gray-300 text-sm">Build Quality</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-orange-400">Pro</h3>
        <p className="text-gray-300 text-sm">Rider Experience</p>
      </div>

    </div>

  </div>

</div>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
