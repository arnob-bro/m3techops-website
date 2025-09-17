import { useState, useEffect } from 'react';
import { FaImage, FaCode, FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import './ManagePortfolio.css';
import PortfolioApi from '../../../apis/portfolioApi';
const portfolioApi = new PortfolioApi();

const ManagePortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    portfolio_item_id: 0,
    title: '',
    category: '',
    description: '',
    image: '',
    problem: '',
    solution: '',
    results: '',
    tech_stack: [''],
    active: true
  });

  useEffect(() => {
    // Set up modal app element for react-modal
    Modal.setAppElement('#root');
    
    // Fetch portfolio items from API
    const fetchPortfolioItems = async () => {
      try {

        const result = await portfolioApi.getPortfolios();
        setPortfolioItems(result.portfolios);
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
      }
    };

    fetchPortfolioItems();
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

  const handleToggleActive = async (portfolio) => {

    const updatedData = {
      ...portfolio,
      active: !portfolio.active
    };

    const result = await portfolioApi.updatePortfolio(portfolio.portfolio_item_id, updatedData);
      const updatedPortfolio = result.updatedPortfolio;
    if(result.success){
      setPortfolioItems(portfolioItems.map(item => 
        item.portfolio_item_id === portfolio.portfolio_item_id ? { ...item, active: !item.active } : item
      ));
    }else{
      alert("Something went wrong. Falied to update the status");
    }
    
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      portfolio_item_id: item.portfolio_item_id,
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      problem: item.problem,
      solution: item.solution,
      results: item.results,
      tech_stack: item.tech_stack || [''],
      active: item.active
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentItem(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      image: '',
      problem: '',
      solution: '',
      results: '',
      tech_stack: [''],
      active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedFormData = {
      ...formData,
      tech_stack: formData.tech_stack.filter(tech => tech.trim() !== '')
    };

    if (currentItem) {

      const result = await portfolioApi.updatePortfolio(cleanedFormData.portfolio_item_id, cleanedFormData);
      const updatedPortfolio = result.updatedPortfolio;
      // Update existing item
      if(result.success){
        // setPortfolioItems(portfolioItems.map(item => 
        //   item.portfolio_item_id === updatedPortfolio.portfolio_item_id ? {...item, ...cleanedFormData } : item
        // ));
        alert("Update successful")
        window.location.reload();
      }else{
        alert("Some error occured");
      }
      
    } else {
      // Add new item
      const result = await portfolioApi.createPortfolio(cleanedFormData);
      const newPortfolio = result.newPortfolio;
      if(result.success){
        setPortfolioItems([...portfolioItems, newPortfolio]);
      }else{
        alert("Some error occured");
      }
      
      
    }
    setIsModalOpen(false);
  };

  return (
    <div className="manage-portfolio">
      <div className="portfolio-header">
        <h2>Manage Portfolio Items</h2>
        <button onClick={openAddModal} className="portfolio-btn-add">
          <FaPlus size={16} />
          Add New Project
        </button>
      </div>

      <div className="portfolio-grid">
        {portfolioItems.map(item => (
          <div key={item.portfolio_item_id} className={`portfolio-card ${item.active ? 'portfolio-active' : 'portfolio-inactive'}`}>
            <div className="portfolio-image-container">
              <img src={item.image} alt={item.title} className="portfolio-image" />
              <div className="portfolio-category-tag">{item.category}</div>
            </div>
            <div className="portfolio-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="portfolio-tech-stack">
                {item.tech_stack.slice(0, 3).map((tech, index) => (
                  <span key={index} className="portfolio-tech-tag">{tech}</span>
                ))}
                {item.tech_stack.length > 3 && (
                  <span className="portfolio-tech-tag">+{item.tech_stack.length - 3} more</span>
                )}
              </div>
            </div>
            <div className="portfolio-actions">
              <button 
                onClick={() => openEditModal(item)} 
                className="portfolio-btn-edit"
                aria-label="Edit project"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => handleToggleActive(item)} 
                className={`portfolio-btn-toggle ${item.active ? 'portfolio-active' : ''}`}
                aria-label={item.active ? 'Deactivate project' : 'Activate project'}
              >
                {item.active ? <FaToggleOn /> : <FaToggleOff />}
                <span>{item.active ? 'Active' : 'Inactive'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="portfolio-modal"
        overlayClassName="portfolio-modal-overlay"
      >
        <div className="portfolio-modal-content">
          <div className="portfolio-modal-header">
            <h3>{currentItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</h3>
          </div>
          
          <div className="portfolio-modal-form-container">
            <form onSubmit={handleSubmit}>
              <div className="portfolio-form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div className="portfolio-form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cloud Solutions">Cloud Solutions</option>
                  <option value="AI Solutions">AI Solutions</option>
                  <option value="Custom Software">Custom Software</option>
                </select>
              </div>
              
              <div className="portfolio-form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  required
                />
                {formData.image && (
                  <div className="portfolio-image-preview">
                    <img src={formData.image} alt="Preview" />
                    <span>Preview</span>
                  </div>
                )}
              </div>
              
              <div className="portfolio-form-group">
                <label>Short Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the project"
                  required
                  rows="3"
                />
              </div>

              <div className="portfolio-form-group">
                <label>The Challenge</label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  placeholder="Describe the problem the client was facing"
                  required
                  rows="3"
                />
              </div>

              <div className="portfolio-form-group">
                <label>Our Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  placeholder="Describe your solution to the problem"
                  required
                  rows="3"
                />
              </div>

              <div className="portfolio-form-group">
                <label>The Results</label>
                <textarea
                  name="results"
                  value={formData.results}
                  onChange={handleInputChange}
                  placeholder="Describe the outcomes and benefits achieved"
                  required
                  rows="3"
                />
              </div>

              <div className="portfolio-form-group">
                <label>Tech Stack</label>
                <div className="portfolio-array-inputs">
                  {formData.tech_stack.map((tech, index) => (
                    <div key={index} className="portfolio-array-input-row">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleArrayInputChange(index, 'tech_stack', e.target.value)}
                        placeholder={`Technology ${index + 1}`}
                        required
                      />
                      <div className="portfolio-array-actions">
                        <button
                          type="button"
                          onClick={() => addArrayItem('tech_stack')}
                          className="portfolio-btn-array-add"
                          aria-label="Add technology"
                        >
                          <FaPlus />
                        </button>
                        {formData.tech_stack.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'tech_stack')}
                            className="portfolio-btn-array-remove"
                            aria-label="Remove technology"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="portfolio-form-group portfolio-checkbox-group">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                <label htmlFor="active">Active (visible to users)</label>
              </div>
              
              <div className="portfolio-modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="portfolio-btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="portfolio-btn-save">
                  {currentItem ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePortfolio;