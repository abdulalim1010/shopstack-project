import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";
const NOTIFICATIONS_COLLECTION = "notifications";

// GET - Get notifications (user sees own, admin sees all)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const since = searchParams.get("since"); // timestamp
    const getAll = searchParams.get("all") === "true"; // Admin flag to get all

    let decoded;
    let isAdmin = false;
    
    // Verify token if provided
    if (token) {
      decoded = verifyToken(token);
      if (decoded) {
        isAdmin = decoded.role === "admin";
      }
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let query = {};
    
    // Admin gets all notifications, users get only their own
    // OR if getAll=true (admin dashboard)
    if (getAll || isAdmin) {
      // Admin sees all notifications (null userId = system, or specific userId)
      query = {}; // All notifications
    } else if (userId) {
      // Regular user sees only their notifications
      query = { userId: userId };
    } else if (decoded) {
      // Fallback to token user
      query = { userId: decoded.id };
    }

    // If 'since' parameter provided, get only newer notifications
    if (since) {
      query.createdAt = { $gt: new Date(parseInt(since)) };
    }

    const notifications = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Get total count
    const totalCount = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .countDocuments(query);

    // Get unread count
    const unreadQuery = { ...query, read: false };
    const unreadCount = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .countDocuments(unreadQuery);

    return NextResponse.json({
      notifications,
      totalCount,
      unreadCount,
      isAdmin: isAdmin || getAll
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { message: "Failed to get notifications" },
      { status: 500 }
    );
  }
}

// POST - Create a new notification
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, type, title, message, productId, isSystem } = body;

    if (!type || !message) {
      return NextResponse.json(
        { message: "Type and message are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const notification = {
      userId: userId || null, // null = broadcast to all or system notification
      type, // 'cart', 'purchase', 'order', 'payment', 'system'
      title: title || "",
      message,
      productId: productId || null,
      read: false,
      createdAt: new Date(),
    };

    const result = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .insertOne(notification);

    return NextResponse.json(
      { success: true, notificationId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { message: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PUT - Mark notifications as read
export async function PUT(request) {
  try {
    const body = await request.json();
    const { notificationIds, markAllRead, userId } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let updateQuery = {};
    
    if (markAllRead && userId) {
      // Mark all as read for a user
      updateQuery = { userId: userId, read: false };
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const { ObjectId } = await import("mongodb");
      updateQuery = { _id: { $in: notificationIds.map(id => new ObjectId(id)) } };
    }

    await db
      .collection(NOTIFICATIONS_COLLECTION)
      .updateMany(updateQuery, { $set: { read: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { message: "Failed to mark as read" },
      { status: 500 }
    );
  }
}
