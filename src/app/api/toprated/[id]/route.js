import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const product = await db
    .collection("topproducts")
    .findOne({ _id: new ObjectId(id) });

  return Response.json(product);
}
