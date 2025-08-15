import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Services.css';

// Icons
import { FaCode, FaMobileAlt, FaCloud, FaRobot, FaServer } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      id: 'web-development',
      icon: <FaCode size={40} />,
      title: "Web Development",
      shortDesc: "Custom websites and web applications that drive engagement and conversions.",
      bgGradient: "linear-gradient(135deg, rgba(90, 24, 154, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)"
    },
    {
      id: 'mobile-development',
      icon: <FaMobileAlt size={40} />,
      title: "Mobile App Development",
      shortDesc: "Native and cross-platform mobile solutions for iOS and Android.",
      bgGradient: "linear-gradient(135deg, rgba(90, 24, 154, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)"
    },
    {
      id: 'cloud-solutions',
      icon: <FaCloud size={40} />,
      title: "Cloud Solutions",
      shortDesc: "Scalable cloud infrastructure and services for your business.",
      bgGradient: "linear-gradient(135deg, rgba(90, 24, 154, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)"
    },
    {
      id: 'ai-automation',
      icon: <FaRobot size={40} />,
      title: "AI & Automation",
      shortDesc: "Intelligent automation solutions to streamline your operations.",
      bgGradient: "linear-gradient(135deg, rgba(90, 24, 154, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)"
    },
    {
      id: 'custom-software',
      icon: <FaServer size={40} />,
      title: "Custom Software",
      shortDesc: "Tailored software solutions designed for your specific business needs.",
      bgGradient: "linear-gradient(135deg, rgba(90, 24, 154, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our <span className="gradient-text">Services</span></h1>
            <p className="subtitle">
              We deliver cutting-edge digital solutions tailored to your business needs, 
              helping you stay ahead in the competitive digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          <motion.div 
            className="services-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className={`service-card ${hoveredCard === index ? 'hovered' : ''}`}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  background: service.bgGradient,
                  backdropFilter: hoveredCard === index ? 'blur(12px)' : 'blur(8px)'
                }}
              >
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.shortDesc}</p>
                <Link to={`/services/${service.id}`} className="service-link">
                  Learn More <FiArrowRight />
                </Link>
                {hoveredCard === index && (
                  <motion.div 
                    className="hover-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;