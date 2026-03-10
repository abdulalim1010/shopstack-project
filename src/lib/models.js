import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

const DB_NAME = process.env.MONGODB_DB || "shopstacksDB";
const USERS_COLLECTION = "users";
const CARTS_COLLECTION = "carts";
const ORDERS_COLLECTION = "orders";

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
      role: userData.role || "user",
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

  /**
   * Update user role (for admin)
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Object|null} Updated user or null
   */
  async updateRole(userId, role) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    
    const result = await db.collection(USERS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    
    if (result) {
      const { password, ...userWithoutPassword } = result;
      return userWithoutPassword;
    }
    return null;
  },

  /**
   * Get all users (for admin)
   * @returns {Array} Array of users
   */
  async getAllUsers() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = await db.collection(USERS_COLLECTION)
      .find({})
      .project({ password: 0 })
      .toArray();
    return users;
  },
};

/**
 * Cart Model - MongoDB operations for shopping cart
 */
export const CartModel = {
  /**
   * Add item to cart
   * @param {string} userId - User ID
   * @param {Object} productData - Product data (productId, name, price, image, quantity)
   * @returns {Object} Cart item
   */
  async addItem(userId, productData) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");

    // Check if item already exists in cart
    const existingItem = await db.collection(CARTS_COLLECTION).findOne({
      userId: new ObjectId(userId),
      productId: productData.productId,
    });

    if (existingItem) {
      // Update quantity
      const result = await db.collection(CARTS_COLLECTION).findOneAndUpdate(
        { _id: existingItem._id },
        { $inc: { quantity: productData.quantity || 1 } },
        { returnDocument: "after" }
      );
      return result;
    }

    // Add new item
    const cartItem = {
      userId: new ObjectId(userId),
      productId: productData.productId,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      quantity: productData.quantity || 1,
      addedAt: new Date(),
    };

    const result = await db.collection(CARTS_COLLECTION).insertOne(cartItem);
    return { ...cartItem, _id: result.insertedId };
  },

  /**
   * Get user's cart
   * @param {string} userId - User ID
   * @returns {Array} Cart items
   */
  async getCart(userId) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(CARTS_COLLECTION)
      .find({ userId: new ObjectId(userId) })
      .sort({ addedAt: -1 })
      .toArray();
  },

  /**
   * Remove item from cart
   * @param {string} cartItemId - Cart item ID
   * @returns {Object} Delete result
   */
  async removeItem(cartItemId) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(CARTS_COLLECTION).deleteOne({ _id: new ObjectId(cartItemId) });
  },

  /**
   * Clear user's cart
   * @param {string} userId - User ID
   * @returns {Object} Delete result
   */
  async clearCart(userId) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(CARTS_COLLECTION).deleteMany({ userId: new ObjectId(userId) });
  },

  /**
   * Get all cart items (for admin)
   * @returns {Array} All cart items with user info
   */
  async getAllCarts() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");

    const carts = await db.collection(CARTS_COLLECTION)
      .aggregate([
        {
          $lookup: {
            from: USERS_COLLECTION,
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.password": 0
          }
        },
        { $sort: { addedAt: -1 } }
      ])
      .toArray();
    return carts;
  },
};

/**
 * Order Model - MongoDB operations for orders
 */
export const OrderModel = {
  /**
   * Create an order
   * @param {string} userId - User ID
   * @param {Array} products - Array of products
   * @param {number} totalAmount - Total order amount
   * @param {Object} shippingInfo - Shipping information
   * @param {string} paymentMethod - Payment method
   * @returns {Object} Created order
   */
  async create(userId, products, totalAmount, shippingInfo = null, paymentMethod = null, paymentStatus = "pending") {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");

    const order = {
      userId: new ObjectId(userId),
      products: products.map(p => ({
        productId: p.productId,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity: p.quantity,
      })),
      totalAmount,
      status: "pending",
      paymentStatus: paymentStatus || "pending",
      paymentMethod: paymentMethod || "pending",
      shippingInfo: shippingInfo || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(ORDERS_COLLECTION).insertOne(order);
    return { ...order, _id: result.insertedId };
  },

  /**
   * Get user's orders
   * @param {string} userId - User ID
   * @returns {Array} User's orders
   */
  async getUserOrders(userId) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(ORDERS_COLLECTION)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  },

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|null} Order or null
   */
  async getById(orderId) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(ORDERS_COLLECTION).findOne({ _id: new ObjectId(orderId) });
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Object|null} Updated order or null
   */
  async updateStatus(orderId, status) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    return db.collection(ORDERS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  },

  /**
   * Get all orders (for admin)
   * @returns {Array} All orders with user info
   */
  async getAllOrders() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const orders = await db.collection(ORDERS_COLLECTION)
      .aggregate([
        {
          $lookup: {
            from: USERS_COLLECTION,
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.password": 0
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();
    return orders;
  },
};
