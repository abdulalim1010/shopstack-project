import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";
const ORDERS_COLLECTION = "orders";
const NOTIFICATIONS_COLLECTION = "notifications";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get payment data from SSL Commerz
    const valId = searchParams.get("val_id");
    const tranId = searchParams.get("tran_id");
    const amount = searchParams.get("amount");
    const cardType = searchParams.get("card_type");
    const status = searchParams.get("status");

    if (status === "VALID" && tranId) {
      // Extract order ID from transaction ID
      const orderIdMatch = tranId.match(/ORDER_(.+?)_\d+/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;

      if (orderId) {
        // Update order payment status in database
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const { ObjectId } = await import("mongodb");

        await db.collection(ORDERS_COLLECTION).updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              paymentStatus: "paid",
              paymentMethod: "sslcommerz",
              sslTransactionId: tranId,
              sslValId: valId,
              cardType: cardType,
              paidAmount: amount,
              updatedAt: new Date(),
            },
          }
        );

        // Create payment notification
        await db.collection(NOTIFICATIONS_COLLECTION).insertOne({
          userId: null, // Will be linked to order
          type: "payment",
          title: "Payment Confirmed",
          message: `Payment of ${amount} received successfully! Your order is now confirmed.`,
          orderId: orderId,
          read: false,
          createdAt: new Date(),
        });
      }

      // Redirect to orders page with success message
      return NextResponse.redirect(
        new URL("/orders?payment=success", request.url)
      );
    } else {
      // Payment validation failed
      return NextResponse.redirect(
        new URL("/orders?payment=failed", request.url)
      );
    }
  } catch (error) {
    console.error("SSL Payment success error:", error);
    return NextResponse.redirect(
      new URL("/orders?payment=error", request.url)
    );
  }
}
