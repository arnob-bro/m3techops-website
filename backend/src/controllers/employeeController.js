class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;

    this.getEmployees = this.getEmployees.bind(this);
    this.getEmployeeById = this.getEmployeeById.bind(this);
    this.createEmployee = this.createEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
  }

  async getEmployees(req, res) {
    try {
      const { page, limit, searchTerm, status } = req.query;
      const employees = await this.employeeService.getEmployees(page, limit, searchTerm, status);
      res.json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const { employee_id } = req.params;
      const employee = await this.employeeService.getEmployeeById(employee_id);
      if (!employee) return res.status(404).json({ error: "Employee not found" });
      res.json(employee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  }

  async createEmployee(req, res) {
    try {
      const {
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact
      } = req.body;

      const result = await this.employeeService.createEmployee({
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact
      });

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: result.employee,
        initialPassword: result.initialPassword // optional
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }

  async updateEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      const {
        first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact
      } = req.body;

      const updatedEmployee = await this.employeeService.updateEmployee({
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact
      });

      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        employee: updatedEmployee
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }
}

module.exports = EmployeeController;
