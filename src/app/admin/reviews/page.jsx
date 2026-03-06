"use client";

import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch reviews:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
        <p className="text-gray-600 mt-2">View and manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-orange-500">{reviews.length}</div>
          <div className="text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-green-500">
            {reviews.filter(r => r.rating >= 4).length}
          </div>
          <div className="text-gray-600">Positive Reviews (4-5★)</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-3xl font-bold text-blue-500">
            {reviews.length > 0 
              ? (reviews.reduce((sum, r) => sum + parseInt(r.rating || 0), 0) / reviews.length).toFixed(1) 
              : 0}★
          </div>
          <div className="text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                <th className="text-left p-4 font-semibold text-gray-700">Rating</th>
                <th className="text-left p-4 font-semibold text-gray-700">Review</th>
                <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {review.image ? (
                        <img 
                          src={review.image} 
                          alt={review.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{review.name}</div>
                        {review.price && <div className="text-sm text-gray-500">${review.price}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{review.product || "N/A"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${
                        review.rating >= 4 ? 'text-green-600' : 
                        review.rating >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {review.rating}
                      </span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-600 max-w-xs truncate">{review.review}</p>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Review"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No reviews found</div>
            <p className="text-gray-400 mt-2">Customer reviews will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
