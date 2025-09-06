import api from "./api"; // adjust path

export default class NewsLetterApi {
  constructor(baseURL = "http://localhost:5000") {
    this.newsLetterApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/newsletter";
  }

  async subscribe(email) {
    try {
      const response = await this.newsLetterApi.post(`${this.baseURL}/subscribe`, {email});
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to subscribe" };
    }
  }

  async getSubscribers(params = {}) {
    try {
      const response = await this.newsLetterApi.get(`${this.baseURL}/subscribers`, { params });
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch subscribers" };
    }
  }

  async updateSubscriberStatus(subscriber_id, status) {
    try {
      const response = await this.newsLetterApi.put(`${this.baseURL}/subscribers/${subscriber_id}/status`, { status });
      console.log(response);
      return response.data.success;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch subscribers" };
    }
  }

}
