import { useState, useEffect } from 'react';
import { 
  FaCode, FaMobileAlt, FaCloud, FaRobot, FaServer, 
  FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash,FaGlobe, 
  FaPaintBrush,FaShoppingCart,FaCheckCircle, FaBullhorn, 
  FaBrain, FaLock, FaLaptopCode
} from 'react-icons/fa';
import Modal from 'react-modal';
import './ManageServices.css';
import ServiceApi from '../../../apis/serviceApi';

const serviceApi = new ServiceApi();

// Map icon strings to React Icons
const iconMap = {
  FaCode: <FaCode size={36} />,
  FaMobileAlt: <FaMobileAlt size={36} />,
  FaCloud: <FaCloud size={36} />,
  FaRobot: <FaRobot size={36} />,
  FaServer: <FaServer size={36} />,
  FaGlobe: <FaGlobe size={36} />,
  FaPaintBrush: <FaPaintBrush size={36} />,
  FaShoppingCart: <FaShoppingCart size={36} />,
  FaCheckCircle: <FaCheckCircle size={36} />,
  FaBullhorn: <FaBullhorn size={36} />,
  FaBrain: <FaBrain size={36} />,
  FaLock: <FaLock size={36} />,
  FaLaptopCode: <FaLaptopCode size={36} />
};

// List of available icons for selection
const availableIcons = ['FaCode', 'FaMobileAlt', 'FaCloud', 'FaRobot', 'FaServer'];

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    short_desc: '',
    key_benefits: [{ id: crypto.randomUUID(), value: '' }],
    our_process: [{ id: crypto.randomUUID(), value: '' }],
    active: true,
    icon: 'FaCode'
  });

  // Fetch services
  useEffect(() => {
    Modal.setAppElement('#root');

    const fetchServices = async () => {
      try {
        const result = await serviceApi.getServices();
        const allServices = result.services.map(s => ({
          ...s,
          key_benefits: s.key_benefits.map(k => ({ id: crypto.randomUUID(), value: k })),
          our_process: s.our_process.map(p => ({ id: crypto.randomUUID(), value: p }))
        }));
        setServices(allServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isModalOpen) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [isModalOpen]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map(item => item.id === id ? { ...item, value } : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { id: crypto.randomUUID(), value: '' }]
    }));
  };

  const removeArrayItem = (id, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(item => item.id !== id)
      }));
    }
  };

  // Toggle active
  const handleToggleActive = async (service_id) => {
    const updatedServices = services.map(service =>
      service.service_id === service_id ? { ...service, active: !service.active } : service
    );
    setServices(updatedServices);
  
    try {
      const service = updatedServices.find(s => s.service_id === service_id);
      await serviceApi.updateService(
        service.service_id,
        service.title,
        service.short_desc,
        service.key_benefits.map(k => k.value),
        service.our_process.map(p => p.value),
        service.active,
        service.icon
      );
      alert("Service status updated!");
      window.location.reload(); // reload after status toggle
    } catch (err) {
      console.error('Failed to update active status:', err);
      alert("Failed to update service status.");
    }
  };

  // Open modal for edit
  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      short_desc: service.short_desc,
      key_benefits: service.key_benefits.length > 0 ? service.key_benefits : [{ id: crypto.randomUUID(), value: '' }],
      our_process: service.our_process.length > 0 ? service.our_process : [{ id: crypto.randomUUID(), value: '' }],
      active: service.active,
      icon: service.icon || 'FaCode'
    });
    setIsModalOpen(true);
  };

  // Open modal for add
  const openAddModal = () => {
    setCurrentService(null);
    setFormData({
      title: '',
      short_desc: '',
      key_benefits: [{ id: crypto.randomUUID(), value: '' }],
      our_process: [{ id: crypto.randomUUID(), value: '' }],
      active: true,
      icon: 'FaCode'
    });
    setIsModalOpen(true);
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cleanedData = {
      ...formData,
      key_benefits: formData.key_benefits.map(k => k.value).filter(v => v.trim() !== ''),
      our_process: formData.our_process.map(p => p.value).filter(v => v.trim() !== '')
    };
  
    try {
      if (currentService) {
        await serviceApi.updateService(
          currentService.service_id,
          cleanedData.title,
          cleanedData.short_desc,
          cleanedData.key_benefits,
          cleanedData.our_process,
          cleanedData.active,
          cleanedData.icon
        );
        alert("Service updated successfully!");
      } else {
        await serviceApi.createService(cleanedData);
        alert("Service added successfully!");
      }
  
      setIsModalOpen(false);
      window.location.reload(); // reload after add/edit
  
    } catch (err) {
      console.error('Error saving service:', err);
      alert("Failed to save service.");
    }
  };

  return (
    <div className="manage-services">
      <div className="services-header">
        <h2>Manage Services</h2>
        <button onClick={openAddModal} className="btn-add">
          <FaPlus size={16} /> Add New Service
        </button>
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.service_id} className={`service-card ${service.active ? 'active' : 'inactive'}`}>
            <div className="service-icon">{iconMap[service.icon] || <FaCode size={24} />}</div>
            <div className="service-info">
              <h3>{service.title}</h3>
              <p>{service.short_desc}</p>
            </div>
            <div className="service-actions">
              <button onClick={() => openEditModal(service)} className="btn-edit" aria-label="Edit service">
                <FaEdit />
              </button>
              <button 
                onClick={() => handleToggleActive(service.service_id)} 
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

      {/* Add/Edit Modal */}
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
          <form onSubmit={handleSubmit} className="modal-form-container">

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
                name="short_desc"
                value={formData.short_desc}
                onChange={handleInputChange}
                placeholder="Brief description"
                rows="3"
                required
              />
            </div>

            {/* Icon Selection */}
            <div className="form-group">
              <label>Service Icon</label>
              <div className="icon-selection">
                {availableIcons.map(iconKey => (
                  <button
                    type="button"
                    key={iconKey}
                    className={`icon-btn ${formData.icon === iconKey ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, icon: iconKey})}
                  >
                    {iconMap[iconKey]}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="form-group">
              <label>Key Benefits</label>
              {formData.key_benefits.map((item, index) => (
                <div key={item.id} className="array-input-row">
                  <input
                    type="text"
                    value={item.value}
                    onChange={e => handleArrayInputChange(item.id, 'key_benefits', e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    required
                  />
                  {index === formData.key_benefits.length - 1 && (
                    <button type="button" onClick={() => addArrayItem('key_benefits')}><FaPlus /></button>
                  )}
                  {formData.key_benefits.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(item.id, 'key_benefits')}><FaTrash /></button>
                  )}
                </div>
              ))}
            </div>

            {/* Our Process */}
            <div className="form-group">
              <label>Our Process</label>
              {formData.our_process.map((item, index) => (
                <div key={item.id} className="array-input-row">
                  <input
                    type="text"
                    value={item.value}
                    onChange={e => handleArrayInputChange(item.id, 'our_process', e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    required
                  />
                  {index === formData.our_process.length - 1 && (
                    <button type="button" onClick={() => addArrayItem('our_process')}><FaPlus /></button>
                  )}
                  {formData.our_process.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(item.id, 'our_process')}><FaTrash /></button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={e => setFormData({...formData, active: e.target.checked})}
              />
              <label htmlFor="active">Active (visible to users)</label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-save">{currentService ? 'Save Changes' : 'Add Service'}</button>
            </div>

          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ManageServices;
