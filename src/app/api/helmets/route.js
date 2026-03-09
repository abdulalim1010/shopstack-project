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

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("shopstacksDB");

    const helmet = {
      name: body.name,
      brand: body.brand || "",
      description: body.description || "",
      price: body.price,
      image: body.image || "",
      inStock: body.inStock !== false,
      rating: body.rating || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("helmets").insertOne(helmet);

    return Response.json({ success: true, _id: result.insertedId, ...helmet });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
