import { NextResponse } from "next/server";

// SSL Commerz Configuration
// Your SSL Commerz sandbox credentials
const SSL_CONFIG = {
  store_id: "alim69b3095f32227",
  store_password: "alim69b3095f32227@ssl",
  is_live: false, // Set to true for production
  base_url: "https://sandbox.sslcommerz.com",
  api_url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amount,
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      productName,
    } = body;

    if (!amount || !orderId || !customerEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare SSL Commerz payment data
    const postData = {
      store_id: SSL_CONFIG.store_id,
      store_password: SSL_CONFIG.store_password,
      total_amount: amount,
      currency: "BDT",
      tran_id: `ORDER_${orderId}_${Date.now()}`,
      success_url: `${request.nextUrl.origin}/api/sslpayment/success`,
      fail_url: `${request.nextUrl.origin}/api/sslpayment/fail`,
      cancel_url: `${request.nextUrl.origin}/checkout/payment`,
      ipn_url: `${request.nextUrl.origin}/api/sslpayment/ipn`,
      product_name: productName || "Shopstack Products",
      product_category: "General",
      product_profile: "general",
      customer_name: customerName || "Customer",
      customer_email: customerEmail,
      customer_mobile: customerPhone || "01XXXXXXXXX",
      customer_address: customerAddress || "Not provided",
      ship_name: customerName || "Customer",
      ship_email: customerEmail,
      ship_mobile: customerPhone || "01XXXXXXXXX",
      ship_address: customerAddress || "Not provided",
    };

    // Make actual API call to SSL Commerz sandbox
    const formData = new URLSearchParams();
    Object.keys(postData).forEach((key) => {
      formData.append(key, postData[key]);
    });

    const response = await fetch(SSL_CONFIG.api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.GatewayPageURL) {
      return NextResponse.json({
        status: "success",
        GatewayPageURL: data.GatewayPageURL,
        orderId: orderId,
      });
    } else {
      return NextResponse.json(
        { message: "Failed to initiate payment", details: data },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("SSL Payment error:", error);
    return NextResponse.json(
      { message: "Payment processing error" },
      { status: 500 }
    );
  }
}

// Success handler for SSL Commerz redirect
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tranId = searchParams.get("tran_id");

  if (status === "VALID") {
    // Payment successful - update order status
    // In production, you would update the order in database here
    return NextResponse.redirect(new URL("/orders?payment=success", request.url));
  } else {
    // Payment failed
    return NextResponse.redirect(new URL("/orders?payment=failed", request.url));
  }
}
