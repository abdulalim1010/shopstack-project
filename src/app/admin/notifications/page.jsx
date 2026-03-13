"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { FiShoppingCart, FiHeart, FiPackage, FiCreditCard, FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

export default function AdminNotificationsPage() {
  const { user, token, isAdmin, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    cart: 0,
    order: 0,
    payment: 0,
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      // Redirect if not admin
      return;
    }

    if (user && isAdmin) {
      fetchNotifications();
    }
  }, [user, isAdmin, loading]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=100&all=true", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);

        // Calculate stats
        const notifs = data.notifications || [];
        setStats({
          total: notifs.length,
          cart: notifs.filter(n => n.type === "cart").length,
          order: notifs.filter(n => n.type === "order").length,
          payment: notifs.filter(n => n.type === "payment").length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setFetching(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markAllRead: true, userId: "all" }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "cart":
        return <FiShoppingCart className="w-5 h-5 text-green-500" />;
      case "order":
        return <FiPackage className="w-5 h-5 text-blue-500" />;
      case "payment":
        return <FiCreditCard className="w-5 h-5 text-purple-500" />;
      default:
        return <FiBell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="text-gray-600 mt-2">Only admins can view this page.</p>
          <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications Center</h1>
            <p className="text-gray-600 mt-1">View all user activities and orders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchNotifications}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <FiCheck /> Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Notifications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cart Actions</p>
                <p className="text-3xl font-bold text-green-600">{stats.cart}</p>
              </div>
              <FiShoppingCart className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.order}</p>
              </div>
              <FiPackage className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Payments</p>
                <p className="text-3xl font-bold text-purple-600">{stats.payment}</p>
              </div>
              <FiCreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {unreadCount}
            </span>
            <span>New unread notification{unreadCount > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Notifications</h2>
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      notification.type === "cart" ? "bg-green-100 text-green-800" :
                      notification.type === "order" ? "bg-blue-100 text-blue-800" :
                      notification.type === "payment" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
