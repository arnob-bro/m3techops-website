import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import './ServiceDetails.css';

// Icons
import { FaCode, FaMobileAlt, FaCloud, FaRobot, FaServer, FaCheck } from 'react-icons/fa';
import { FiArrowLeft, FiX, FiMail, FiPhone, FiUser, FiBriefcase, FiGlobe, FiMessageSquare } from 'react-icons/fi';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    country: '',
    service: '',
    message: ''
  });

  const services = {
    'web-development': {
      id: 'web-development',
      icon: <FaCode size={50} />,
      title: "Web Development",
      description: "We create stunning, high-performance websites and web applications tailored to your business needs. Our solutions are built with the latest technologies to ensure scalability, security, and exceptional user experiences.",
      benefits: [
        "Responsive design for all devices",
        "SEO optimized for better visibility",
        "Fast loading performance",
        "Secure and scalable architecture",
        "Custom CMS solutions"
      ],
      process: [
        "Requirement Analysis",
        "UI/UX Design",
        "Development",
        "Testing & QA",
        "Deployment & Maintenance"
      ],
      technologies: ["React", "Next.js", "Node.js", "GraphQL", "MongoDB"]
    },
    'mobile-development': {
      id: 'mobile-development',
      icon: <FaMobileAlt size={50} />,
      title: "Mobile App Development",
      description: "We build native and cross-platform mobile applications that deliver seamless user experiences across iOS and Android platforms. Our apps are designed for performance, engagement, and business growth.",
      benefits: [
        "Native and cross-platform solutions",
        "Intuitive user interfaces",
        "Offline functionality",
        "Push notifications",
        "Secure data handling"
      ],
      process: [
        "Concept Development",
        "Prototyping",
        "App Development",
        "Testing & Optimization",
        "App Store Deployment"
      ],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
    },
    'cloud-solutions': {
      id: 'cloud-solutions',
      icon: <FaCloud size={50} />,
      title: "Cloud Solutions",
      description: "Our cloud solutions provide scalable, secure, and cost-effective infrastructure for your business. We help you migrate, optimize, and manage your cloud environment for maximum efficiency.",
      benefits: [
        "Scalable infrastructure",
        "Cost optimization",
        "High availability",
        "Disaster recovery",
        "Automated backups"
      ],
      process: [
        "Cloud Assessment",
        "Migration Planning",
        "Implementation",
        "Optimization",
        "Ongoing Management"
      ],
      technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]
    },
    'ai-automation': {
      id: 'ai-automation',
      icon: <FaRobot size={50} />,
      title: "AI & Automation",
      description: "We implement intelligent automation solutions that streamline your operations, reduce costs, and enhance decision-making through data-driven insights and machine learning.",
      benefits: [
        "Process automation",
        "Predictive analytics",
        "Chatbots & virtual assistants",
        "Data mining & analysis",
        "Custom AI solutions"
      ],
      process: [
        "Problem Identification",
        "Data Collection",
        "Model Training",
        "Implementation",
        "Continuous Learning"
      ],
      technologies: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"]
    },
    'custom-software': {
      id: 'custom-software',
      icon: <FaServer size={50} />,
      title: "Custom Software",
      description: "We develop bespoke software solutions designed specifically for your business requirements, helping you automate processes, improve efficiency, and gain competitive advantage.",
      benefits: [
        "Tailored to your workflow",
        "Integration with existing systems",
        "Improved operational efficiency",
        "Scalable architecture",
        "Ongoing support"
      ],
      process: [
        "Requirement Gathering",
        "System Design",
        "Development",
        "User Acceptance Testing",
        "Deployment & Training"
      ],
      technologies: ["Java", ".NET", "Python", "SQL", "Microservices"]
    }
  };

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "South Korea", "Singapore", "Netherlands", 
    "Sweden", "Norway", "Denmark", "Switzerland", "India", "China", 
    "Brazil", "Mexico", "Spain", "Italy", "Other"
  ];

  useEffect(() => {
    if (services[id]) {
      setService(services[id]);
      setFormData(prev => ({
        ...prev,
        service: services[id].title
      }));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      jobTitle: '',
      phone: '',
      country: '',
      service: service?.title || '',
      message: ''
    });
  };

  if (!service) {
    return (
      <div className="servicedetails-loading">
        <div className="servicedetails-loading-spinner"></div>
        <span>Loading service details...</span>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="servicedetails-page">
      <section className="servicedetails-header">
        <div className="container">
          {/* <Link to="/services" className="servicedetails-back-link">
            <FiArrowLeft /> Back to Services
          </Link> */}

          
          
          <motion.div 
            className="servicedetails-intro"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="servicedetails-icon"
              variants={itemVariants}
            >
              {service.icon}
            </motion.div>
            <motion.h1 variants={itemVariants}>{service.title}</motion.h1>
            <motion.p 
              className="servicedetails-description"
              variants={itemVariants}
            >
              {service.description}
            </motion.p>
            <motion.button 
              className="servicedetails-btn-primary"
              variants={itemVariants}
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Avail Service
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="servicedetails-content">
        <div className="container">
          <div className="servicedetails-content-grid">
            <motion.div 
              className="servicedetails-benefits-section"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2>Key Benefits</h2>
              <ul className="servicedetails-benefits-list">
                {service.benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <FaCheck className="servicedetails-check-icon" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              className="servicedetails-process-section"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>Our Process</h2>
              <div className="servicedetails-process-steps">
                {service.process.map((step, index) => (
                  <motion.div
                    key={index}
                    className="servicedetails-process-step"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="servicedetails-step-number">{index + 1}</div>
                    <div className="servicedetails-step-content">
                      <h4>{step}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="servicedetails-technologies-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>Technologies We Use</h2>
            <div className="servicedetails-tech-tags">
              {service.technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  className="servicedetails-tech-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="servicedetails-modal"
            overlayClassName="servicedetails-modal-overlay"
            closeTimeoutMS={300}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="servicedetails-modal-content"
            >
              <motion.button 
                className="servicedetails-modal-close"
                onClick={() => setIsModalOpen(false)}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={24} />
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2>Get Started with {service.title}</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours</p>
              </motion.div>
              
              <form onSubmit={handleSubmit} className="servicedetails-form">
                <div className="servicedetails-form-row">
                  <motion.div 
                    className="servicedetails-form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="servicedetails-input-icon">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="servicedetails-form-group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <div className="servicedetails-input-icon">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name *"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>
                </div>

                <motion.div 
                  className="servicedetails-form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="servicedetails-input-icon">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>

                <div className="servicedetails-form-row">
                  <motion.div 
                    className="servicedetails-form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <div className="servicedetails-input-icon">
                      <FiBriefcase />
                    </div>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="servicedetails-form-group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="servicedetails-input-icon">
                      <FiBriefcase />
                    </div>
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Job Title"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                </div>

                <div className="servicedetails-form-row">
                  <motion.div 
                    className="servicedetails-form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <div className="servicedetails-input-icon">
                      <FiPhone />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="servicedetails-form-group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="servicedetails-input-icon">
                      <FiGlobe />
                    </div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Country *</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                <motion.div 
                  className="servicedetails-form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <div className="servicedetails-input-icon">
                    <FiBriefcase />
                  </div>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    readOnly
                    style={{ backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)' }}
                  />
                </motion.div>
                
                <motion.div 
                  className="servicedetails-form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="servicedetails-input-icon servicedetails-textarea-icon">
                    <FiMessageSquare />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project needs..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </motion.div>
                
                <motion.button 
                  type="submit" 
                  className="servicedetails-btn-primary servicedetails-form-submit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Request
                </motion.button>
              </form>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal styles
Modal.setAppElement('#root');

export default ServiceDetails;