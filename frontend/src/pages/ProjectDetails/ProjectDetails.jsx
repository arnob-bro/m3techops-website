import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  useEffect(() => {
    if (!project) {
      navigate('/projects');
    }
  }, [project, navigate]);

  if (!project) return null;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <motion.div 
      className="project-details"
      initial="hidden"
      animate="show"
      variants={fadeIn}
    >
      <div className="project-details-hero" style={{ backgroundImage: `url(${project.image})` }}>
        <div className="container">
          <motion.div 
            className="hero-content"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.button 
              className="back-button"
              onClick={() => navigate('/projects')}
              variants={item}
              whileHover={{ x: -5 }}
            >
              <FiArrowLeft /> Back to Projects
            </motion.button>
            <motion.h1 variants={item}>{project.title}</motion.h1>
            <motion.p variants={item}>{project.category}</motion.p>
          </motion.div>
        </div>
        <div className="hero-overlay"></div>
      </div>

      <div className="project-details-container">
        <div className="container">
          <motion.div 
            className="project-details-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="project-overview" variants={item}>
              <h2>Project Overview</h2>
              <p>{project.description}</p>
              
              <div className="tech-stack">
                <h3>Tech Stack</h3>
                <div className="tech-tags">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div className="project-case-study" variants={item}>
              <div className="case-study-section">
                <h3>The Challenge</h3>
                <p>{project.problem}</p>
              </div>

              <div className="case-study-section">
                <h3>Our Solution</h3>
                <p>{project.solution}</p>
              </div>

              <div className="case-study-section">
                <h3>The Results</h3>
                <p>{project.results}</p>
              </div>

              <Link 
                to="/contact" 
                className="cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project <FiExternalLink />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;