import api from "./api"; // adjust path

export default class EmployeeApi {
  constructor(baseURL = "http://localhost:5000") {
    this.employeeApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/employee";
  }

  async getEmployees(params = {}) {
    const response = await this.employeeApi.get(`${this.baseURL}/`, { params });
    console.log(response.data);
    return response.data; // contains success, employees, pagination
  }
  

  // Get a single employee by ID
  async getEmployeeById(employee_id) {
    return this.employeeApi.get(`${this.baseURL}/${employee_id}`);
  }

  // Create a new employee
  async createEmployee(employeeData) {
    return this.employeeApi.post(`${this.baseURL}`, 
      employeeData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }

  // Update an existing employee
  async updateEmployee(employee_id, employeeData) {
    return this.employeeApi.put(`${this.baseURL}/${employee_id}`, 
      employeeData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }
  

  

}
