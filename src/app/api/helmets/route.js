import clientPromise from "@/lib/mongodb";

export async function GET() {

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const helmets = await db
    .collection("helmets")
    .find({})
    .toArray();

  return Response.json(helmets);
}