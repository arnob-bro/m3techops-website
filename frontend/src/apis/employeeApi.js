import api from "./api";

export default class EmployeeApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
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
    try{
      const response = await this.employeeApi.post(`${this.baseURL}`, 
        employeeData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      return response.data;
    }catch(error){
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  // Update an existing employee
  async updateEmployee(employee_id, employeeData) {
    try{
      const response = await this.employeeApi.put(`${this.baseURL}/${employee_id}`, 
        employeeData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      return response.data;
    }catch(error){
      console.error('Error creating employee:', error);
      throw error;
    }
  }
  

  

}
