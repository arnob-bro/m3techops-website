class RoleController {
    constructor(roleService) {
      this.roleService = roleService;
  
      // Bind methods so 'this' works in routes
      this.createRole = this.createRole.bind(this);

    }
  
    async createRole(req, res) {
        try {
            const { name } = req.body;
    
            // Validate required fields
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name is required'
                });
            }
    
            // Validate name is a string
            if (typeof name !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Role name must be a string'
                });
            }
    
            // Validate name length (1-20 characters)
            if (name.length < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name cannot be empty'
                });
            }
    
            if (name.length > 20) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name cannot exceed 20 characters'
                });
            }
    
            
    
            // Trim whitespace from name
            const trimmedName = name.trim();
            
            // Check if trimmed name is not empty after trimming
            if (trimmedName.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name cannot be only whitespace'
                });
            }
    
            // Check if role already exists (using trimmed name)
            const existingRole = await this.roleService.getRoleByName(trimmedName);
            if (existingRole) {
                return res.status(409).json({
                    success: false,
                    message: 'Role with this name already exists'
                });
            }
    
            // Create new role with trimmed name
            const newRole = await this.roleService.createRole({
                name: trimmedName
            });
    
            return res.status(201).json({
                success: true,
                message: 'Role created successfully',
                data: newRole
            });
    
        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }
      
}
  
  module.exports = RoleController;
  