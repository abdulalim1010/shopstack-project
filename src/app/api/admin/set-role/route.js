import { UserModel } from "@/lib/models";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, role, secret } = body;

    // Simple secret key protection (change this to a secure value in production)
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin-secret-key";

    if (secret !== ADMIN_SECRET) {
      return Response.json(
        { message: "Invalid secret key" },
        { status: 403 }
      );
    }

    if (!email || !role) {
      return Response.json(
        { message: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!["user", "admin"].includes(role)) {
      return Response.json(
        { message: "Invalid role. Must be 'user' or 'admin'" },
        { status: 400 }
      );
    }

    // Find user by email and update role
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      return Response.json(
        { message: "User not found with this email" },
        { status: 404 }
      );
    }

    const updatedUser = await UserModel.updateRole(user._id.toString(), role);

    return Response.json(
      { 
        message: `User role updated to ${role} successfully`,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Set role error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
