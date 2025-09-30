import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Home.css';

import { FiArrowRight, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaCode, FaMobileAlt, FaCloud, FaRobot, 
  FaReact, FaNodeJs, FaAws, FaDatabase, FaPython, 
  FaLaptopCode,  FaRocket, FaSmile, FaUsers, FaGlobe, FaServer, 
  FaEdit, FaToggleOn, FaLock, FaToggleOff, FaPlus, FaBullhorn, FaBrain, FaTrash, FaPaintBrush, FaShoppingCart, FaCheckCircle  } from 'react-icons/fa';

import CountUp from 'react-countup';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/web';
import ServiceApi from "../../apis/serviceApi";
import PortfolioApi from '../../apis/portfolioApi';
const serviceApi = new ServiceApi();
const portfolioApi = new PortfolioApi();

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const fetchedOnce = useRef(false);

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

  const fetchServices = async () => {
    try {
      const result = await serviceApi.getServices();
      const AllServices = result.services;
      setServices(AllServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const result = await portfolioApi.getPortfolios();
      const allPortfolios = result.portfolios;
  
      // Filter only active portfolios
      const activePortfolios = allPortfolios.filter(portfolio => portfolio.active);
  
      setProjects(activePortfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchServices();
      fetchProjects();
      // fetchedOnce.current = true;
    }
  }, []); 

  useEffect(() => {
    document.title = "M3 TECHOPS | Innovative Digital Solutions";
    
    // Scroll to top when navigating from links
    const handleLinkClick = () => {
      window.scrollTo(0, 0);
    };
    
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });
    
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  // const services = [
  //   {
  //     id: 'web-development',
  //     icon: <FaCode size={36} />,
  //     title: "Web Development",
  //     description: "Custom websites and web applications that drive engagement and conversions.",
  //     features: ["Responsive Design", "SEO Optimized", "Fast Performance"]
  //   },
  //   {
  //     id: 'mobile-development',
  //     icon: <FaMobileAlt size={36} />,
  //     title: "Mobile App Development",
  //     description: "Native and cross-platform mobile solutions for iOS and Android.",
  //     features: ["User-Centric Design", "Cross-Platform", "Secure"]
  //   },
  //   {
  //     id: 'cloud-solutions',
  //     icon: <FaCloud size={36} />,
  //     title: "Cloud Solutions",
  //     description: "Scalable cloud infrastructure and services for your business.",
  //     features: ["AWS/Azure/GCP", "Cost Optimized", "High Availability"]
  //   },
  //   {
  //     id: 'custom-software',
  //     icon: <FaLaptopCode size={36} />,
  //     title: "Custom Software",
  //     description: "Tailored software solutions designed for your specific business needs.",
  //     features: ["Bespoke Development", "Process Automation", "System Integration"]
  //   },
  //   {
  //     id: 'ai-automation',
  //     icon: <FaRobot size={36} />,
  //     title: "AI & Automation",
  //     description: "Intelligent automation solutions to streamline your operations.",
  //     features: ["Machine Learning", "Process Automation", "Data Analysis"]
  //   },
  // ];

  // const projects = [
  //   {
  //     title: "E-commerce Platform",
  //     category: "Web Development",
  //     description: "A high-performance online store with custom checkout flow",
  //     image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  //   },
  //   {
  //     title: "Health & Fitness App",
  //     category: "Mobile Development",
  //     description: "Personalized workout and nutrition tracking application",
  //     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  //   },
  //   {
  //     title: "Enterprise Dashboard",
  //     category: "Cloud Solutions",
  //     description: "Real-time analytics dashboard for business intelligence",
  //     image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  //   },
  //   {
  //     title: "AI Chatbot",
  //     category: "AI Solutions",
  //     description: "Conversational AI assistant for customer support",
  //     image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  //   }
  // ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content: "M3 TECHOPS transformed our digital presence with their cutting-edge solutions.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO, InnovateX",
      content: "The mobile app they developed has been a game-changer for our business.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "David Rodriguez",
      role: "Director, Global Solutions",
      content: "Their cloud migration strategy saved us thousands in infrastructure costs.",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      name: "Emily Wilson",
      role: "Product Manager, NexTech",
      content: "The custom software solution perfectly fits our workflow needs.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      name: "James Peterson",
      role: "COO, DataSystems",
      content: "Their AI implementation increased our operational efficiency by 40%.",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg"
    }
  ];

  // Auto carousel state
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, [projects.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 70,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: 0.3
      }
    }
  };

  const techVisualVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      rotate: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scrollTestimonials = (direction) => {
    const container = document.querySelector('.testimonials-carousel');
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Enhanced service card animation
  const serviceCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -15,
      scale: 1.03,
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const scrollToServices = (e) => {
  e.preventDefault();
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Statistics card animation variants
const statCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 100,
    scale: 0.8,
    rotate: -5
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  },
  hover: {
    y: -20,
    scale: 1.05,
    rotate: 2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};


useEffect(() => {
  // Add mousemove effect for the gradient follow
  const statCards = document.querySelectorAll('.stat-card');
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };
  
  statCards.forEach(card => {
    card.addEventListener('mousemove', handleMouseMove);
  });
  
  return () => {
    statCards.forEach(card => {
      card.removeEventListener('mousemove', handleMouseMove);
    });
  };
}, []);


 const [statsInView, setStatsInView] = useState(false);

  return (
    <div className="home-container">
      {/* Hero Section - Unchanged */}
      <section className="home-hero">
        
        <div className="home-hero-bg"></div>

        <div className="container">
          <div className="home-hero-content">
            <motion.div
              className="home-hero-text"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1
                className="home-hero-title"
                variants={titleVariants}
              >
                Transform Your <span className="accent">Digital Presence</span>
              </motion.h1>
             
              <motion.p
                className="home-hero-subtitle"
                variants={itemVariants}
              >
                We craft premium digital experiences that drive results and elevate brands with cutting-edge technology solutions.
              </motion.p>
             
              <motion.div
                className="home-hero-cta-container"
                variants={itemVariants}
              >
                <Link to="/contact" className="btn btn-primary">
                  Get Started <FiArrowRight />
                </Link>
                <Link to="/projects" className="btn btn-outline">
                  View Our Work
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="home-hero-animation"
              initial="hidden"
              animate="visible"
              variants={techVisualVariants}
            >
              <div className="hero-tech-visual">
                <div className="tech-orbit tech-orbit-1">
                  <motion.div
                    className="tech-icon tech-icon-1"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaReact />
                  </motion.div>
                  <motion.div
                    className="tech-icon tech-icon-2"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaNodeJs />
                  </motion.div>
                  <motion.div
                    className="tech-icon tech-icon-3"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaAws />
                  </motion.div>
                  <motion.div
                    className="tech-icon tech-icon-4"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaDatabase />
                  </motion.div>
                </div>
               
                <div className="tech-orbit tech-orbit-2">
                  <motion.div
                    className="tech-icon tech-icon-5"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaCode />
                  </motion.div>
                  <motion.div
                    className="tech-icon tech-icon-6"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaMobileAlt />
                  </motion.div>
                  <motion.div
                    className="tech-icon tech-icon-9"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaPython />
                  </motion.div>
                </div>
               
                <div className="tech-orbit tech-orbit-3">
                  <motion.div
                    className="tech-icon tech-icon-7"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaCloud />
                  </motion.div>
                  <motion.div
                    className="tech-icon tech-icon-8"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    <FaRobot />
                  </motion.div>
                </div>

                <motion.div
                  className="tech-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 8px 25px rgba(var(--color-accent-rgb), 0.4)",
                      "0 12px 35px rgba(var(--color-accent-rgb), 0.6)",
                      "0 8px 25px rgba(var(--color-accent-rgb), 0.4)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  M<span style={{ fontSize: '0.6em', verticalAlign: 'super' }}>3</span>
                </motion.div>

                <div className="floating-particles">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`particle particle-${i + 1}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        y: [0, -50, -100],
                        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.3
                      }}
                    ></motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section with Enhanced Animations */}
      <section className="home-services" id="services">
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="accent">Our Expertise</span>
            </motion.h2>
            <motion.p
              className="section-subtitle-h"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Premium solutions tailored to your business needs
            </motion.p>
          </div>
         
          <div className="home-services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="home-service-card"
                initial="hidden"
                whileInView="visible"
                variants={serviceCardVariants}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover="hover"
              >
                <motion.div
                  className="home-service-icon"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  {iconMap[service.icon]}
                </motion.div>
                <h3 className="home-service-title">{service.title}</h3>
                <p className="home-service-description">{service.short_desc}</p>
                <ul className="home-service-features">
                  {service.key_benefits.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="home-service-feature"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FiCheck className="feature-icon" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <Link to={`/services/${service.service_id}`} className="home-service-link"
                onClick={() => window.scrollTo(0, 0)} >

                  Learn More 
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section with Auto Carousel */}
      <section className="home-projects" id="projects">
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="accent">Featured Projects</span>
            </motion.h2>
            <motion.p
              className="section-subtitle-h"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Showcasing our latest work and success stories
            </motion.p>
          </div>
         
          <div className="projects-carousel-container">
            <div className="projects-carousel">
              {[...projects, ...projects].map((project, index) => (
                <motion.div
                  key={index}
                  className="project-slide"
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                    <div className="project-info">
                      <span className="project-category">{project.category}</span>
                      <h3 className="project-title">{project.title}</h3>
                    </div>
                  </div>
                  <div className="project-overlay">
                    <div className="project-content">
                      <span className="project-category">{project.category}</span>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      <Link to="/projects" className="project-link"
                      onClick={() => window.scrollTo(0, 0)} >
                        View Project 
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Carousel Dots */}
            <div className="carousel-dots">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentProjectIndex ? 'active' : ''}`}
                  onClick={() => setCurrentProjectIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Mobile Optimization */}
      <section className="home-testimonials">
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="accent">What Our Clients Say</span>
            </motion.h2>
            <motion.p
              className="section-subtitle-h"
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Real feedback from businesses we've helped grow
            </motion.p>
          </div>
         
          <div className="testimonials-container">
            <motion.button
              className="testimonial-nav-btn testimonial-nav-prev"
              onClick={() => scrollTestimonials('left')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronLeft size={24} />
            </motion.button>
           
            <div className="testimonials-carousel">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="testimonial-card"
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25)"
                  }}
                >
                  <div className="testimonial-content">
                    <p className="testimonial-text">{testimonial.content}</p>
                  </div>
                  <div className="testimonial-author">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="testimonial-avatar"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="testimonial-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
           
            <motion.button
              className="testimonial-nav-btn testimonial-nav-next"
              onClick={() => scrollTestimonials('right')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </section>



          {/* Statistics Section */}
<section className="home-statistics" id="statistics">
  <div className="section-header">
    <motion.h2
      className="section-title"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true, margin: "-100px" }}
    >
      <span className="accent">Our Impact</span>
    </motion.h2>
    <motion.p
      className="section-subtitle-h"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      transition={{ delay: 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      Driving digital transformation through innovation and excellence
    </motion.p>
  </div>
  
  <motion.div 
    className="stats-grid"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    onViewportEnter={() => setStatsInView(true)}
  >
    <motion.div 
      className="stat-card"
      variants={statCardVariants}
      whileHover="hover"
    >
      <div className="stat-icon">
        <FaRocket size={30} />
      </div>
      <div className="stat-number">
        {statsInView && <CountUp end={25} duration={3} separator="," suffix="+" />}
      </div>
      <div className="stat-label">Projects Completed</div>
    </motion.div>
    
    <motion.div 
      className="stat-card"
      variants={statCardVariants}
      transition={{ delay: 0.1 }}
      whileHover="hover"
    >
      <div className="stat-icon">
        <FaSmile size={30} />
      </div>
      <div className="stat-number">
        {statsInView && <CountUp end={98} duration={3} suffix="%" />}
      </div>
      <div className="stat-label">Client Satisfaction</div>
    </motion.div>
    
    <motion.div 
      className="stat-card"
      variants={statCardVariants}
      transition={{ delay: 0.2 }}
      whileHover="hover"
    >
      <div className="stat-icon">
        <FaUsers size={30} />
      </div>
      <div className="stat-number">
        {statsInView && <CountUp end={10} duration={3} separator="," suffix="+" />}
      </div>
      <div className="stat-label">Team Members</div>
    </motion.div>
  </motion.div>
</section>



      {/* CTA Section */}
      <section className="home-cta">
        <div className="container">
          <motion.div
            className="home-cta-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <div className="home-cta-content">
              <h2 className="home-cta-title">Ready to Get Started?</h2>
              <p className="home-cta-text">
                Let's discuss how we can help transform your business with innovative digital solutions.
              </p>
              <div className="home-cta-buttons">
                <Link to="/contact" className="btn btn-primary">
                  Start Your Project
                </Link>
                <button onClick={scrollToServices} className="btn btn-outline">
                  Explore Services
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;