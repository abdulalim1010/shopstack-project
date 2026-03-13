import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { OrderModel, CartModel } from "@/lib/models";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";

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

    // Create notification for the order
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const productNames = products.map(p => p.name).join(", ");
      
      await db.collection("notifications").insertOne({
        userId: decoded.id,
        type: "order",
        title: "Order Placed",
        message: `Your order for ${productNames} has been placed successfully!`,
        orderId: order._id?.toString(),
        read: false,
        createdAt: new Date(),
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
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
