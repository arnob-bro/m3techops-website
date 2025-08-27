// src/api/adminApi.js

export default class AdminApi {
    constructor(httpClient) {
      this.httpClient = httpClient;
    }
  
    // Authentication
    login(identifier,password) {
      return this.httpClient.post("/admin/login", identifier,password);
    }
  
    // Services
    getServices() {
      return this.httpClient.get("/admin/services");
    }
  
    createService(data) {
      return this.httpClient.post("/admin/services", data);
    }
  
    updateService(id, data) {
      return this.httpClient.put(`/admin/services/${id}`, data);
    }
  
    deleteService(id) {
      return this.httpClient.delete(`/admin/services/${id}`);
    }
  
    // Portfolio
    getPortfolio() {
      return this.httpClient.get("/admin/portfolio");
    }
  
    createPortfolioItem(data) {
      return this.httpClient.post("/admin/portfolio", data);
    }
  
    updatePortfolioItem(id, data) {
      return this.httpClient.put(`/admin/portfolio/${id}`, data);
    }
  
    deletePortfolioItem(id) {
      return this.httpClient.delete(`/admin/portfolio/${id}`);
    }
  
    // Blog
    getBlogs() {
      return this.httpClient.get("/admin/blogs");
    }
  
    createBlog(data) {
      return this.httpClient.post("/admin/blogs", data);
    }
  
    updateBlog(id, data) {
      return this.httpClient.put(`/admin/blogs/${id}`, data);
    }
  
    deleteBlog(id) {
      return this.httpClient.delete(`/admin/blogs/${id}`);
    }
  }
  