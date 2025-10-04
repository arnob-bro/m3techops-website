import api from "./api"; // adjust path

export default class NewsLetterApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
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
      // console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch subscribers" };
    }
  }

  async updateSubscriberStatus(subscriber_id, status) {
    try {
      const response = await this.newsLetterApi.put(`${this.baseURL}/subscribers/${subscriber_id}/status`, { status });
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch subscribers" };
    }
  }

  async getNewsletters(params = {}) {
    try {
      const response = await this.newsLetterApi.get(`${this.baseURL}/`, { params });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch subscribers" };
    }
  }

  async createNewsletter(newsletterData) {
    try {
      const response = await this.newsLetterApi.post(`${this.baseURL}/`, newsletterData);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create newsletter" };
    }
  }

  async updateNewsletter(newsletter_id, title, content, status, sent_date) {
    try {
      const response = await this.newsLetterApi.put(`${this.baseURL}/${newsletter_id}`, { title, content, status, sent_date });
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update newsletter" };
    }
  }

  async sendNewsletter(newsletter_id) {
    try {
      const response = await this.newsLetterApi.post(`${this.baseURL}/${newsletter_id}/send`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to send newsletter" };
    }
  }



}
