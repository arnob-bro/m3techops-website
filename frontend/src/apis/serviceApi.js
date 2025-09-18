import api from "./api"; // adjust path

export default class ServiceApi {
  constructor(baseURL = "http://localhost:5000") {
    this.serviceApi = api; // reuse existing axios instance
    this.baseURL = baseURL+"/service";
  }

  async createService(
    {title,
    short_desc,
    key_benefits,
    our_process,
    technologies,
    active,
    icon}
    ) {
    try {
      const response = await this.serviceApi.post(`${this.baseURL}/`, 
        {
            title,
            short_desc,
            key_benefits,
            our_process,
            technologies,
            active,
            icon
        });
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create service" };
    }
  }

  async getServices() {
    try {
      const response = await this.serviceApi.get(`${this.baseURL}/`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch services" };
    }
  }

  async getServiceById(service_id) {
    try {
      const response = await this.serviceApi.get(`${this.baseURL}/${service_id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch service" };
    }
  }


  
  async updateService(service_id,
    title,
    short_desc,
    key_benefits,
    our_process,
    technologies,
    active,
    icon) {
    try {
      const response = await this.serviceApi.put(`${this.baseURL}/${service_id}`, 
        { 
            title,
            short_desc,
            key_benefits,
            our_process,
            technologies,
            active,
            icon 
        });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update service" };
    }
  }

  



}
