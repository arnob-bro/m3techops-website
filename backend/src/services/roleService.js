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

  async getAllRoles() {
    try {
        const query = `SELECT * FROM roles ORDER BY id ASC`; // or DESC if you want newest first
        const result = await this.db.query(query);
        return result.rows; // returns an array of all roles
    } catch (error) {
        console.error('Error in getAllRoles service:', error);
        throw new Error('Failed to fetch all roles');
    }
  }

  async getAllRolesWithPermissions() {
    try {
      const query = `
        SELECT r.id AS role_id, r.name AS role_name,
               p.id AS permission_id
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        ORDER BY r.id ASC
      `;
  
      const result = await this.db.query(query);
  
      // Group permission IDs by role
      const rolesMap = new Map();
  
      result.rows.forEach(row => {
        if (!rolesMap.has(row.role_id)) {
          rolesMap.set(row.role_id, {
            id: row.role_id,
            name: row.role_name,
            permissions: []
          });
        }
        if (row.permission_id) {
          rolesMap.get(row.role_id).permissions.push(row.permission_id);
        }
      });
  
      return Array.from(rolesMap.values());
    } catch (error) {
      console.error('Error in getAllRolesWithPermissions service:', error);
      throw new Error('Failed to fetch all roles with permissions');
    }
  }
  

  
  

}

module.exports = RoleService;
