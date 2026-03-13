// Notification utility functions

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Trigger cart notification
export const triggerCartNotification = (message = "Added to cart!") => {
  const timestamp = Date.now();
  if (isBrowser) {
    try {
      localStorage.setItem("cartNotification", JSON.stringify({
        show: true,
        message,
        timestamp
      }));
      window.dispatchEvent(new CustomEvent("cartNotification", {
        detail: { message, timestamp }
      }));
    } catch (e) {
      console.warn("Could not trigger cart notification:", e);
    }
  }
};

// Trigger purchase/love notification
export const triggerPurchaseNotification = (message = "Thank you for your purchase!") => {
  const timestamp = Date.now();
  if (isBrowser) {
    try {
      localStorage.setItem("purchaseNotification", JSON.stringify({
        show: true,
        message,
        timestamp
      }));
      window.dispatchEvent(new CustomEvent("purchaseNotification", {
        detail: { message, timestamp }
      }));
    } catch (e) {
      console.warn("Could not trigger purchase notification:", e);
    }
  }
};

// Clear notifications
export const clearCartNotification = () => {
  if (isBrowser) {
    try {
      localStorage.removeItem("cartNotification");
    } catch (e) {
      console.warn("Could not clear cart notification:", e);
    }
  }
};

export const clearPurchaseNotification = () => {
  if (isBrowser) {
    try {
      localStorage.removeItem("purchaseNotification");
    } catch (e) {
      console.warn("Could not clear purchase notification:", e);
    }
  }
};
