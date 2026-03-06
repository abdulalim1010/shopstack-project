import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("shopstackDB");

  const contacts = await db
    .collection("contacts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(contacts);
}

export async function POST(req) {

  const body = await req.json();

  const client = await clientPromise;

  const db = client.db("shopstackDB");

  const result = await db
    .collection("contacts")
    .insertOne({ ...body, createdAt: new Date() });

  return NextResponse.json(result);

}