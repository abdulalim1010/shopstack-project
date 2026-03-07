import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("shopstackDB");

    const result = await db
      .collection("offers")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Offer updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("shopstackDB");

    const result = await db
      .collection("offers")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Offer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
