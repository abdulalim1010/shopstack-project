"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { triggerPurchaseNotification } from "@/lib/notifications";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentMethod = searchParams.get("paymentMethod");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");
  const customerName = searchParams.get("customerName");
  const customerEmail = searchParams.get("customerEmail");
  const customerPhone = searchParams.get("customerPhone");
  const customerAddress = searchParams.get("customerAddress");
  const productName = searchParams.get("productName");
  const transactionId = searchParams.get("transactionId");

  // Trigger purchase/love notification on page load
  useEffect(() => {
    // Trigger love/purchase notification
    triggerPurchaseNotification("Thank you for your purchase!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* Order Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-3">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{orderId}</span>
                </div>
              )}
              
              {productName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium text-gray-900">{productName}</span>
                </div>
              )}
              
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">${amount}</span>
                </div>
              )}
              
              {paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900 capitalize">{paymentMethod.replace(/_/g, " ")}</span>
                </div>
              )}
              
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-gray-900">{transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          {(customerName || customerEmail || customerPhone || customerAddress) && (
            <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Shipping Information</h2>
              
              <div className="space-y-2">
                {customerName && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Name:</span> {customerName}
                  </p>
                )}
                {customerEmail && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Email:</span> {customerEmail}
                  </p>
                )}
                {customerPhone && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Phone:</span> {customerPhone}
                  </p>
                )}
                {customerAddress && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Address:</span> {customerAddress}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Demo Payment Notice */}
          {paymentMethod === "demo_bkash" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Your order is pending verification. Admin will verify your bKash transaction and confirm your order within 24-48 hours.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/orders"
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Need help? Contact us at{" "}
            <a href="mailto:support@shopstack.com" className="text-orange-500 hover:underline">
              support@shopstack.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
