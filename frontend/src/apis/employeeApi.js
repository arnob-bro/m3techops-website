import api from "./api";

export default class EmployeeApi {
  constructor(baseURL = "http://localhost:5000") {
    this.employeeApi = api;
    this.baseURL = baseURL + "/employee";
  }

  async getEmployees(params = {}) {
    try {
      console.log('Fetching employees with params:', params);
      const response = await this.employeeApi.get(`${this.baseURL}/`, { params });
      console.log('Employees response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(employee_id) {
    try {
      const response = await this.employeeApi.get(`${this.baseURL}/${employee_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    try {
      console.log('Creating employee:', employeeData);
      const response = await this.employeeApi.post(`${this.baseURL}`, employeeData);
      console.log('Create employee response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(employee_id, employeeData) {
    try {
      console.log('Updating employee:', employee_id, employeeData);
      const response = await this.employeeApi.put(`${this.baseURL}/${employee_id}`, employeeData);
      console.log('Update employee response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(employee_id) {
    try {
      const response = await this.employeeApi.delete(`${this.baseURL}/${employee_id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
}