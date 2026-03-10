import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tranId = searchParams.get("tran_id");
    const status = searchParams.get("status");

    // Extract order ID from transaction ID
    if (tranId) {
      const orderIdMatch = tranId.match(/ORDER_(.+?)_\d+/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;

      if (orderId) {
        // Update order payment status to failed
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "shopstacksDB");
        const { ObjectId } = await import("mongodb");

        await db.collection("orders").updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              paymentStatus: "failed",
              paymentMethod: "sslcommerz",
              failedAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      }
    }

    // Redirect to orders page with failure message
    return NextResponse.redirect(
      new URL("/orders?payment=failed", request.url)
    );
  } catch (error) {
    console.error("SSL Payment fail error:", error);
    return NextResponse.redirect(
      new URL("/orders?payment=error", request.url)
    );
  }
}
