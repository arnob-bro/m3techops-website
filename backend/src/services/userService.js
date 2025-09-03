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
  async createUser(user_id, name,email, password, phone, role_id) {
    try {

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const result = await this.db.query(
        `INSERT INTO users 
        (user_id, name, email, password_hash, phone, role_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING user_id, name, email, password_hash, phone, role_id`,
        [
            user_id,
            name,
            email,
            hashedPassword,
            phone,
            role_id   
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
      return result.rows[0];
    } catch (err) {
      console.error("Error in getting user by email:", err.message);
      throw new Error("Failed to get user by email");
    }
  }

  async getRoleById(role_id) {
    try {
      const result = await this.db.query(`SELECT * FROM roles WHERE id = $1`, [role_id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error in getting role by id:", err.message);
      throw new Error("Failed to get role by id");
    }
  }

  
  async getUserById(user_id) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error in getting user by id:", err.message);
      throw new Error("Failed to get user by id");
    }
  }

}

module.exports = UserService;
