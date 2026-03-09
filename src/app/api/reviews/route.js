import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const reviews = await db
    .collection("reviews")
    .find({})
    .toArray();

  return NextResponse.json(reviews);
}

export async function POST(req) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const result = await db
    .collection("reviews")
    .insertOne(body);

  return NextResponse.json(result);
}
