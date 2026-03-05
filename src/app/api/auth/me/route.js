import { getTokenFromRequest, verifyToken } from "@/lib/auth";
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

    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return Response.json(
      {
        user: {
          id: userWithoutPassword._id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
