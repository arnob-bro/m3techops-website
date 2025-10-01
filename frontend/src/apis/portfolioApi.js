import api from "./api"; 

export default class PortfolioApi {
  constructor(baseURL = "http://localhost:5000") {
    this.portfolioApi = api; 
    this.baseURL = baseURL + "/portfolio";
  }

  // Create a new portfolio item
  async createPortfolio({
    title,
    category,
    description,
    image,
    problem,
    solution,
    results,
    tech_stack,
    active
  }) {
    try {
      const response = await this.portfolioApi.post(`${this.baseURL}/`, {
        title,
        category,
        description,
        image,
        problem,
        solution,
        results,
        tech_stack,
        active
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create portfolio item" };
    }
  }

  // Fetch all portfolio items
  async getPortfolios() {
    try {
      const response = await this.portfolioApi.get(`${this.baseURL}/`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch portfolio items" };
    }
  }

  async getActivePortfolios({ page, limit, category, active } = {}) {
    try {
      const response = await this.portfolioApi.get(`${this.baseURL}/active`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch portfolio items" };
    }
  }

  // Fetch a portfolio item by ID
  async getPortfolioById(portfolio_item_id) {
    try {
      const response = await this.portfolioApi.get(`${this.baseURL}/${portfolio_item_id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch portfolio item" };
    }
  }

  // Update a portfolio item
  async updatePortfolio(
    portfolio_item_id,
    {
      title,
      category,
      description,
      image,
      problem,
      solution,
      results,
      tech_stack,
      active
    }
  ) {
    try {
      const response = await this.portfolioApi.put(`${this.baseURL}/${portfolio_item_id}`, {
        portfolio_item_id,
        title,
        category,
        description,
        image,
        problem,
        solution,
        results,
        tech_stack,
        active
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to update portfolio item" };
    }
  }

  // Optionally: Delete a portfolio item
//   async deletePortfolio(portfolio_item_id) {
//     try {
//       const response = await this.portfolioApi.delete(`${this.baseURL}/${portfolio_item_id}`);
//       return response.data;
//     } catch (err) {
//       throw err.response?.data || { error: "Failed to delete portfolio item" };
//     }
//   }
}
