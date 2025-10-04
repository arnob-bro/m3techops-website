import api from "./api"; // adjust path

export default class BlogApi {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.blogApi = api; // reuse existing axios instance
    this.baseURL = baseURL + "/blog"; // matches createBlogRouter
  }

  // Create blog
  async createBlog({
    title,
    category,
    excerpt,
    content,
    image,
    read_time,
    author_name,
    author_avatar,
    author_role,
    active,
  }) {
    try {
      const response = await this.blogApi.post(`${this.baseURL}/`, {
        title,
        category,
        excerpt,
        content,
        image,
        read_time,
        author_name,
        author_avatar,
        author_role,
        active,
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to create blog" };
    }
  }

  // Get all blogs (with optional filters/pagination)
  async getBlogs({ page, limit, title, active } = {}) {
    try {
      const response = await this.blogApi.get(`${this.baseURL}/`, {
        params: { page, limit, title, active },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch blogs" };
    }
  }

  // Get single blog by ID
  async getBlogById(blog_id) {
    try {
      const response = await this.blogApi.get(`${this.baseURL}/${blog_id}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to fetch blog" };
    }
  }

  // Update blog
  async updateBlog(blog_id, updateData) {
    try {
      const response = await this.blogApi.put(
        `${this.baseURL}/${blog_id}`,
        updateData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to update blog" };
    }
  }

  // Toggle active state
  async toggleActive(blog_id) {
    try {
      const response = await this.blogApi.patch(
        `${this.baseURL}/${blog_id}/toggle`
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: "Failed to toggle blog state" };
    }
  }
}
