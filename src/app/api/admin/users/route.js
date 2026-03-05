import { getTokenFromRequest, verifyToken, isAdmin, getUserRole } from "@/lib/auth";
import { UserModel } from "@/lib/models";

export async function GET(request) {
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
    
    // Debug: Log the role for troubleshooting
    console.log("User role from token:", userRole);
    
    // Check if user is admin
    if (!isAdmin(userRole)) {
      return Response.json(
        { message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const users = await UserModel.getAllUsers();

    return Response.json(
      { users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
