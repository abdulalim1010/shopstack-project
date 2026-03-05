import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing id and email
 * @returns {string} JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} Token or null if not found
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}
