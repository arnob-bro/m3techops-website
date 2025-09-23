import api from "./api"; // adjust path

export default class RoleApi {
  constructor(baseURL = "http://localhost:5000") {
    this.roleApi = api; // reuse existing axios instance
    this.baseURL = baseURL + "/roles";
  }

  // Create a new role
  async createRole({ name }) {
    try {
      const response = await this.roleApi.post(`${this.baseURL}/`, { name });
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create role" };
    }
  }

  // Fetch all roles
  async getAllRoles() {
    try {
      const response = await this.roleApi.get(`${this.baseURL}/`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch roles" };
    }
  }

  // Fetch all roles with permissions
  async getAllRolesWithPermissions() {
    try {
      const response = await this.roleApi.get(`${this.baseURL}/permissions`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch roles with permissions" };
    }
  }

  // Update role
  async updateRole(roleId, { name }) {
    try {
      const response = await this.roleApi.put(`${this.baseURL}/${roleId}`, { name });
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to update role" };
    }
  }
}
