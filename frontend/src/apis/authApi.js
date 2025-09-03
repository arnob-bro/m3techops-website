import api from "./api"; // adjust path

export default class AuthApi {
  constructor(baseURL = "http://localhost:5000") {
    this.authApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/auth";
  }

  async login(email, password) {
    try {
      const response = await this.authApi.post(`${this.baseURL}/login`, { email, password });
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Login failed" };
    }
  }

  async logout() {
    try {
      const response = await this.authApi.post(`${this.baseURL}/logout`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Logout failed" };
    }
  }

  async refresh() {
    try {
      const response = await this.authApi.post(`${this.baseURL}/refresh`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Logout failed" };
    }
  }

  async getProfile() {
    try {
      const response = await this.authApi.get(`${this.baseURL}/profile`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Profile fetch failed" };
    }
  }

}
