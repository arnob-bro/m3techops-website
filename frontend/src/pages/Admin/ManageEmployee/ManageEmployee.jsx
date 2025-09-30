import { useState, useEffect } from 'react';
import { 
  FaEdit, FaPlus, FaTrash, FaSearch, 
  FaEnvelope, FaPhone, FaUserShield
} from 'react-icons/fa';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Modal from 'react-modal';
import './ManageEmployee.css';
import EmployeeApi from '../../../apis/employeeApi';
import RoleApi from '../../../apis/roleApi';

const employeeApi = new EmployeeApi();
const roleApi = new RoleApi();

const ManageEmployee = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    employee_id:'',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    role_id: '',
    hire_date: new Date().toISOString().split('T')[0],
    address: '',
    city: '',
    country: '',
    status: 'active',
    avatar: '',
    emergency_contact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getEmployees({
        page: page, 
        limit: 10, 
        searchTerm: searchTerm,
        status: statusFilter 
      });
      const employees = res.employees;
      setEmployees(employees);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchRolesWithPermission = async () => {
    try {
      const res = await roleApi.getAllRolesWithPermissions({});
      const roles = res.data;
      setRoles(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAllPermission = async () => {
    try {
      const res = await roleApi.getAllPermissions({});
      const permissions = res.data;
      setPermissions(permissions);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchEmployees();
    fetchRolesWithPermission();
    fetchAllPermission();
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  const openRoleModal = (role = null) => {
    if (role) {
      setSelectedRole({ ...role });
    } else {
      setSelectedRole({ id: null, name: "", permissions: [] });
    }
    setIsRoleModalOpen(true);
  };

  const togglePermission = (permId) => {
    setSelectedRole((prev) => {
      const hasPerm = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: hasPerm
          ? prev.permissions.filter((id) => id !== permId)
          : [...prev.permissions, permId],
      };
    });
  };

  const handleSaveRole = async () => {
    try {
      if (selectedRole.id) {
        console.log(selectedRole);
        const result = await roleApi.updateRole(selectedRole.id, {
          name: selectedRole.name,
          permissions: selectedRole.permissions || [],
        });
  
        setRoles((prev) =>
          prev.map((r) => (r.id === selectedRole.id ? result.data || result : r))
        );
      } else {
        const result = await roleApi.createRole({
          name: selectedRole.name,
          permissions: selectedRole.permissions || [],
        });
  
        setRoles((prev) => [...prev, result.data || result]);
      }
  
      setIsRoleModalOpen(false);
    } catch (err) {
      console.error("Error saving role:", err);
      alert(err.message || "Failed to save role");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergency_contact: {
        ...prev.emergency_contact,
        [name]: value
      }
    }));
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setError(null);
    setFormData({
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      role_id: employee.role_id,
      hire_date: new Date(employee.hire_date).toISOString().split('T')[0],
      address: employee.address,
      city: employee.city,
      country: employee.country,
      status: employee.status,
      avatar: employee.avatar,
      emergency_contact: {
        name: employee.emergency_contact?.name || '',
        relationship: employee.emergency_contact?.relationship || '',
        phone: employee.emergency_contact?.phone || ''
      }
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentEmployee(null);
    setError(null);
    setFormData({
      employee_id:'',
      first_name: '',  
      last_name: '',
      email: '',
      phone: '',
      position: '',
      role_id: '',
      hire_date: new Date().toISOString().split('T')[0],
      address: '',
      city: '',
      country: '',
      status: 'active',
      avatar: '',
      emergency_contact: {
        name: '',
        relationship: '',
        phone: ''
      }
    });
    setIsModalOpen(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  console.log('Submitting form with status:', formData.status);
  
  try {
    let result;
    if (currentEmployee) {
      console.log('Updating employee with data:', formData);
      result = await employeeApi.updateEmployee(currentEmployee.employee_id, formData);
      
      console.log('Update response:', result);
      
      if (result.success) {
        // Update local state with the returned employee data
        setEmployees(employees.map(employee => 
          employee.employee_id === currentEmployee.employee_id ? 
          result.employee : employee
        ));
      } else {
        throw new Error(result.error || 'Failed to update employee');
      }
    } else {
      console.log('Creating employee with data:', formData);
      result = await employeeApi.createEmployee(formData);
      
      if (result.success) {
        // Add to local state
        setEmployees([...employees, result.employee]);
      } else {
        throw new Error(result.error || 'Failed to create employee');
      }
    }
    
    setIsModalOpen(false);
    
    // Refresh the list to ensure data consistency
    setTimeout(() => {
      fetchEmployees();
    }, 100);
    
  } catch (error) {
    console.error('Error saving employee:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to save employee';
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const deleteEmployee = async (employee_id) => {
    try {
      await employeeApi.deleteEmployee(employee_id);
      setEmployees(employees.filter(employee => employee.employee_id !== employee_id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert(error.message || 'Failed to delete employee');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'on_leave': return 'On Leave';
      case 'terminated': return 'Terminated';
      case 'probation': return 'Probation';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  return (
    <div className="manage-employee">
      <div className="tabs">
        <button
          className={activeTab === "employees" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
        <button
          className={activeTab === "roles" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("roles")}
        >
          Roles
        </button>
      </div>
      
      {activeTab === "employees" && (
        <div>
          <div className="employee-header">
            <h2>Manage Employees</h2>
            <div className="employee-header-actions">
              <div className="employee-search">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
                <FaSearch className="search-icon" />
              </div>
              <div className="employee-filters">
                <select 
                  value={statusFilter} 
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                  <option value="probation">Probation</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button onClick={openAddModal} className="employee-btn-add">
                <FaPlus size={16} />
                Add New Employee
              </button>
            </div>
          </div>

          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Admin Role</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map(employee => (
                    <tr key={employee.employee_id} className={employee.status === 'active' ? '' : 'inactive'}>
                      <td>
                        <div className="employee-info-cell">
                          {employee.avatar && (
                            <img src={employee.avatar} alt={`${employee.first_name} ${employee.last_name}`} className="employee-avatar" />
                          )}
                          <div>
                            <h4>{employee.first_name} {employee.last_name}</h4>
                            <div className="employee-contact">
                              <span className="employee-email">
                                <FaEnvelope size={12} />
                                {employee.email}
                              </span>
                              <span className="employee-phone">
                                <FaPhone size={12} />
                                {employee.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="position-tag">{employee.position}</span>
                      </td>
                      <td>
                        <span className="position-tag">{roles.find(role => role.id === employee.role_id)?.name || "Unknown"}</span>
                      </td>
                      <td>{formatDate(employee.hire_date)}</td>
                      <td>
                        <span className={`status-badge ${employee.status}`}>
                          {getStatusDisplay(employee.status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <FaEdit 
                            onClick={() => openEditModal(employee)} 
                            className="edit-icon"
                            aria-label="Edit employee"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-results">
                    <td colSpan="6">
                      No employees found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
              
                {(() => {
                  const pages = [];
                  const delta = 1;
              
                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 || 
                      i === totalPages || 
                      (i >= page - delta && i <= page + delta)
                    ) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== '...') {
                      pages.push('...');
                    }
                  }
              
                  return pages.map((pageNum, idx) =>
                    pageNum === '...' ? (
                      <span key={idx} className="pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setPage(pageNum)}
                        className={pageNum === page ? 'active' : ''}
                      >
                        {pageNum}
                      </button>
                    )
                  );
                })()}
              
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="employee-modal"
            overlayClassName="employee-modal-overlay"
          >
            <div className="employee-modal-content">
              <div className="employee-modal-header">
                <h3>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="employee-modal-close"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="employee-modal-form-container">
                <form onSubmit={handleSubmit}>
                  <div className="form-section-title">Personal Information {currentEmployee ? `- ${currentEmployee.employee_id}` : ''}</div>
                  
                  <div className="form-row">
                    {!currentEmployee ? (
                      <div className="form-group">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          name="employee_id"
                          value={formData.employee_id}
                          onChange={handleInputChange}
                          placeholder="Enter employee ID"
                          required
                        />
                      </div>
                    ) : null}

                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Avatar URL</label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder="Enter avatar image URL"
                      />
                      {formData.avatar && (
                        <div className="avatar-preview">
                          <img src={formData.avatar} alt="Avatar preview" />
                          <span>Preview</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-section-title">Employment Details</div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Enter position title"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Admin Role</label>
                      <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="on_leave">On Leave</option>
                        <option value="terminated">Terminated</option>
                        <option value="probation">Probation</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Hire Date</label>
                      <input
                        type="date"
                        name="hire_date"
                        value={formData.hire_date}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-section-title">Address Information</div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  <div className="form-section-title">Emergency Contact</div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Contact Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.emergency_contact.name}
                        onChange={handleEmergencyContactChange}
                        placeholder="Enter emergency contact name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        name="relationship"
                        value={formData.emergency_contact.relationship}
                        onChange={handleEmergencyContactChange}
                        placeholder="Enter relationship"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.emergency_contact.phone}
                        onChange={handleEmergencyContactChange}
                        placeholder="Enter emergency contact phone"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                      {error}
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn" disabled={isLoading}>
                      Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={isLoading}>
                      {isLoading ? 'Saving...' : (currentEmployee ? 'Save Changes' : 'Add Employee')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
      )}
      
      {activeTab === "roles" && (
        <div className="role-management">
          <div className='role-management-header'>
            <h2>Manage Roles</h2>
            <button
              className='role-btn-add'
              onClick={() => openRoleModal(null)}
            >
              Add Role
            </button>
          </div>
          
          <div className="role-table-container">
            <table className="role-table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>
                      {role.permissions
                        .map(
                          (pid) =>
                            permissions.find((p) => p.id === pid)?.code || ""
                        )
                        .join(", ")}
                    </td>
                    <td>
                      <FaUserShield
                        onClick={() => openRoleModal(role)}
                        className="view-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isRoleModalOpen}
        onRequestClose={() => setIsRoleModalOpen(false)}
        className="role-modal"
        overlayClassName="employee-modal-overlay"
      >
        {selectedRole && (
          <div className="role-modal-content">
            <h3>
              {selectedRole.id ? `Edit Role: ${selectedRole.name}` : "Add Role"}
            </h3>
            <div className="form-group">
              <label>Role Name</label>
              <input
                type="text"
                value={selectedRole.name}
                onChange={(e) =>
                  setSelectedRole((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter role name"
              />
            </div>
            <div className="permissions-list">
              {permissions.map((perm) => (
                <div key={perm.id} className="permission-item">
                  <input
                    type="checkbox"
                    checked={selectedRole.permissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  />
                  <label>
                    <b>{perm.code}</b> - {perm.description}
                  </label>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleSaveRole} className="save-btn">
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEmployee;