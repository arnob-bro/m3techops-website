import api from "./api"; // adjust path if needed

export default class PayslipApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.payslipApi = api; // reuse existing axios instance
    this.baseURL = baseURL + "/payslip";
  }

  // Create a new payslip
  async createPayslip(payslipData) {
    try {
      const response = await this.payslipApi.post(`${this.baseURL}/`, payslipData);
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create payslip" };
    }
  }

  // Get all payslips (with optional pagination, search, status filter)
  async getPayslips({ page, limit, searchTerm, status } = {}) {
    try {
      const params = {};
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (searchTerm) params.searchTerm = searchTerm;
      if (status) params.status = status;

      const response = await this.payslipApi.get(`${this.baseURL}/`, { params });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch payslips" };
    }
  }

  // Get a single payslip by ID
  async getPayslipById(payslip_id) {
    try {
      const response = await this.payslipApi.get(`${this.baseURL}/${payslip_id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch payslip" };
    }
  }

  // Update payslip status
  async updatePayslipStatus(payslip_id, status) {
    try {
      const response = await this.payslipApi.put(`${this.baseURL}/${payslip_id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update payslip status" };
    }
  }
}
