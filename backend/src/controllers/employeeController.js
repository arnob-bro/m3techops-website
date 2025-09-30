class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;

    this.getEmployees = this.getEmployees.bind(this);
    this.getEmployeeById = this.getEmployeeById.bind(this);
    this.createEmployee = this.createEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }

  async getEmployees(req, res) {
    try {
      const { page = 1, limit = 10, searchTerm = "", status = "" } = req.query;
      console.log('Fetching employees with params:', { page, limit, searchTerm, status });
      
      const result = await this.employeeService.getEmployees(
        parseInt(page), 
        parseInt(limit), 
        searchTerm, 
        status
      );
      
      res.json(result);
    } catch (err) {
      console.error('Error in getEmployees:', err);
      res.status(500).json({ 
        success: false,
        error: err.message || "Failed to fetch employees" 
      });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const { employee_id } = req.params;
      console.log('Fetching employee by ID:', employee_id);
      
      const employee = await this.employeeService.getEmployeeById(employee_id);
      if (!employee) {
        return res.status(404).json({ 
          success: false,
          error: "Employee not found" 
        });
      }
      
      res.json({
        success: true,
        employee
      });
    } catch (err) {
      console.error('Error in getEmployeeById:', err);
      res.status(500).json({ 
        success: false,
        error: err.message || "Failed to fetch employee" 
      });
    }
  }

  async createEmployee(req, res) {
    try {
      const {
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact, status = 'active'
      } = req.body;

      console.log('Creating employee with data:', req.body);

      const result = await this.employeeService.createEmployee({
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact, status
      });

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: result.employee,
        initialPassword: result.initialPassword
      });
    } catch (err) {
      console.error('Error in createEmployee:', err);
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async updateEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      const {
        first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact, status
      } = req.body;

      console.log('Updating employee:', employee_id, 'with data:', req.body);

      const updatedEmployee = await this.employeeService.updateEmployee({
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar, emergency_contact, status
      });

      console.log('Employee updated successfully:', updatedEmployee);

      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        employee: updatedEmployee
      });
    } catch (err) {
      console.error('Error in updateEmployee:', err);
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      console.log('Deleting employee:', employee_id);
      
      const deletedEmployee = await this.employeeService.deleteEmployee(employee_id);
      
      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
        employee: deletedEmployee
      });
    } catch (err) {
      console.error('Error in deleteEmployee:', err);
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }
}

module.exports = EmployeeController;