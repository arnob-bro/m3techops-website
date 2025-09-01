import axios from "axios";

export default class ContactApi {
  constructor(baseURL = "http://localhost:5000/inquiry") {
    this.contactApi = axios.create({ baseURL });
  }

  async makeInquiry(inquiryData) {
    try {
      const response = await this.contactApi.post("/", inquiryData);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "inquiry creation failed" };
    }
  }

  async getInquiries(params = {}) {
    try {
      const response = await this.contactApi.get("/", { params });
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch inquiries" };
    }
  }

  async sendReply(inquiry_id, replyMessage) {
    try {
      const response = await this.contactApi.post(`/${inquiry_id}/reply`, {
        replyMessage
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Inquiry reply sending failed" };
    }
  }
  

}
