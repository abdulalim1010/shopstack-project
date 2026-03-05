import clientPromise from "@/lib/mongodb";

export async function GET() {

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const products = await db
    .collection("topproducts")
    .find({ rating: { $gte: 4.5 } })
    .toArray();

  return Response.json(products);
}