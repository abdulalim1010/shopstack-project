import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(DB_NAME);

    const products = await db
      .collection("products")
      .find({})
      .toArray();

    return Response.json(products, { status: 200 });

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { message: "Database connection failed" },
      { status: 500 }
    );
  }
}
