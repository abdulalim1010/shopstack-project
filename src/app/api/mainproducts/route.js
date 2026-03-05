import clientPromise from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken, getUserRole, isAdmin } from "@/lib/auth";

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
    const db = client.db(DB_NAME);
    const body = await request.json();

    const { name, brand, description, price, frontImage, backImage, inStock } = body;

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
      inStock: inStock !== undefined ? inStock : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);

    return Response.json(
      { message: "Product created successfully", productId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
