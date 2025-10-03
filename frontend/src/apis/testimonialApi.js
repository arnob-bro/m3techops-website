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

  async getAllActiveTestimonials() {
    try {
      const response = await this.testimonialApi.get(`${this.baseURL}/all-active`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch all active Stestimonials" };
    }
  }

  async getTestimonialByToken(token) {
    try {
      const response = await this.testimonialApi.get(`${this.baseURL}/${token}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch testimonial by token" };
    }
  }

  async getTestimonialFeedbackStatusByToken(token) {
    try {
      const response = await this.testimonialApi.get(`${this.baseURL}/feedback-status/${token}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch testimonial feedback status by token" };
    }
  }

  async submitTestimonial(token, testimonialData) {
    try {
      const response = await this.testimonialApi.post(
        `${this.baseURL}/submit/${token}`,
        testimonialData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (err) {
        throw err.response?.data || { error: "Failed to submit testimonial" };
    }
  }


  async updateActiveStatus(testimonial_id, active) {
    try {
      const response = await this.testimonialApi.patch(
        `${this.baseURL}/${testimonial_id}`,
        {active}
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
        throw err.response?.data || { error: "Failed to update testimonial active status" };
    }
  }



}
