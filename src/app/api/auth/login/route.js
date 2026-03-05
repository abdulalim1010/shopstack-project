import { UserModel } from "@/lib/models";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return Response.json(
      {
        message: "Login successful",
        user: {
          id: userWithoutPassword._id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
