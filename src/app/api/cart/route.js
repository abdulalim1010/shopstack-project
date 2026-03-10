import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { CartModel } from "@/lib/models";

export async function GET(request) {
  try {
    // Verify token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const cart = await CartModel.getCart(decoded.id);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { message: "Failed to get cart" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, name, price, image, quantity } = body;

    if (!productId || !name || !price) {
      return NextResponse.json(
        { message: "Product information is required" },
        { status: 400 }
      );
    }

    const cartItem = await CartModel.addItem(decoded.id, {
      productId,
      name,
      price,
      image,
      quantity: quantity || 1,
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { message: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verify token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required" },
        { status: 400 }
      );
    }

    await CartModel.removeItem(itemId);
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { message: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
