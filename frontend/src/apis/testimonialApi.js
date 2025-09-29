import api from "./api"; // adjust path

export default class TestimonialApi {
  constructor(baseURL = "http://localhost:5000") {
    this.testimonialApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/testimonial";
  }

  async initTestimonial(testimonialData) {
    try {
      const response = await this.testimonialApi.post(`${this.baseURL}/init`, testimonialData);
      return response.data;
    } catch (err) {
        throw err.response?.data || { error: "Failed to init testimonial" };
    }
  }

  async getTestimonials(params = {}) {
    try {
      const response = await this.testimonialApi.get(`${this.baseURL}/`, { params });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch testimonials" };
    }
  }



}
