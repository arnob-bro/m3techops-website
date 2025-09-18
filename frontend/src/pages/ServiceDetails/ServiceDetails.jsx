import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import './ServiceDetails.css';
import ServiceApi from '../../apis/serviceApi';
import ContactApi from '../../apis/contactApi';
const contactApi = new ContactApi();
const serviceApi = new ServiceApi();

// Icons
import { 
  FaCode, FaMobileAlt, FaCloud, FaRobot, FaServer, 
  FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash,FaGlobe, 
  FaPaintBrush,FaShoppingCart,FaCheckCircle, FaBullhorn, 
  FaBrain, FaLock, FaLaptopCode, FaCheck
} from 'react-icons/fa';
import { FiArrowLeft, FiX, FiMail, FiPhone, FiUser, FiBriefcase, FiGlobe, FiMessageSquare } from 'react-icons/fi';

const ServiceDetails = () => {
  const { service_id } = useParams();
  const [service, setService] = useState({
    service_id: null,
    title: "",
    short_desc: "",
    key_benefits: [],
    our_process: [],
    technologies: [],
    active: true,
    icon: "",
    created_at: "",
    updated_at: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    job_title: '',
    phone: '',
    country: '',
    serviceTitle: '',
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
    }
  };

  const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", 
    "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
    "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", 
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", 
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", 
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", 
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", 
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", 
    "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea",
     "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
     "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
     "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
     "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", 
     "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", 
     "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
      "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
      "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"];


  const fetchService = async () => {
    const result = await serviceApi.getServiceById(service_id);
    if(result.success){
      const fetchedService = result.service;
      setService(fetchedService);
      setFormData(prev => ({
        ...prev,
        serviceTitle: fetchedService.title
      }));
    }
  }

  useEffect(() => {
    // if (services[service_id]) {
    //   setService(services[service_id]);
    //   setFormData(prev => ({
    //     ...prev,
    //     service: services[service_id].title
    //   }));
    // }
    fetchService();
    
  }, [service_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    const response = await contactApi.makeInquiry({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      company: formData.company,
      job_title: formData.job_title,
      phone: formData.phone,
      country: formData.country,
      serviceTitle: formData.serviceTitle,
      message: `This is a message for availing the service-${formData.service}\n`+ formData.message
    });

    setIsModalOpen(false);
    // Reset form
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      company: '',
      job_title: '',
      phone: '',
      country: '',
      serviceTitle: service?.title || '',
      message: ''
    });
  };

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
          <motion.div 
            className="servicedetails-intro"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="service-details-icon-sd"
              variants={itemVariants}
            >
              {iconMap[service.icon]}
            </motion.div>
            <motion.h1 variants={itemVariants}>{service.title}</motion.h1>
            <motion.p 
              className="servicedetails-description"
              variants={itemVariants}
            >
              {service.short_desc}
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
                {service.key_benefits.map((benefit, index) => (
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
                {service.our_process.map((step, index) => (
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

          {service.technologies.length > 0  && (
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
          )}
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
                // whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="close-icon"><FiX/></span>
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
                      name="first_name"
                      placeholder="First Name *"
                      value={formData.first_name}
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
                      name="last_name"
                      placeholder="Last Name *"
                      value={formData.last_name}
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
                      name="job_title"
                      placeholder="Job Title"
                      value={formData.job_title}
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
                    value={formData.serviceTitle}
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