import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiUsers, FiMail, FiAward, FiTrendingUp, FiHeart, FiClock } from 'react-icons/fi';
import CareerApi from '../../apis/careerApi';
const careerApi = new CareerApi();
import './Career.css';

const Career = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await careerApi.getCareers({
        "page": 1,
        "limit": 10,
        "status": "Open"
      });
      // In a real app, this would be an API call
      // For now, using mock data that matches admin structure
      const mockJobs = [
        {
          job_id: 1,
          title: "Senior Frontend Developer",
          posted_date: "2025-10-15",
          deadline: "2025-11-30",
          vacancies: 2,
          description: "We are looking for an experienced frontend developer with expertise in React and modern web technologies.<br><br><strong>Requirements:</strong><ul><li>5+ years of React experience</li><li>Strong TypeScript skills</li><li>Experience with state management</li></ul>",
          status: "Open"
        },
        {
          job_id: 2,
          title: "UX/UI Designer",
          posted_date: "2025-09-10",
          deadline: "2025-10-15",
          vacancies: 1,
          description: "Creative designer needed to lead our design initiatives and create exceptional user experiences.<br><br><strong>Requirements:</strong><ul><li>3+ years of UI/UX design</li><li>Figma proficiency</li><li>Portfolio required</li></ul>",
          status: "Closed"
        },
        {
          job_id: 3,
          title: "Backend Engineer",
          posted_date: "2025-11-01",
          deadline: "2025-12-15",
          vacancies: 3,
          description: "Join our backend team to build scalable and efficient server-side applications.<br><br><strong>Requirements:</strong><ul><li>Node.js experience</li><li>Database design skills</li><li>API development</li></ul>",
          status: "Open"
        },
        {
          job_id: 5,
          title: "Product Manager",
          posted_date: "2025-10-20",
          deadline: "2025-11-25",
          vacancies: 1,
          description: "Strategic product manager to drive product vision and coordinate cross-functional teams.<br><br><strong>Requirements:</strong><ul><li>5+ years product management</li><li>Agile methodology</li><li>Stakeholder management</li></ul>",
          status: "Open"
        }
      ];

      // Filter only open jobs and check if deadline hasn't passed
      const currentDate = new Date();
      const openJobs = mockJobs.filter(job => {
        if (job.status !== "Open") return false;
        
        const deadlineDate = new Date(job.deadline);
        return deadlineDate >= currentDate;
      });

      setJobs(result.careers);
      // setFilteredJobs(openJobs);
      
    } catch (err) {
      setError('Failed to load job postings. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to safely render HTML description
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  // Extract requirements from HTML description for modal display
  const extractRequirementsFromDescription = (description) => {
    const requirements = [];
    
    // Try to extract list items from the HTML
    const listMatch = description.match(/<ul>(.*?)<\/ul>/s);
    if (listMatch) {
      const listContent = listMatch[1];
      const liMatches = listContent.match(/<li>(.*?)<\/li>/g);
      if (liMatches) {
        liMatches.forEach(li => {
          const text = li.replace(/<li>|<\/li>/g, '').trim();
          if (text) requirements.push(text);
        });
      }
    }
    
    // If no list found, try to extract from the description text
    if (requirements.length === 0) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = description;
      const textContent = tempDiv.textContent || '';
      
      // Look for requirements section in text
      const requirementsIndex = textContent.toLowerCase().indexOf('requirements:');
      if (requirementsIndex !== -1) {
        const requirementsText = textContent.slice(requirementsIndex + 12);
        const lines = requirementsText.split('\n').filter(line => line.trim());
        lines.slice(0, 5).forEach(line => {
          const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
          if (cleanLine) requirements.push(cleanLine);
        });
      }
    }
    
    return requirements.length > 0 ? requirements : [
      "Strong problem-solving skills",
      "Excellent communication abilities",
      "Relevant experience in the field",
      "Passion for innovation and learning"
    ];
  };

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

          {error && (
            <motion.div 
              className="CR-error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

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
          ) : jobs.length > 0 ? (
            <motion.div
              className="CR-jobs-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job.career_id}
                  className="CR-job-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                >
                  <div className="CR-job-header">
                    <h3>{job.title}</h3>
                    {isDeadlinePassed(job.deadline) && (
                      <span className="CR-deadline-expired">Expired</span>
                    )}
                  </div>
                  
                  <div className="CR-job-meta">
                    <div className="CR-meta-item">
                      <FiClock />
                      <span>Posted: {formatDate(job.posted_date)}</span>
                    </div>
                    <div className="CR-meta-item">
                      <FiCalendar />
                      <span>Apply by: {formatDate(job.deadline)}</span>
                    </div>
                    <div className="CR-meta-item">
                      <FiUsers />
                      <span>{job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}</span>
                    </div>
                  </div>

                  <div className="CR-job-description-preview">
                    <div 
                      className="CR-description-text"
                      dangerouslySetInnerHTML={renderHTML(
                        job.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                      )}
                    />
                  </div>

                  <button 
                    className={`CR-see-more-btn ${isDeadlinePassed(job.deadline) ? 'CR-btn-expired' : ''}`}
                    onClick={() => openModal(job)}
                    disabled={isDeadlinePassed(job.deadline)}
                  >
                    {isDeadlinePassed(job.deadline) ? 'Application Closed' : 'See More'}
                    {!isDeadlinePassed(job.deadline) && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !error && (
              <motion.div 
                className="CR-no-jobs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>No Open Positions Available</h3>
                <p>We don't have any open positions at the moment. Please check back later!</p>
              </motion.div>
            )
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
                  ×
                </button>

                <div className="CR-modal-content">
                  <div className="CR-modal-header">
                    <h2>{selectedJob.title}</h2>
                    {isDeadlinePassed(selectedJob.deadline) && (
                      <span className="CR-modal-expired-badge">Application Closed</span>
                    )}
                  </div>
                  
                  <div className="CR-modal-meta">
                    <div className="CR-meta-item">
                      <FiClock />
                      <span>Posted: {formatDate(selectedJob.posted_date)}</span>
                    </div>
                    <div className="CR-meta-item">
                      <FiCalendar />
                      <span>Apply by: {formatDate(selectedJob.deadline)}</span>
                    </div>
                    <div className="CR-meta-item">
                      <FiUsers />
                      <span>{selectedJob.vacancies} {selectedJob.vacancies === 1 ? 'Position Available' : 'Positions Available'}</span>
                    </div>
                  </div>

                  <div className="CR-modal-section">
                    <h3>Job Description</h3>
                    <div 
                      className="CR-modal-description"
                      dangerouslySetInnerHTML={renderHTML(selectedJob.description)}
                    />
                  </div>

                  <div className="CR-modal-section">
                    <h3>How to Apply</h3>
                    <p>Send your CV and cover letter to:</p>
                    <a href="mailto:career@m3techops.com" className="CR-email-link">
                      <FiMail />
                      career@m3techops.com
                    </a>
                    <p className="CR-application-note">
                      Please mention the job title "<strong>{selectedJob.title}</strong>" in your email subject.
                    </p>
                  </div>

                  {isDeadlinePassed(selectedJob.deadline) && (
                    <div className="CR-deadline-notice">
                      <FiClock />
                      <p>The application deadline for this position has passed.</p>
                    </div>
                  )}
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