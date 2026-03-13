"use client";

import { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart, FiBell } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";

export default function Notifications() {
  const [cartNotification, setCartNotification] = useState(false);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, token, isAdmin } = useAuth();

  // Get user ID - check both _id and id
  const userId = user?._id || user?.id;

  useEffect(() => {
    // Poll for notifications
    const fetchNotifications = async () => {
      if (!userId) return;
      
      try {
        // Build URL - admin gets all, users get their own
        let url = "/api/notifications?limit=10";
        
        if (isAdmin) {
          url += "&all=true"; // Admin sees all notifications
        } else {
          url += `&userId=${userId}`;
        }

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (res.ok) {
          const data = await res.json();
          
          // Check for unread notifications
          if (data.unreadCount > 0) {
            setNotificationCount(data.unreadCount);
            
            // Check latest notification type
            if (data.notifications?.length > 0) {
              const latest = data.notifications[0];
              
              // Only show popup if it's for current user
              if (!isAdmin || (latest.userId === userId || latest.userId === null)) {
                // Show cart notification popup
                if (latest.type === "cart" && !latest.read) {
                  setCartNotification(true);
                  setTimeout(() => setCartNotification(false), 5000);
                }
                
                // Show purchase notification popup  
                if ((latest.type === "order" || latest.type === "payment") && !latest.read) {
                  setPurchaseNotification(true);
                  setTimeout(() => setPurchaseNotification(false), 6000);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    // Initial fetch
    if (userId) {
      fetchNotifications();
    }

    // Poll every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [userId, token, isAdmin]);

  // Listen for local events too
  useEffect(() => {
    const handleCartNotification = () => {
      setCartNotification(true);
      setNotificationCount(prev => prev + 1);
      setTimeout(() => setCartNotification(false), 5000);
    };

    const handlePurchaseNotification = () => {
      setPurchaseNotification(true);
      setNotificationCount(prev => prev + 1);
      setTimeout(() => setPurchaseNotification(false), 6000);
    };

    window.addEventListener("cartNotification", handleCartNotification);
    window.addEventListener("purchaseNotification", handlePurchaseNotification);

    return () => {
      window.removeEventListener("cartNotification", handleCartNotification);
      window.removeEventListener("purchaseNotification", handlePurchaseNotification);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {/* Cart Notification Icon */}
      <div className="relative">
        {cartNotification && (
          <div className="absolute -top-1 -right-1 z-50">
            <div className="relative">
              <div className="absolute bottom-full mb-2 right-0 bg-green-500 text-white text-sm px-4 py-3 rounded-lg shadow-xl whitespace-nowrap animate-bounce"
                   style={{ minWidth: "160px" }}>
                <div className="flex items-center gap-2 font-semibold">
                  <FiShoppingCart className="w-5 h-5" />
                  Added to cart!
                </div>
                <div className="absolute top-full right-3 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-green-500"></div>
              </div>
            </div>
          </div>
        )}
        
        <div className={`text-white hover:text-blue-200 text-2xl transition-all duration-300 ${
          cartNotification ? "animate-pulse scale-110" : ""
        }`}>
          <FiShoppingCart />
        </div>
        
        {cartNotification && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
        )}
      </div>

      {/* Love/Purchase Notification Icon */}
      <div className="relative">
        {purchaseNotification && (
          <div className="absolute -top-1 -right-1 z-50">
            <div className="relative">
              <div className="absolute bottom-full mb-2 right-0 bg-pink-500 text-white text-sm px-4 py-3 rounded-lg shadow-xl whitespace-nowrap animate-bounce"
                   style={{ minWidth: "200px" }}>
                <div className="flex items-center gap-2 font-semibold">
                  <FiHeart className="w-5 h-5 animate-pulse" />
                  Purchase complete!
                </div>
                <div className="absolute top-full right-3 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-pink-500"></div>
              </div>
            </div>
          </div>
        )}
        
        <div className={`text-white hover:text-pink-200 text-2xl transition-all duration-300 ${
          purchaseNotification ? "animate-pulse scale-110 text-pink-400" : ""
        }`}>
          <FiHeart />
        </div>
        
        {purchaseNotification && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full animate-ping"></span>
        )}
      </div>

      {/* Bell Notification Count (Admin sees all, Users see own) */}
      <div className="relative">
        <div className="text-white hover:text-yellow-200 text-2xl transition-all duration-300">
          <FiBell />
        </div>
        
        {/* Show notification badge if there are unread notifications */}
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </div>
    </div>
  );
}
