
class TestimonialController {
    constructor(testimonialService) {
      this.testimonialService = testimonialService;
  
      // Bind methods so 'this' works in routes
      this.initTestimonial = this.initTestimonial.bind(this);
    }
  
    async initTestimonial(req, res) {
      try {
        const { client_name, client_email, company_name, designation} = req.body;
        
        // check if all fields are provided
        if (!client_email) {
          return res.status(400).json({error: "client email is required"});
        }
        // check if email is a valid email
        if (!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email)) {
          return res.status(400).json({ error: "Invalid email" });
        }

        const testimonial = await this.testimonialService.initTestimonial({ client_name, client_email, company_name, designation});
        res.status(201).json({success: true, message: "testimonial initialized successfully", testimonial});
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
      
}
  
  module.exports = TestimonialController;
  