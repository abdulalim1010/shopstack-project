import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { OrderModel } from "@/lib/models";

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

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const orders = await OrderModel.getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    return NextResponse.json(
      { message: "Failed to get orders" },
      { status: 500 }
    );
  }
}
