import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("shopstackDB");

    const offers = await db.collection("offers").find({}).toArray();

    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("shopstackDB");

    const offer = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("offers").insertOne(offer);

    return NextResponse.json({ message: "Offer created successfully", id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
