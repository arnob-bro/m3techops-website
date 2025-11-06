import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiUsers, FiX, FiMail, FiAward, FiTrendingUp, FiHeart } from 'react-icons/fi';
import './Career.css';

// Sample job data - replace with API call later
const jobPostings = [
  {
    job_id: 1,
    title: "Senior Full Stack Developer",
    deadline: "2024-12-31",
    vacancies: 2,
    description: "We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.",
    requirements: [
      "5+ years of experience in web development",
      "Strong proficiency in React, Node.js, and MongoDB",
      "Experience with RESTful APIs and microservices",
      "Knowledge of cloud platforms (AWS/Azure)",
      "Excellent problem-solving skills"
    ]
  },
  {
    job_id: 2,
    title: "UI/UX Designer",
    deadline: "2024-12-25",
    vacancies: 1,
    description: "Join our creative team as a UI/UX Designer. You'll be creating beautiful and intuitive interfaces for our clients' digital products.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma, Adobe XD, or Sketch",
      "Strong portfolio showcasing web and mobile designs",
      "Understanding of design systems and component libraries",
      "Excellent communication skills"
    ]
  },
  {
    job_id: 3,
    title: "DevOps Engineer",
    deadline: "2025-01-15",
    vacancies: 1,
    description: "We need a skilled DevOps Engineer to optimize our development pipeline and manage cloud infrastructure.",
    requirements: [
      "4+ years of DevOps experience",
      "Expertise in Docker, Kubernetes, and CI/CD",
      "Experience with AWS or Azure cloud services",
      "Knowledge of infrastructure as code (Terraform/CloudFormation)",
      "Strong scripting skills (Python, Bash)"
    ]
  },
  {
    job_id: 4,
    title: "Mobile App Developer",
    deadline: "2025-01-10",
    vacancies: 2,
    description: "Looking for talented Mobile App Developers to build cutting-edge iOS and Android applications.",
    requirements: [
      "3+ years of mobile development experience",
      "Proficiency in React Native or Flutter",
      "Experience with native iOS/Android development",
      "Knowledge of mobile app deployment processes",
      "Portfolio of published applications"
    ]
  }
];

const Career = () => {
  const [jobs, setJobs] = useState(jobPostings);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const openModal = (job) => {
    setSelectedJob(job);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedJob(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="CR-career-page">
      {/* Hero Section */}
      <section className="CR-career-hero">
        <div className="CR-container">
          <motion.div 
            className="CR-hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Join Our Team</h1>
            <p>Be part of something extraordinary. Build innovative solutions and grow your career with us.</p>
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="CR-why-section">
        <div className="CR-container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Work With Us?
          </motion.h2>
          <div className="CR-benefits-grid">
            <motion.div 
              className="CR-benefit-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="CR-benefit-icon">
                <FiTrendingUp />
              </div>
              <h3>Growth Opportunities</h3>
              <p>Continuous learning and career advancement in a fast-paced environment.</p>
            </motion.div>
            
            <motion.div 
              className="CR-benefit-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="CR-benefit-icon">
                <FiAward />
              </div>
              <h3>Innovative Projects</h3>
              <p>Work on cutting-edge technologies and challenging projects for global clients.</p>
            </motion.div>
            
            <motion.div 
              className="CR-benefit-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="CR-benefit-icon">
                <FiHeart />
              </div>
              <h3>Work-Life Balance</h3>
              <p>Flexible working hours, remote options, and a supportive team culture.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="CR-jobs-main">
        <div className="CR-container">
          <motion.h2 
            className="CR-section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Open Positions
          </motion.h2>

          {isLoading ? (
            <div className="CR-jobs-loading">
              {[...Array(3)].map((_, index) => (
                <motion.div 
                  key={index} 
                  className="CR-job-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                ></motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="CR-jobs-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job.job_id}
                  className="CR-job-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                >
                  <div className="CR-job-header">
                    <h3>{job.title}</h3>
                  </div>
                  
                  <div className="CR-job-meta">
                    <div className="CR-meta-item">
                      <FiCalendar />
                      <span>Apply by: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="CR-meta-item">
                      <FiUsers />
                      <span>{job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}</span>
                    </div>
                  </div>

                  <button 
                    className="CR-see-more-btn"
                    onClick={() => openModal(job)}
                  >
                    See More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              className="CR-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <div className="CR-modal-wrapper">
              <motion.div
                className="CR-modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <button className="CR-modal-close" onClick={closeModal}>
                  𐤕
                </button>

                <div className="CR-modal-content">
                  <h2>{selectedJob.title}</h2>
                  
                  <div className="CR-modal-meta">
                    <div className="CR-meta-item">
                      <FiCalendar />
                      <span>Apply by: {new Date(selectedJob.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="CR-meta-item">
                      <FiUsers />
                      <span>{selectedJob.vacancies} {selectedJob.vacancies === 1 ? 'Position Available' : 'Positions Available'}</span>
                    </div>
                  </div>

                  <div className="CR-modal-section">
                    <h3>Description</h3>
                    <p>{selectedJob.description}</p>
                  </div>

                  <div className="CR-modal-section">
                    <h3>Requirements</h3>
                    <ul className="CR-requirements-list">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="CR-modal-section CR-apply-section">
                    <h3>How to Apply</h3>
                    <p>Send your CV and cover letter to:</p>
                    <a href="mailto:career@m3techops.com" className="CR-email-link">
                      <FiMail />
                      career@m3techops.com
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Career;