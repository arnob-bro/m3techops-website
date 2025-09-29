const nodemailer = require("nodemailer");
const crypto = require("crypto");
class TestimonialService {
    constructor(db) {
      this.db = db;

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

    generateTestimonialToken() {
        return crypto.randomBytes(32).toString("hex"); // random string
    }


    async initTestimonial({ client_name="", client_email, company_name="", designation=""}){

        const token = this.generateTestimonialToken();
        const link = `${process.env.FRONTEND_URL}/testimonial/${token}`;

        //insert testimonial
        const result = await this.db.query(
            `INSERT INTO testimonials 
            (client_name, client_email, company_name, designation, token)
           VALUES ($1,$2,$3,$4,$5)
           RETURNING *`,
            [
                client_name, 
                client_email, 
                company_name, 
                designation,
                token
            ]     
        );

        this.transporter.sendMail({
          from: `"M3TechOps Team" <${process.env.EMAIL_USER}>`,
          to: client_email,
          subject: `For Your Precious Testimonial`,
          html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>We value your feedback!</h2>
              <p>Please click the button below to provide your testimonial:</p>
              <a href="${link}" 
                  style="display:inline-block; padding:10px 20px; background:#22577a; color:#fff; text-decoration:none; border-radius:5px;">
                  Give Testimonial
              </a>
              <p>If the button doesn’t work, copy and paste this link into your browser:</p>
              <p><a href="${link}">${link}</a></p>
              </div>
          `,
      });

        return result.rows[0];
    }

    async getTestimonials(page = 1, limit = 10, searchTerm = "", status = "") {
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      const offset = (pageNumber - 1) * limitNumber;
  
      const searchPattern = `%${searchTerm.trim()}%`;
  
      // Status filter using boolean flag safely
      let statusValue = null;
      if (status === "active") statusValue = true;
      else if (status === "inactive") statusValue = false;
  
      // Build query with parameters only
      const values = [searchTerm, searchPattern, limitNumber, offset];
      let statusClause = "";
      if (statusValue !== null) {
          values.push(statusValue);
          statusClause = `AND active = $${values.length}`;
      }
  
      const testimonialsQuery = `
        SELECT *
        FROM testimonials
        WHERE ($1 = '' OR client_name ILIKE $2 OR client_email ILIKE $2 OR company_name ILIKE $2 OR designation ILIKE $2)
        ${statusClause}
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
      `;
  
      const testimonialsResult = await this.db.query(testimonialsQuery, values);
  
      // Count total
      const countValues = [searchTerm, searchPattern];
      let countClause = "";
      if (statusValue !== null) {
          countValues.push(statusValue);
          countClause = `AND active = $${countValues.length}`;
      }
  
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM testimonials
        WHERE ($1 = '' OR client_name ILIKE $2 OR client_email ILIKE $2 OR company_name ILIKE $2 OR designation ILIKE $2)
        ${countClause}
      `;
      const countResult = await this.db.query(countQuery, countValues);
  
      const total = parseInt(countResult.rows[0].total, 10);
  
      return {
          success: true,
          testimonials: testimonialsResult.rows || [],
          pagination: {
              page: pageNumber,
              limit: limitNumber,
              total,
              totalPages: Math.ceil(total / limitNumber)
          }
      };
    }
  
  
    
  
  }
  
  module.exports = TestimonialService;
  