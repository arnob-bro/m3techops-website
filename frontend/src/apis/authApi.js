import api from "./api"; // adjust path

export default class AuthApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
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
      const response = await this.authApi.post(`${this.baseURL}/refresh`, { withCredentials: true });
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

  async verifyNewPassToken(token) {
    try {
      const response = await this.authApi.get(`${this.baseURL}/change-password/${token}`);
      return response.data; // { success: true/false, message: "..." }
    } catch (err) {
      throw err.response?.data || { error: "Token verification failed" };
    }
  }

  /**
   * Change password using reset token
   */
  async changePasswordWithToken(token, newPassword) {
    try {
      const response = await this.authApi.post(`${this.baseURL}/change-password/${token}`, {
        new_password: newPassword,
      });
      return response.data; // { success: true, message: "...", user: {...} }
    } catch (err) {
      throw err.response?.data || { error: "Password change failed" };
    }
  }

}
