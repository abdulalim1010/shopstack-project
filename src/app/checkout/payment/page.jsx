"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  
  // Get all product and customer info from URL params
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");
  const productPrice = searchParams.get("productPrice");
  const productImage = searchParams.get("productImage");
  const quantity = searchParams.get("quantity") || "1";
  
  // Customer info
  const customerName = searchParams.get("name");
  const customerEmail = searchParams.get("email");
  const customerPhone = searchParams.get("phone");
  const customerAddress = searchParams.get("address");
  const customerCity = searchParams.get("city");
  const customerZipCode = searchParams.get("zipCode");
  const customerCountry = searchParams.get("country");
  
  // Redirect if not logged in or no product
  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }
    if (!productId) {
      router.push("/");
    }
  }, [token, productId, router]);
  
  const handlePayment = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      const products = [{
        productId: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        quantity: parseInt(quantity),
      }];
      
      const shippingInfo = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        zipCode: customerZipCode,
        country: customerCountry,
      };
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products,
          totalAmount: parseFloat(productPrice) * parseInt(quantity),
          shippingInfo,
          paymentMethod,
          clearCart: true,
        }),
      });
      
      if (res.ok) {
        const orderData = await res.json();
        setMessage({ type: "success", text: "Order placed successfully!" });
        // Redirect to success page with order details
        const params = new URLSearchParams();
        params.set("orderId", orderData._id);
        params.set("amount", totalAmount.toFixed(2));
        params.set("paymentMethod", paymentMethod);
        params.set("customerName", customerName);
        params.set("customerEmail", customerEmail);
        params.set("customerPhone", customerPhone);
        params.set("customerAddress", customerAddress);
        params.set("productName", productName);
        router.push(`/checkout/success?${params.toString()}`);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Failed to place order" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle SSL Commerz Payment
  const handleSSLPayment = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // First create an order with pending payment
      const products = [{
        productId: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        quantity: parseInt(quantity),
      }];
      
      const shippingInfo = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        zipCode: customerZipCode,
        country: customerCountry,
      };

      // Create order first
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products,
          totalAmount: parseFloat(productPrice) * parseInt(quantity),
          shippingInfo,
          paymentMethod: "sslcommerz",
          paymentStatus: "pending",
          clearCart: false,
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        setMessage({ type: "error", text: data.message || "Failed to create order" });
        setLoading(false);
        return;
      }

      const orderData = await orderRes.json();

      // Call SSL Commerz payment API
      const sslRes = await fetch("/api/sslpayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount.toFixed(2),
          orderId: orderData._id,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
          productName: productName,
        }),
      });

      const sslData = await sslRes.json();

      if (sslData.GatewayPageURL) {
        // Redirect to SSL Commerz payment page
        window.location.href = sslData.GatewayPageURL;
      } else {
        // If no redirect URL, show success (demo mode)
        setMessage({ type: "success", text: "Order placed successfully! Payment will be processed." });
        // Redirect to success page
        const params = new URLSearchParams();
        params.set("orderId", orderData._id);
        params.set("amount", totalAmount.toFixed(2));
        params.set("paymentMethod", "sslcommerz");
        params.set("customerName", customerName);
        params.set("customerEmail", customerEmail);
        params.set("customerPhone", customerPhone);
        params.set("customerAddress", customerAddress);
        params.set("productName", productName);
        router.push(`/checkout/success?${params.toString()}`);
      }
    } catch (error) {
      console.error("SSL Payment error:", error);
      setMessage({ type: "error", text: "Payment failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Demo Payment (bKash to Admin)
  const handleDemoPayment = async () => {
    const transactionIdInput = document.getElementById("transactionId");
    const senderPhoneInput = document.getElementById("senderPhone");
    const transactionId = transactionIdInput?.value?.trim();
    const senderPhone = senderPhoneInput?.value?.trim();

    if (!transactionId) {
      setMessage({ type: "error", text: "Please enter your bKash/Nagad transaction ID" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const products = [{
        productId: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        quantity: parseInt(quantity),
      }];
      
      const shippingInfo = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        zipCode: customerZipCode,
        country: customerCountry,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products,
          totalAmount: parseFloat(productPrice) * parseInt(quantity),
          shippingInfo,
          paymentMethod: "demo_bkash",
          paymentStatus: "pending_verification",
          transactionId: transactionId,
          senderPhone: senderPhone || "",
          adminPhone: "01739243457",
          clearCart: true,
        }),
      });
      
      if (res.ok) {
        const orderData = await res.json();
        setMessage({ type: "success", text: "Order placed! Admin will verify your payment and confirm." });
        // Redirect to success page with order details
        const params = new URLSearchParams();
        params.set("orderId", orderData._id);
        params.set("amount", totalAmount.toFixed(2));
        params.set("paymentMethod", "demo_bkash");
        params.set("customerName", customerName);
        params.set("customerEmail", customerEmail);
        params.set("customerPhone", customerPhone);
        params.set("customerAddress", customerAddress);
        params.set("productName", productName);
        params.set("transactionId", transactionId);
        router.push(`/checkout/success?${params.toString()}`);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Failed to place order" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  
  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No product selected</p>
          <Link href="/" className="text-orange-500 hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const totalAmount = parseFloat(productPrice) * parseInt(quantity);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="ml-2 font-semibold text-green-500">Information</span>
          </div>
          <div className="w-20 h-1 bg-green-500 mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <span className="ml-2 font-semibold text-orange-500">Payment</span>
          </div>
          <div className="w-20 h-1 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <span className="ml-2 font-semibold text-gray-500">Confirmation</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h1>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {message.text}
                </div>
              )}
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="grid grid-cols-5 gap-4">
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${paymentMethod === "demo" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="demo"
                      checked={paymentMethod === "demo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-medium text-sm">Demo bKash</div>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${paymentMethod === "sslcommerz" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="sslcommerz"
                      checked={paymentMethod === "sslcommerz"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <div className="font-medium text-sm">SSL Commerce</div>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${paymentMethod === "card" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-medium text-sm">Credit/Debit Card</div>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${paymentMethod === "bkash" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === "bkash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-medium text-sm">bKash</div>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${paymentMethod === "cod" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">💵</div>
                      <div className="font-medium text-sm">Cash on Delivery</div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Demo Payment - Send to Admin Number */}
              {paymentMethod === "demo" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg mb-4 text-white">
                    <h3 className="font-bold text-lg mb-2">📱 Demo Payment - Send Money to Admin</h3>
                    <p className="text-sm">Send the payment amount to admin's bKash/Nagad number below and enter the transaction ID.</p>
                  </div>
                  
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
                    <div className="mb-4">
                      <span className="text-gray-500 text-sm">Admin bKash/Nagad Number:</span>
                      <p className="text-3xl font-bold text-green-600">01739-243457</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <span className="text-gray-500 text-sm">Pay Amount:</span>
                      <p className="text-4xl font-bold text-orange-500">${totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">📋 How to Pay:</h4>
                    <ol className="text-sm text-yellow-700 space-y-1">
                      <li>1. Open your bKash/Nagad app</li>
                      <li>2. Send money to: <strong>01739-243457</strong></li>
                      <li>3. Amount: <strong>${totalAmount.toFixed(2)}</strong></li>
                      <li>4. Enter the transaction ID below</li>
                    </ol>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      bKash/Nagad Transaction ID *
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      placeholder="e.g., ABC123XYZ789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your bKash/Nagad Number (for refund)
                    </label>
                    <input
                      type="tel"
                      id="senderPhone"
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleDemoPayment}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm Payment - ${totalAmount.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* bKash Payment Form */}
              {paymentMethod === "bkash" && (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      <strong>bKash Payment:</strong> You will be redirected to bKash payment gateway. 
                      Our bKash number is: <strong>01XXXXXXXXX</strong>
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      bKash Transaction ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your bKash transaction ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      bKash Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 mt-6"
                  >
                    {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                  </button>
                </form>
              )}
              
              {/* Cash on Delivery */}
              {paymentMethod === "cod" && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-green-700">
                      <strong>Cash on Delivery:</strong> You will pay in cash when the product is delivered to your address.
                    </p>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 mt-6"
                  >
                    {loading ? "Processing..." : `Confirm Order - Pay $${totalAmount.toFixed(2)} on Delivery`}
                  </button>
                </div>
              )}
              
              {/* Back Button */}
              <Link
                href={`/checkout/info?productId=${productId}&productName=${productName}&productPrice=${productPrice}&productImage=${productImage}&quantity=${quantity}`}
                className="block text-center mt-4 text-gray-600 hover:text-orange-500"
              >
                ← Back to Information
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              {/* Product */}
              <div className="flex gap-4 mb-4">
                {productImage && (
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {productName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Quantity: {quantity}
                  </p>
                </div>
              </div>
              
              {/* Shipping Info */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Shipping to:</h3>
                <p className="text-sm text-gray-600">{customerName}</p>
                <p className="text-sm text-gray-600">{customerPhone}</p>
                <p className="text-sm text-gray-600">{customerAddress}</p>
                {customerCity && <p className="text-sm text-gray-600">{customerCity}, {customerZipCode}</p>}
                {customerCountry && <p className="text-sm text-gray-600">{customerCountry}</p>}
              </div>
              
              {/* Price Details */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(parseFloat(productPrice) * parseInt(quantity)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
