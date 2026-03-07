import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const client = await clientPromise;
    const db = client.db("shopstackDB");

    const searchRegex = { $regex: query, $options: "i" };

    // Search in mainproducts
    const mainProducts = await db
      .collection("mainproducts")
      .find({
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { description: searchRegex }
        ]
      })
      .limit(10)
      .toArray();

    // Search in toprated products
    const topRated = await db
      .collection("toprated")
      .find({
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { description: searchRegex }
        ]
      })
      .limit(10)
      .toArray();

    // Mark source for each product
    const mainWithSource = mainProducts.map(p => ({ ...p, source: "main" }));
    const topWithSource = topRated.map(p => ({ ...p, source: "toprated" }));

    // Combine and limit results
    const results = [...mainWithSource, ...topWithSource].slice(0, 20);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
