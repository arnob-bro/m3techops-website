import api from "./api"; // adjust path

export default class ContactApi {
  constructor(baseURL = "http://localhost:5000") {
    this.contactApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/inquiry";
  }

  async makeInquiry(inquiryData) {
    try {
      const response = await this.contactApi.post(`${this.baseURL}/`, inquiryData);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Inquiry creation failed" };
    }
  }

  async getInquiries(params = {}) {
    try {
      const response = await this.contactApi.get(`${this.baseURL}/`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch inquiries" };
    }
  }

  async sendReply(inquiry_id, replyMessage) {
    try {
      const response = await this.contactApi.post(
        `${this.baseURL}/${inquiry_id}/reply`,
        { replyMessage }
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Inquiry reply sending failed" };
    }
  }
}
