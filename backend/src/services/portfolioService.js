

class PortfolioService {
  constructor(db) {
    this.db = db;
  }

  // Get all portfolio items
  async getAll() {
    try {
      const result = await this.db.query('SELECT * FROM portfolio_items ORDER BY portfolio_item_id ASC');
      return result.rows;
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      throw err;
    }
  }

  // Get portfolio item by ID
  async getById(id) {
    try {
      const result = await this.db.query('SELECT * FROM portfolio_items WHERE portfolio_item_id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching portfolio by ID:', err);
      throw err;
    }
  }

  // Create a new portfolio item
  async create(data) {
    try {
      const {
        title,
        category,
        description,
        image,
        problem,
        solution,
        results,
        tech_stack,
        active
      } = data;

      const result = await this.db.query(
        `INSERT INTO portfolio_items
        (title, category, description, image, problem, solution, results, tech_stack, active)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
          title,
          category,
          description,
          image,
          problem,
          solution,
          results,
          JSON.stringify(tech_stack), // Store tech_stack as JSON
          active
        ]
      );

      return result.rows[0];
    } catch (err) {
      console.error('Error creating portfolio:', err);
      throw err;
    }
  }

  // Update a portfolio item
  async update(id, updateData) {
    try {
      const fields = [];
      const values = [];
      let idx = 1;

      for (const key in updateData) {
        if (key === 'tech_stack') {
          fields.push(`${key} = $${idx}`);
          values.push(JSON.stringify(updateData[key])); // Store as JSON
        } else {
          fields.push(`${key} = $${idx}`);
          values.push(updateData[key]);
        }
        idx++;
      }

      if (fields.length === 0) return null;

      const query = `UPDATE portfolio_items SET ${fields.join(', ')} WHERE portfolio_item_id = $${idx} RETURNING *`;
      values.push(id);

      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error updating portfolio:', err);
      throw err;
    }
  }
}

module.exports = PortfolioService;
