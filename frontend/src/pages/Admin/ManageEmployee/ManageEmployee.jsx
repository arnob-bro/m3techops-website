import { useState, useEffect } from 'react';
import { 
  FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaSearch, 
  FaEnvelope, FaPhone, FaBuilding, FaUserTag, FaMapMarkerAlt 
} from 'react-icons/fa';
import Modal from 'react-modal';
import './ManageEmployee.css';

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: 'Engineering',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
    address: '',
    city: '',
    country: '',
    status: 'active',
    avatar: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  useEffect(() => {
    // Set up modal app element for react-modal
    Modal.setAppElement('#root');
    
    // Fetch employees from API
    const fetchEmployees = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockEmployees = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1 (555) 123-4567',
            position: 'Senior Developer',
            department: 'Engineering',
            salary: 85000,
            hireDate: '2022-03-15',
            address: '123 Main St',
            city: 'San Francisco',
            country: 'USA',
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            emergencyContact: {
              name: 'Jane Doe',
              relationship: 'Spouse',
              phone: '+1 (555) 987-6543'
            }
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@company.com',
            phone: '+1 (555) 234-5678',
            position: 'Product Manager',
            department: 'Product',
            salary: 95000,
            hireDate: '2021-08-22',
            address: '456 Oak Ave',
            city: 'New York',
            country: 'USA',
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            emergencyContact: {
              name: 'Mike Johnson',
              relationship: 'Spouse',
              phone: '+1 (555) 876-5432'
            }
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@company.com',
            phone: '+1 (555) 345-6789',
            position: 'UX Designer',
            department: 'Design',
            salary: 75000,
            hireDate: '2023-01-10',
            address: '789 Pine Rd',
            city: 'Austin',
            country: 'USA',
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            emergencyContact: {
              name: 'Lisa Chen',
              relationship: 'Spouse',
              phone: '+1 (555) 765-4321'
            }
          },
          {
            id: '4',
            firstName: 'Emma',
            lastName: 'Williams',
            email: 'emma.w@company.com',
            phone: '+1 (555) 456-7890',
            position: 'HR Specialist',
            department: 'HR',
            salary: 65000,
            hireDate: '2020-11-05',
            address: '321 Elm St',
            city: 'Chicago',
            country: 'USA',
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            emergencyContact: {
              name: 'David Williams',
              relationship: 'Spouse',
              phone: '+1 (555) 654-3210'
            }
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Kim',
            email: 'david.kim@company.com',
            phone: '+1 (555) 567-8901',
            position: 'DevOps Engineer',
            department: 'Engineering',
            salary: 90000,
            hireDate: '2022-06-30',
            address: '654 Maple Dr',
            city: 'Seattle',
            country: 'USA',
            status: 'inactive',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            emergencyContact: {
              name: 'Sophia Kim',
              relationship: 'Spouse',
              phone: '+1 (555) 543-2109'
            }
          }
        ];
        setEmployees(mockEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle modal open/close body scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

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
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleToggleStatus = (id) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { 
        ...employee, 
        status: employee.status === 'active' ? 'inactive' : 'active' 
      } : employee
    ));
    // Here you would also update the employee status in your backend
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      hireDate: employee.hireDate,
      address: employee.address,
      city: employee.city,
      country: employee.country,
      status: employee.status,
      avatar: employee.avatar,
      emergencyContact: {
        name: employee.emergencyContact.name,
        relationship: employee.emergencyContact.relationship,
        phone: employee.emergencyContact.phone
      }
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: 'Engineering',
      salary: '',
      hireDate: new Date().toISOString().split('T')[0],
      address: '',
      city: '',
      country: '',
      status: 'active',
      avatar: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentEmployee) {
      // Update existing employee
      setEmployees(employees.map(employee => 
        employee.id === currentEmployee.id ? { ...employee, ...formData } : employee
      ));
    } else {
      // Add new employee
      const newEmployee = {
        id: Date.now().toString(),
        ...formData
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsModalOpen(false);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    // Here you would also delete the employee from your backend
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="manage-employee">
      <div className="employee-header">
        <h2>Manage Employees</h2>
        <div className="employee-header-actions">
          <div className="employee-search">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="employee-filters">
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
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
              <th>Department</th>
              <th>Salary</th>
              <th>Hire Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(employee => (
                <tr key={employee.id} className={employee.status === 'active' ? '' : 'inactive'}>
                  <td>
                    <div className="employee-info-cell">
                      {employee.avatar && (
                        <img src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} className="employee-avatar" />
                      )}
                      <div>
                        <h4>{employee.firstName} {employee.lastName}</h4>
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
                    <span className="department-badge">{employee.department}</span>
                  </td>
                  <td>
                    <span className="salary-amount">{formatCurrency(employee.salary)}</span>
                  </td>
                  <td>{formatDate(employee.hireDate)}</td>
                  <td>
                    <button 
                      onClick={() => handleToggleStatus(employee.id)} 
                      className={`status-btn ${employee.status === 'active' ? 'active' : 'inactive'}`}
                    >
                      {employee.status === 'active' ? (
                        <>
                          <FaToggleOn /> Active
                        </>
                      ) : (
                        <>
                          <FaToggleOff /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                 <td>
  <div className="action-buttons">
    <FaEdit 
      onClick={() => openEditModal(employee)} 
      className="edit-icon"
      aria-label="Edit employee"
    />
    <FaTrash 
      onClick={() => deleteEmployee(employee.id)} 
      className="delete-icon"
      aria-label="Delete employee"
    />
  </div>
</td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="7">
                  No employees found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
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
              <div className="form-section-title">Personal Information</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
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
                
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter annual salary"
                    required
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    required
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
                    value={formData.emergencyContact.name}
                    onChange={handleEmergencyContactChange}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.emergencyContact.relationship}
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
                    value={formData.emergencyContact.phone}
                    onChange={handleEmergencyContactChange}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>

              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'active' : 'inactive'})}
                />
                <label htmlFor="status">Active Employee</label>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {currentEmployee ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageEmployee;