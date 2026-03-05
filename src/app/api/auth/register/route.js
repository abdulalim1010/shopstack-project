import { UserModel } from "@/lib/models";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return Response.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return Response.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return Response.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await UserModel.create({ name, email, password });

    // Generate JWT token
    const token = generateToken(user);

    return Response.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
