const nodemailer = require("nodemailer");

class InquiryService {
  constructor(db) {
    this.db = db;

    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // ----------Signup---------------
  async makeInquiry(inquiryData) {
    try {
      const {
        first_name,
        last_name,
        email,
        company,
        job_title,
        phone,
        country,
        message
      } = inquiryData;



      // Insert user
      const result = await this.db.query(
        `INSERT INTO inquiries 
        (first_name, last_name, email, company, job_title, phone, country, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING inquiry_id, first_name, last_name, email, company, job_title, phone, country, message, status`,
        [
            first_name,
            last_name,
            email,
            company,
            job_title,
            phone,
            country,
            message
        ]
      );

      const inquiry = result.rows[0];

      

      return { success: true, message: "Inquiry creation successful." };
    } catch (err) {
      console.error("Error in making this inquiry:", err.message);
      throw new Error("Failed to make this inquiry");
    }
  }

  async getInquiries({ page = 1, limit = 10, company, email }) {
    try {
      const offset = (page - 1) * limit;
  
      // Build dynamic WHERE clause
      const conditions = [];
      const values = [];
  
      if (company) {
        values.push(`%${company}%`);
        conditions.push(`company ILIKE $${values.length}`);
      }
  
      if (email) {
        values.push(`%${email}%`);
        conditions.push(`email ILIKE $${values.length}`);
      }
  
      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  
      // Fetch paginated results
      const result = await this.db.query(
        `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, limit, offset]
      );
  
      // Get total count for pagination
      const countResult = await this.db.query(
        `SELECT COUNT(*) FROM inquiries ${whereClause}`,
        values
      );
      const total = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(total / limit);
  
      return {
        success: true,
        inquiries: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (err) {
      console.error("Error in fetching inquiries:", err.message);
      throw new Error("Failed to fetch inquiries");
    }
  }
  
  
  

}

module.exports = InquiryService;
