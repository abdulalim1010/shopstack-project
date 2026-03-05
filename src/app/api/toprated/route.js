import clientPromise from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken, getUserRole, isAdmin } from "@/lib/auth";

export async function GET() {

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const products = await db
    .collection("topproducts")
    .find({})
    .toArray();

  return Response.json(products);
}

export async function POST(request) {
  try {
    // Check admin authentication
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const userRole = getUserRole(decoded);
    if (!isAdmin(userRole)) {
      return Response.json({ message: "Admin only" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("shopstacksDB");
    const body = await request.json();

    const { name, brand, description, price, frontImage, backImage, rating, inStock } = body;

    if (!name || !brand || !price) {
      return Response.json(
        { message: "Name, brand, and price are required" },
        { status: 400 }
      );
    }

    const product = {
      name,
      brand,
      description: description || "",
      price: parseFloat(price),
      frontImage: frontImage || "",
      backImage: backImage || "",
      rating: rating || 0,
      inStock: inStock !== undefined ? inStock : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("topproducts").insertOne(product);

    return Response.json(
      { message: "Product created successfully", productId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create toprated product error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}