import api from "./api"; // adjust path

export default class RoleApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.roleApi = api; // reuse existing axios instance
    this.baseURL = baseURL + "/role";
  }

  // Create a new role
  async createRole({ name, permissions }) {
    try {
      const response = await this.roleApi.post(`${this.baseURL}/create-role`, {
        name,
        permissions,
      });
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
      const response = await this.roleApi.get(`${this.baseURL}/with-permission`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch roles with permissions" };
    }
  }

  async getAllPermissions() {
    try {
      const response = await this.roleApi.get(`${this.baseURL}/permissions`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch permissions" };
    }
  }

  // Update role
  async updateRole(roleId, { name, permissions }) {
    try {
      const response = await this.roleApi.put(
        `${this.baseURL}/${roleId}`,
        { name, permissions }
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to update role" };
    }
  }
  
}
