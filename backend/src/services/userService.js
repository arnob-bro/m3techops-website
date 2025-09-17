const nodemailer = require("nodemailer");
const {generateInquiryReplyTemplate} = require("../utils/generateInquiryReplyTemplate");
const bcrypt = require("bcrypt");

class UserService {
  constructor(db) {
    this.db = db;

    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      host: "mail.m3techops.com", 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // ----------Signup---------------
  async createUser(user_id, email, password, role) {
    try {

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const result = await this.db.query(
        `INSERT INTO users 
        (user_id, email, password_hash, role)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
        [
            user_id,
            email,
            hashedPassword,
            role  
        ]
      );

      return { success: true, message: "User creation successful." };
    } catch (err) {
      console.error("Error in creating user:", err.message);
      throw new Error("Failed to create user");
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting user by email:", err.message);
      throw new Error("Failed to get user by email");
    }
  }

  async getRoleById(role_id) {
    try {
      const result = await this.db.query(`SELECT * FROM roles WHERE id = $1`, [role_id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting role by id:", err.message);
      throw new Error("Failed to get role by id");
    }
  }

  
  async getUserById(user_id) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting user by id:", err.message);
      throw new Error("Failed to get user by id");
    }
  }


  async updateUserEmail(user_id, email) {
    try {
      const result = await this.db.query(`UPDATE users SET email = $1 WHERE user_id = $2 RETURNING *`, [email, user_id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error in getting user by email:", err.message);
      throw new Error("Failed to get user by email");
    }
  }


  async changePassword(userId, oldPassword, newPassword) {
    // Fetch user by ID
    const userResult = await this.db.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) throw new Error("User not found");
  
    // Check old password
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) throw new Error("Old password is incorrect");
  
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Update password
    const result = await this.db.query(
      `UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
      [hashedPassword, userId]
    );
  
    return result.rows[0];
  }

}

module.exports = UserService;
