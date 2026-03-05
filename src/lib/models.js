import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";
const USERS_COLLECTION = "users";

/**
 * User Model - MongoDB operations for users
 */
export const UserModel = {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object|null} User object or null
   */
  async findByEmail(email) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db.collection(USERS_COLLECTION).findOne({ email: email.toLowerCase() });
  },

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Object|null} User object or null
   */
  async findById(id) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(USERS_COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  /**
   * Create a new user
   * @param {Object} userData - User data (name, email, password)
   * @returns {Object} Created user (without password)
   */
  async create(userData) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(USERS_COLLECTION).insertOne(user);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  },

  /**
   * Compare password
   * @param {string} enteredPassword - Password to compare
   * @param {string} storedPassword - Stored hashed password
   * @returns {boolean} True if passwords match
   */
  async comparePassword(enteredPassword, storedPassword) {
    return bcrypt.compare(enteredPassword, storedPassword);
  },
};
