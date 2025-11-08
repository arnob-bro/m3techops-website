import api from "./api";

export default class CareerApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.careerApi = api;
    this.baseURL = baseURL+"/career";
  }
  

  async createCareer({
    title,
    vacancies,
    description,
    send_to,
    status,
    deadline,
    posted_date
  }) {
    try {
      const response = await this.careerApi.post(`${this.baseURL}/`, {
        title,
        vacancies,
        description,
        send_to,
        status,
        deadline,
        posted_date
      }
    );
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create career" };
    }
  }

  // Get all blogs (with optional filters/pagination)
  async getCareers({ page, limit, status } = {}) {
    try {
      const response = await this.careerApi.get(`${this.baseURL}/`, {
        params: { page, limit, status },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch careers" };
    }
  }


  async updateCareer(career_id, {
    title,
    vacancies,
    description,
    send_to,
    status,
    deadline,
    posted_date
  }) {
    try {
      console.log(title, vacancies, description, send_to, status, deadline, posted_date);
      const response = await this.careerApi.put(`${this.baseURL}/${career_id}`, {
        title,
        vacancies,
        description,
        send_to,
        status,
        deadline,
        posted_date
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to update career" };
    }
  }

}
