import { useState, useEffect } from 'react';
import { FaImage, FaCode, FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import './ManagePortfolio.css';

const ManagePortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    problem: '',
    solution: '',
    results: '',
    techStack: [''],
    active: true
  });

  useEffect(() => {
    // Set up modal app element for react-modal
    Modal.setAppElement('#root');
    
    // Fetch portfolio items from API
    const fetchPortfolioItems = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockPortfolioItems = [
          {
            id: '1',
            title: "E-commerce Platform",
            category: "Web Development",
            description: "A high-performance online store with custom checkout flow",
            image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            problem: "Client needed a scalable e-commerce solution to replace their outdated platform that couldn't handle increased traffic.",
            solution: "Built a custom React frontend with Node.js backend and MongoDB database, integrating Stripe for secure payments.",
            techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "Redux"],
            results: "Increased conversion rate by 35%, reduced page load time by 60%, and handled 2x more traffic during peak seasons.",
            active: true
          },
          {
            id: '2',
            title: "Health & Fitness App",
            category: "Mobile Development",
            description: "Personalized workout and nutrition tracking application",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            problem: "Fitness startup needed a cross-platform app to help users track workouts and nutrition with personalized recommendations.",
            solution: "Developed a React Native app with Firebase backend, integrating with health APIs for comprehensive tracking.",
            techStack: ["React Native", "Firebase", "Google Fit API", "Apple HealthKit", "Redux"],
            results: "100,000+ downloads in first 3 months, 4.8/5 app store rating, and 75% user retention after 30 days.",
            active: true
          },
          {
            id: '3',
            title: "Enterprise Dashboard",
            category: "Cloud Solutions",
            description: "Real-time analytics dashboard for business intelligence",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            problem: "Large corporation needed a unified dashboard to visualize data from multiple sources in real-time.",
            solution: "Created a cloud-based solution with AWS services and React frontend with advanced data visualization.",
            techStack: ["AWS Lambda", "React", "D3.js", "Python", "Amazon QuickSight", "GraphQL"],
            results: "Reduced decision-making time by 40%, consolidated 5 separate tools into one platform, saving $250k/year.",
            active: false
          }
        ];
        setPortfolioItems(mockPortfolioItems);
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

  const handleToggleActive = (id) => {
    setPortfolioItems(portfolioItems.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
    // Here you would also update the item status in your backend
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      problem: item.problem,
      solution: item.solution,
      results: item.results,
      techStack: item.techStack || [''],
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
      techStack: [''],
      active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedFormData = {
      ...formData,
      techStack: formData.techStack.filter(tech => tech.trim() !== '')
    };

    if (currentItem) {
      // Update existing item
      setPortfolioItems(portfolioItems.map(item => 
        item.id === currentItem.id ? { ...item, ...cleanedFormData } : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        ...cleanedFormData
      };
      setPortfolioItems([...portfolioItems, newItem]);
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
          <div key={item.id} className={`portfolio-card ${item.active ? 'portfolio-active' : 'portfolio-inactive'}`}>
            <div className="portfolio-image-container">
              <img src={item.image} alt={item.title} className="portfolio-image" />
              <div className="portfolio-category-tag">{item.category}</div>
            </div>
            <div className="portfolio-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="portfolio-tech-stack">
                {item.techStack.slice(0, 3).map((tech, index) => (
                  <span key={index} className="portfolio-tech-tag">{tech}</span>
                ))}
                {item.techStack.length > 3 && (
                  <span className="portfolio-tech-tag">+{item.techStack.length - 3} more</span>
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
                onClick={() => handleToggleActive(item.id)} 
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
                  {formData.techStack.map((tech, index) => (
                    <div key={index} className="portfolio-array-input-row">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleArrayInputChange(index, 'techStack', e.target.value)}
                        placeholder={`Technology ${index + 1}`}
                        required
                      />
                      <div className="portfolio-array-actions">
                        <button
                          type="button"
                          onClick={() => addArrayItem('techStack')}
                          className="portfolio-btn-array-add"
                          aria-label="Add technology"
                        >
                          <FaPlus />
                        </button>
                        {formData.techStack.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'techStack')}
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