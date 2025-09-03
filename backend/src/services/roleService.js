class RoleService {
  constructor(db) {
    this.db = db;

  }

  // ----------Create Role---------------
async createRole({name}) {
    try {

      // Insert role
      const result = await this.db.query(
        `INSERT INTO roles (name) VALUES ($1) RETURNING id, name`,
        [name]
      );

      const role = result.rows[0];

      return role;
    } catch (err) {
      console.error("Error in creating role:", err.message);
      throw new Error("Failed to create role");
    }
  }

  async getRoleByName(name) {
    try {
        const query = `
            SELECT * FROM roles 
            WHERE LOWER(name) = LOWER($1)
        `;
        const result = await this.db.query(query, [name]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getRoleByName service:', error);
        throw new Error('Failed to fetch role by name');
    }
  }

  async getRoleById(id) {
    try {
      const query = `SELECT * FROM roles WHERE id = $1`;
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getRoleById service:', error);
      throw new Error('Failed to fetch role by id');
    }
  }

  
  

}

module.exports = RoleService;
