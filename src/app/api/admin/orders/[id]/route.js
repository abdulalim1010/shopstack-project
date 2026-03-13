import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";
const ORDERS_COLLECTION = "orders";

const NOTIFICATIONS_COLLECTION = "notifications";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus, notes } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");

    const updateData = {
      updatedAt: new Date(),
    };

    // Get current order to find userId
    const currentOrder = await db.collection(ORDERS_COLLECTION).findOne(
      { _id: new ObjectId(id) }
    );

    if (!currentOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (notes) {
      updateData.adminNotes = notes;
    }

    const result = await db.collection(ORDERS_COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Create notification for user based on admin action
    const userId = currentOrder.userId;
    let notificationMessage = "";
    let notificationTitle = "";

    if (paymentStatus === "paid") {
      notificationTitle = "Payment Confirmed!";
      notificationMessage = `Your payment of ${currentOrder.totalAmount} has been confirmed. Your order is now being processed.`;
    } else if (paymentStatus === "failed") {
      notificationTitle = "Payment Failed";
      notificationMessage = "Your payment was not verified. Please contact support or try again.";
    } else if (status === "processing") {
      notificationTitle = "Order Processing";
      notificationMessage = "Your order is now being processed. We'll notify you when it's ready.";
    } else if (status === "shipped") {
      notificationTitle = "Order Shipped!";
      notificationMessage = "Your order has been shipped and is on its way to you!";
    } else if (status === "delivered") {
      notificationTitle = "Order Delivered!";
      notificationMessage = "Your order has been delivered. Thank you for shopping with us!";
    } else if (status === "cancelled") {
      notificationTitle = "Order Cancelled";
      notificationMessage = "Your order has been cancelled. If you have questions, please contact support.";
    }

    // Send notification to user
    if (notificationMessage && userId) {
      await db.collection(NOTIFICATIONS_COLLECTION).insertOne({
        userId: userId,
        type: status === "delivered" ? "system" : "order",
        title: notificationTitle,
        message: notificationMessage,
        orderId: id,
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order updated successfully" 
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");

    const order = await db.collection(ORDERS_COLLECTION).aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
    ]).toArray();

    if (order.length === 0) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order[0]);
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { message: "Failed to get order" },
      { status: 500 }
    );
  }
}
