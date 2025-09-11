import api from "./api"; // adjust path

export default class PolicyApi {
  constructor(baseURL = "http://localhost:5000") {
    this.policyApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/policy";
  }


  async getAllPolicies() {
    try {
      const response = await this.policyApi.get(`${this.baseURL}/`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch services" };
    }
  }


  async getpolicyByType(type) {
    try {
      const response = await this.policyApi.get(`${this.baseURL}/${type}`);
      console.log(response.data);
      return response.data.policy;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch this policy" };
    }
  }


  
  async updatePolicy(type,
    title,
    content) {
    try {
      const response = await this.policyApi.put(`${this.baseURL}/${type}`, 
        { 
            title,
            content
        });
      console.log(response.data);
      return response.data.updatedPolicy;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update this policy" };
    }
  }

  



}
