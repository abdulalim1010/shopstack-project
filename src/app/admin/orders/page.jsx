"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiPackage, FiCreditCard, FiCheck, FiX, FiTruck, FiClock, FiDollarSign, FiShoppingBag } from "react-icons/fi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    revenue: 0
  });
  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAdmin) {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [token, isAdmin, router, authLoading]);

  const fetchOrders = () => {
    fetch("/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data || []);
        calculateStats(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to fetch orders");
        setLoading(false);
      });
  };

  const calculateStats = (orderList) => {
    const paidOrders = orderList.filter(o => o.paymentStatus === "paid");
    setStats({
      total: orderList.length,
      pending: orderList.filter(o => o.paymentStatus === "pending_verification" || o.paymentStatus === "pending").length,
      paid: paidOrders.length,
      revenue: paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert("Failed to update payment status");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending_verification":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Order Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Payments</p>
              <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <FiCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-orange-600">${stats.revenue.toFixed(2)}</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Pending Payments Alert */}
      {stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <FiClock className="w-5 h-5" />
          <span className="font-medium">{stats.pending} payment(s) waiting for verification</span>
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-medium">
                          {order.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.products?.length || 0} item(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}>
                      {order.paymentStatus === "paid" ? "✓ Paid" : 
                       order.paymentStatus === "pending_verification" ? "⏳ Verify" : 
                       "⏳ Pending"}
                    </span>
                    <p className="mt-1 text-gray-500 text-xs capitalize">{order.paymentMethod?.replace(/_/g, " ")}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-orange-600 hover:text-orange-900 font-medium"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {selectedOrder._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <p className="text-gray-900 font-medium">{selectedOrder.user?.name}</p>
                <p className="text-gray-500 text-sm">{selectedOrder.user?.email}</p>
                {selectedOrder.shippingInfo?.phone && (
                  <p className="text-gray-500 text-sm">Phone: {selectedOrder.shippingInfo.phone}</p>
                )}
              </div>

              {/* Payment Status Section */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                  <FiCreditCard /> Payment Status
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedOrder.paymentStatus !== "paid" && (
                    <button
                      onClick={() => updatePaymentStatus(selectedOrder._id, "paid")}
                      disabled={updating}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      <FiCheck /> Accept Payment
                    </button>
                  )}
                  
                  {selectedOrder.paymentStatus === "pending_verification" && (
                    <button
                      onClick={() => updatePaymentStatus(selectedOrder._id, "failed")}
                      disabled={updating}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      <FiX /> Reject
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Method</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentMethod?.replace(/_/g, " ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className={`font-medium ${selectedOrder.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                      {selectedOrder.paymentStatus?.replace(/_/g, " ") || "Pending"}
                    </p>
                  </div>
                  {selectedOrder.transactionId && (
                    <div className="col-span-2">
                      <p className="text-gray-500">Transaction ID</p>
                      <p className="font-mono bg-white p-2 rounded border">{selectedOrder.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status Section */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <FiPackage /> Order Status
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "processing")}
                    disabled={updating || selectedOrder.status === "processing"}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "shipped")}
                    disabled={updating || selectedOrder.status === "shipped"}
                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 flex items-center gap-1 text-sm"
                  >
                    <FiTruck /> Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "delivered")}
                    disabled={updating || selectedOrder.status === "delivered"}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1 text-sm"
                  >
                    <FiCheck /> Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, "cancelled")}
                    disabled={updating || selectedOrder.status === "cancelled" || selectedOrder.status === "delivered"}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-sm">
                  Current Status: <span className={`font-medium ${getStatusColor(selectedOrder.status).replace("bg-", "text-")}`}>
                    {selectedOrder.status || "pending"}
                  </span>
                </p>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Products</h3>
                <div className="space-y-3">
                  {selectedOrder.products?.map((product, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-lg object-cover mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity} × ${product.price}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price * product.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-orange-600">${selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Order Date */}
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
