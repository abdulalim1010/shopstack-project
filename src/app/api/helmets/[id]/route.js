import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  const { id } = await params;
  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const helmet = await db
    .collection("helmets")
    .findOne({ _id: new (await import("mongodb")).ObjectId(id) });

  if (!helmet) {
    return Response.json({ success: false, message: "Helmet not found" }, { status: 404 });
  }

  return Response.json(helmet);
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("shopstacksDB");

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await db.collection("helmets").findOneAndUpdate(
      { _id: new (await import("mongodb")).ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return Response.json({ success: false, message: "Helmet not found" }, { status: 404 });
    }

    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("shopstacksDB");

    const result = await db.collection("helmets").deleteOne({
      _id: new (await import("mongodb")).ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ success: false, message: "Helmet not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Helmet deleted successfully" });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
