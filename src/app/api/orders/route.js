import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { OrderModel, CartModel } from "@/lib/models";

export async function GET(request) {
  try {
    // Verify token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const orders = await OrderModel.getUserOrders(decoded.id);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: "Failed to get orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { products, totalAmount, clearCart, shippingInfo, paymentMethod, paymentStatus, transactionId, senderPhone, adminPhone } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "Products are required" },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { message: "Valid total amount is required" },
        { status: 400 }
      );
    }

    // Create order
    const order = await OrderModel.create(decoded.id, products, totalAmount, shippingInfo, paymentMethod, paymentStatus);

    // Clear cart if requested
    if (clearCart) {
      await CartModel.clearCart(decoded.id);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
