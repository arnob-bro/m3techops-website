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
        const link = `${process.env.FRONTEND_URL}/testimonial/token`;

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


        //insert testimonial
        const result = await this.db.query(
            `INSERT INTO testimonials 
            (client_name, client_email, company_name, designation)
           VALUES ($1,$2,$3,$4,$5)
           RETURNING *`,
            [
                client_name, 
                client_email, 
                company_name, 
                designation
            ]
        );
    }
    
  
  }
  
  module.exports = TestimonialService;
  