import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  const client = await clientPromise;
  const db = client.db("shopstackDB");

  let query = {};
  if (location) {
    query = { location };
  }

  const banners = await db
    .collection("banners")
    .find(query)
    .sort({ order: 1 })
    .toArray();

  return NextResponse.json(banners);
}

export async function POST(req) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("shopstackDB");

  // Get max order
  const lastBanner = await db
    .collection("banners")
    .findOne({}, { sort: { order: -1 } });
  
  const newOrder = lastBanner ? lastBanner.order + 1 : 1;

  const result = await db
    .collection("banners")
    .insertOne({ ...body, order: newOrder, createdAt: new Date() });

  return NextResponse.json(result);
}
