import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const helmet = await db
    .collection("helmets")
    .findOne({ _id: new ObjectId(params.id) });

  return Response.json(helmet);
}