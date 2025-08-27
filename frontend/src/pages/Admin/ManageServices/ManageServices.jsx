import { useState, useEffect } from 'react';
import { FaCode, FaMobileAlt, FaCloud, FaRobot, FaServer, FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import './ManageServices.css';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    keyBenefits: [''],
    ourProcess: [''],
    active: true
  });

  useEffect(() => {
    // Set up modal app element for react-modal
    Modal.setAppElement('#root');
    
    // Fetch services from API
    const fetchServices = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockServices = [
          {
            id: 'web-development',
            icon: <FaCode size={24} />,
            title: "Web Development",
            shortDesc: "Custom websites and web applications that drive engagement and conversions.",
            keyBenefits: ["Responsive Design", "SEO Optimized", "Fast Loading Times", "Modern UI/UX"],
            ourProcess: ["Requirements Analysis", "Design & Prototyping", "Development", "Testing & Deployment"],
            active: true
          },
          {
            id: 'mobile-development',
            icon: <FaMobileAlt size={24} />,
            title: "Mobile App Development",
            shortDesc: "Native and cross-platform mobile solutions for iOS and Android.",
            keyBenefits: ["Cross-platform Compatibility", "Native Performance", "App Store Optimization"],
            ourProcess: ["Platform Analysis", "UI/UX Design", "Development", "Testing & Launch"],
            active: true
          },
          {
            id: 'cloud-solutions',
            icon: <FaCloud size={24} />,
            title: "Cloud Solutions",
            shortDesc: "Scalable cloud infrastructure and services for your business.",
            keyBenefits: ["Scalability", "Cost Efficiency", "High Availability"],
            ourProcess: ["Infrastructure Planning", "Migration Strategy", "Implementation", "Monitoring"],
            active: false
          },
          {
            id: 'ai-automation',
            icon: <FaRobot size={24} />,
            title: "AI & Automation",
            shortDesc: "Intelligent automation solutions to streamline your operations.",
            keyBenefits: ["Process Automation", "AI Integration", "Efficiency Gains"],
            ourProcess: ["Process Analysis", "AI Model Development", "Integration", "Training & Support"],
            active: true
          },
          {
            id: 'custom-software',
            icon: <FaServer size={24} />,
            title: "Custom Software",
            shortDesc: "Tailored software solutions designed for your specific business needs.",
            keyBenefits: ["Custom Features", "Scalable Architecture", "Ongoing Support"],
            ourProcess: ["Requirements Gathering", "System Design", "Development", "Deployment & Maintenance"],
            active: true
          }
        ];
        setServices(mockServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
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

  const handleArrayInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleToggleActive = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
    // Here you would also update the service status in your backend
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      shortDesc: service.shortDesc,
      keyBenefits: service.keyBenefits || [''],
      ourProcess: service.ourProcess || [''],
      active: service.active
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentService(null);
    setFormData({
      title: '',
      shortDesc: '',
      keyBenefits: [''],
      ourProcess: [''],
      active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedFormData = {
      ...formData,
      keyBenefits: formData.keyBenefits.filter(benefit => benefit.trim() !== ''),
      ourProcess: formData.ourProcess.filter(process => process.trim() !== '')
    };

    if (currentService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === currentService.id ? { ...service, ...cleanedFormData } : service
      ));
    } else {
      // Add new service
      const newService = {
        id: cleanedFormData.title.toLowerCase().replace(/\s+/g, '-'),
        icon: <FaCode size={24} />, // Default icon, could be selected in form
        ...cleanedFormData
      };
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="manage-services">
      <div className="services-header">
        <h2>Manage Services</h2>
        <button onClick={openAddModal} className="btn-add">
          <FaPlus size={16} />
          Add New Service
        </button>
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className={`service-card ${service.active ? 'active' : 'inactive'}`}>
            <div className="service-icon">{service.icon}</div>
            <div className="service-info">
              <h3>{service.title}</h3>
              <p>{service.shortDesc}</p>
            </div>
            <div className="service-actions">
              <button 
                onClick={() => openEditModal(service)} 
                className="btn-edit"
                aria-label="Edit service"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => handleToggleActive(service.id)} 
                className={`btn-toggle ${service.active ? 'active' : ''}`}
                aria-label={service.active ? 'Deactivate service' : 'Activate service'}
              >
                {service.active ? <FaToggleOn /> : <FaToggleOff />}
                <span>{service.active ? 'Active' : 'Inactive'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="service-modal"
        overlayClassName="service-modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3>{currentService ? 'Edit Service' : 'Add New Service'}</h3>
          </div>
          
          <div className="modal-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter service title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  placeholder="Brief description of the service"
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Key Benefits</label>
                <div className="array-inputs">
                  {formData.keyBenefits.map((benefit, index) => (
                    <div key={index} className="array-input-row">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayInputChange(index, 'keyBenefits', e.target.value)}
                        placeholder={`Benefit ${index + 1}`}
                        required
                      />
                      <div className="array-actions">
                        <button
                          type="button"
                          onClick={() => addArrayItem('keyBenefits')}
                          className="btn-array-add"
                          aria-label="Add benefit"
                        >
                          <FaPlus />
                        </button>
                        {formData.keyBenefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'keyBenefits')}
                            className="btn-array-remove"
                            aria-label="Remove benefit"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Our Process</label>
                <div className="array-inputs">
                  {formData.ourProcess.map((process, index) => (
                    <div key={index} className="array-input-row">
                      <input
                        type="text"
                        value={process}
                        onChange={(e) => handleArrayInputChange(index, 'ourProcess', e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        required
                      />
                      <div className="array-actions">
                        <button
                          type="button"
                          onClick={() => addArrayItem('ourProcess')}
                          className="btn-array-add"
                          aria-label="Add process step"
                        >
                          <FaPlus />
                        </button>
                        {formData.ourProcess.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'ourProcess')}
                            className="btn-array-remove"
                            aria-label="Remove process step"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                <label htmlFor="active">Active (visible to users)</label>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {currentService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageServices;