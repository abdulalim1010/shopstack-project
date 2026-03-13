// Notification utility functions

// Trigger cart notification
export const triggerCartNotification = (message = "Added to cart!") => {
  const timestamp = Date.now();
  localStorage.setItem("cartNotification", JSON.stringify({
    show: true,
    message,
    timestamp
  }));
  window.dispatchEvent(new CustomEvent("cartNotification", {
    detail: { message, timestamp }
  }));
};

// Trigger purchase/love notification
export const triggerPurchaseNotification = (message = "Thank you for your purchase!") => {
  const timestamp = Date.now();
  localStorage.setItem("purchaseNotification", JSON.stringify({
    show: true,
    message,
    timestamp
  }));
  window.dispatchEvent(new CustomEvent("purchaseNotification", {
    detail: { message, timestamp }
  }));
};

// Clear notifications
export const clearCartNotification = () => {
  localStorage.removeItem("cartNotification");
};

export const clearPurchaseNotification = () => {
  localStorage.removeItem("purchaseNotification");
};
