"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-hot-toast"; // We'll use a simple toast approach

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState({
    cart: { show: false, count: 0, message: "" },
    purchase: { show: false, count: 0, message: "" },
  });

  // Show cart notification (when item added to cart)
  const showCartNotification = useCallback((message = "Item added to cart!") => {
    // Use localStorage to trigger notification across tabs/windows
    const timestamp = Date.now();
    localStorage.setItem("cartNotification", JSON.stringify({
      show: true,
      message,
      timestamp
    }));
    
    // Trigger a custom event for the same window
    window.dispatchEvent(new CustomEvent("cartNotification", {
      detail: { message, timestamp }
    }));
  }, []);

  // Show purchase/love notification (when purchase is completed)
  const showPurchaseNotification = useCallback((message = "Thank you for your purchase!") => {
    // Use localStorage to trigger notification across tabs/windows
    const timestamp = Date.now();
    localStorage.setItem("purchaseNotification", JSON.stringify({
      show: true,
      message,
      timestamp
    }));
    
    // Trigger a custom event for the same window
    window.dispatchEvent(new CustomEvent("purchaseNotification", {
      detail: { message, timestamp }
    }));
  }, []);

  // Clear notifications
  const clearCartNotification = useCallback(() => {
    localStorage.removeItem("cartNotification");
  }, []);

  const clearPurchaseNotification = useCallback(() => {
    localStorage.removeItem("purchaseNotification");
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showCartNotification,
        showPurchaseNotification,
        clearCartNotification,
        clearPurchaseNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
