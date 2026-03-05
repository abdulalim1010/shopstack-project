import { getTokenFromRequest, verifyToken, isAdmin, getUserRole } from "@/lib/auth";
import { UserModel } from "@/lib/models";

export async function PUT(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return Response.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user role from token
    const userRole = getUserRole(decoded);
    
    // Check if user is admin
    if (!isAdmin(userRole)) {
      return Response.json(
        { message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Await params in Next.js 16
    const { id } = await params;
    
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !["user", "admin"].includes(role)) {
      return Response.json(
        { message: "Invalid role. Must be 'user' or 'admin'" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.updateRole(id, role);

    if (!updatedUser) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "User role updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user role error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return Response.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user role from token
    const userRole = getUserRole(decoded);
    
    // Check if user is admin
    if (!isAdmin(userRole)) {
      return Response.json(
        { message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Await params in Next.js 16
    const { id } = await params;

    // Prevent admin from deleting themselves
    if (id === decoded.id) {
      return Response.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const client = await import("@/lib/mongodb").then(m => m.default);
    const { ObjectId } = await import("mongodb");
    
    const db = client.db(process.env.MONGODB_DB || "shopstacksDB");
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
