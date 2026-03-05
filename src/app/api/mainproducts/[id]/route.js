import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getTokenFromRequest, verifyToken, getUserRole, isAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("shopstacksDB");

  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });

  return Response.json(product);
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
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

    const { name, brand, description, price, frontImage, backImage, inStock } = body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (frontImage !== undefined) updateData.frontImage = frontImage;
    if (backImage !== undefined) updateData.backImage = backImage;
    if (inStock !== undefined) updateData.inStock = inStock;

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product updated successfully", product: result });
  } catch (error) {
    console.error("Update product error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
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

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}