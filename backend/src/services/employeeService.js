const supabase = require("../config/supabaseClient.js");
class EmployeeService {
  constructor(db, userService, roleService) {
    this.db = db;
    this.userService = userService;
    this.roleService = roleService;
  }

  // --- Helper validation functions ---
  validateEmail(email) {
    const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    return regex.test(email);
  }

  validatePhone(phone) {
    return /^\+?\d{10,14}$/.test(phone);
  }

  validateName(name) {
    return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name);
  }

  validateEmployeeId(id) {
    return /^[A-Za-z0-9_-]{3,20}$/.test(id);
  }

  async validateRole(role_id) {
    const role = await this.roleService.getRoleById(role_id);
    if (!role) throw new Error("Invalid role");
    return role;
  }

  // --- Create Employee ---
  async createEmployee({
    employee_id, first_name, last_name, email, phone, position,
    role_id, hire_date, address = null, city = null, country = null,
    avatar, emergency_contact = null
  }) {
    // Basic validations
    if (!employee_id || !first_name || !last_name || !email || !phone || !position || !role_id || !hire_date) {
      throw new Error("All fields are required");
    }
    if (!this.validateEmail(email)) throw new Error("Invalid email");
    if (!this.validatePhone(phone)) throw new Error("Invalid phone number");
    if (!this.validateName(first_name)) throw new Error("Invalid first_name");
    if (!this.validateName(last_name)) throw new Error("Invalid last_name");
    if (!this.validateEmployeeId(employee_id)) throw new Error("Invalid employee_id");
    await this.validateRole(role_id);

    // Check if user/email already exists
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) throw new Error("User already exists with this email");

    // Check if employee_id exists
    const existingEmployee = await this.getEmployeeById(employee_id);
    if (existingEmployee) throw new Error("Employee already exists with this employee_id");

    // Create user account with default password
    const initialPassword = "123456";

    const fileName = `profile_pic_${Date.now()}_${avatar.originalname}`;
    const { data, error } = await supabase.storage
      .from("profile_pics")
      .upload(fileName, avatar.buffer, { contentType: avatar.mimetype });
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("profile_pics")
      .getPublicUrl(fileName);

    const avatarUrl = publicUrlData.publicUrl;

    await this.userService.createUser(employee_id, email, initialPassword, "employee");

    // Insert employee into DB
    const query = `
      INSERT INTO employees
      (employee_id, first_name, last_name, phone, position, role_id, hire_date, address, city, country, avatar, emergency_contact, email)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;
    const values = [
      employee_id, first_name, last_name, phone, position, role_id, hire_date,
      address, city, country, avatarUrl, emergency_contact ? JSON.stringify(emergency_contact) : null, email
    ];

    const result = await this.db.query(query, values);
    return { employee: result.rows[0], initialPassword };
  }

  // --- Update Employee ---
  async updateEmployee({
    employee_id, first_name, last_name, email, phone, position,
    role_id, hire_date, address = null, city = null, country = null,
    avatar = null, emergency_contact = null
  }) {
    // Basic validations
    if (!employee_id || !first_name || !last_name || !email || !phone || !position || !role_id || !hire_date) {
      throw new Error("All fields are required");
    }
    if (!this.validateEmail(email)) throw new Error("Invalid email");
    if (!this.validatePhone(phone)) throw new Error("Invalid phone number");
    if (!this.validateName(first_name)) throw new Error("Invalid first_name");
    if (!this.validateName(last_name)) throw new Error("Invalid last_name");
    await this.validateRole(role_id);

    // Check if employee exists
    const existingEmployee = await this.getEmployeeById(employee_id);
    if (!existingEmployee) throw new Error("No employee exists with this employee_id");

    // Check if email belongs to another user
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser && existingUser.user_id !== employee_id) {
      throw new Error("User already exists with this email");
    }

    // Update user email if changed
    if (existingEmployee.email !== email) {
      await this.userService.updateUserEmail(employee_id, email);
    }

    

    // Update employee
    const query = `
      UPDATE employees
      SET first_name=$1,last_name=$2,phone=$3,position=$4,role_id=$5,hire_date=$6,
          address=$7,city=$8,country=$9,avatar=$10,emergency_contact=$11,email=$12
      WHERE employee_id=$13
      RETURNING *;
    `;
    const values = [
      first_name, last_name, phone, position, parseInt(role_id), hire_date,
      address, city, country, avatar, emergency_contact ? JSON.stringify(emergency_contact) : null, email,
      employee_id
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  // --- Get Employee ---
  async getEmployeeById(employee_id) {
    const result = await this.db.query(
      `SELECT * FROM employees WHERE employee_id=$1`,
      [employee_id]
    );
    return result.rows[0] || null;
  }

  async getEmployees(page = 1, limit = 10, searchTerm = "", status = "") {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm.trim()}%`;
  
    // Fetch employees with role info
    const employees = await this.db.query(`
      SELECT e.*, r.*
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      WHERE ($1='' OR e.first_name ILIKE $2 OR e.last_name ILIKE $2 OR e.email ILIKE $2 OR e.employee_id ILIKE $2 OR e.position ILIKE $2 OR r.name ILIKE $2)
        AND ($3::text IS NULL OR e.status=$3)
      ORDER BY e.created_at DESC
      LIMIT $4 OFFSET $5
    `, [searchTerm, searchPattern, status || null, limit, offset]);
  
    // Count for pagination
    const countResult = await this.db.query(`
      SELECT COUNT(*) AS total
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      WHERE ($1='' OR e.first_name ILIKE $2 OR e.last_name ILIKE $2 OR e.email ILIKE $2 OR e.employee_id ILIKE $2 OR e.position ILIKE $2 OR r.name ILIKE $2)
        AND ($3::text IS NULL OR e.status=$3)
    `, [searchTerm, searchPattern, status || null]);
  
    const total = parseInt(countResult.rows[0].total, 10);
    return {
      success: true,
      employees: employees.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }
  
}

module.exports = EmployeeService;
