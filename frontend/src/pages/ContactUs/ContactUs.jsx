import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiSend, FiUser, FiBriefcase, FiGlobe } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaRocket } from 'react-icons/fa';
import CountUp from 'react-countup';
import './ContactUs.css';
import ContactApi from '../../apis/contactApi';
const contactApi = new ContactApi();

const ContactUs = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    job_title: '',
    phone: '',
    country: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const response = await contactApi.makeInquiry(formData);
      console.log(response);
      setSubmitStatus('success');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        company: '',
        job_title: '',
        phone: '',
        country: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information
  const contactInfo = {
    address: "77/1, Siddeshwari Road, Anarkali Super Market, 4th floor shop No.26/A, Dhaka 1217",
    phone: "+8801332112077",
    email: "info@m3techops.com",
    encodedAddress: encodeURIComponent("77/1, Siddeshwari Road, Anarkali Super Market, 4th floor shop No.26/A, Dhaka 1217"),
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.598417814126!2d90.39931407485104!3d23.798506478632255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c78f7e3a7%3A0xbd2b8e81b12f8b3e!2sSiddeshwari%20Road%2C%20Dhaka%201217!5e0!3m2!1sen!2sbd!4v1690000000000!5m2!1sen!2sbd"
  };

  return (
    <div className="ContactUs">
      {/* Floating Background Elements */}
      <div className="bg-decoration">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
        <div className="floating-element element-4"></div>
      </div>

      <section className="contact-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-content"
          >
            <div className="hero-badge">
              <span>Let's Connect</span>
            </div>
            <h1>Get in Touch</h1>
            <p>Transform your ideas into reality. We're here to help you build something extraordinary together.</p>
            <div className="hero-stats" ref={statsRef}>
              <motion.div 
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                
                <div className="stat-number">
                  {statsInView && <CountUp end={24} duration={2} suffix="h" />}
                </div>
                <div className="stat-label">Response Time</div>
              </motion.div>

               <motion.div 
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                
                <div className="stat-number">
                  {statsInView && <CountUp end={98} duration={2} suffix="%" />}
                </div>
                <div className="stat-label">Client Satisfaction</div>
              </motion.div>
              
              <motion.div 
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                
                <div className="stat-number">
                  {statsInView && <CountUp end={25} duration={2.5} separator="," suffix="+" />}
                </div>
                <div className="stat-label">Projects Done</div>
              </motion.div>
              
             
            </div>
          </motion.div>
        </div>
      </section>

      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <div className="form-header">
                <div className="form-icon">
                  <FiSend />
                </div>
                <div>
                  <h2>Send us a message</h2>
                  <p>Fill out the form below and we'll get back to you within 24 hours</p>
                </div>
              </div>
              
              {submitStatus === 'success' && (
                <motion.div 
                  className="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="status-icon">✓</div>
                  <div>
                    <strong>Message sent successfully!</strong>
                    <p>Thank you for reaching out. We'll get back to you soon.</p>
                  </div>
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div 
                  className="form-error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="status-icon">✕</div>
                  <div>
                    <strong>Something went wrong</strong>
                    <p>There was an error sending your message. Please try again.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group-cu">
                    <label htmlFor="first_name">
                      <FiUser className="label-icon" />
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-group-cu">
                    <label htmlFor="last_name">
                      <FiUser className="label-icon" />
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-cu">
                  <label htmlFor="email">
                    <FiMail className="label-icon" />
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group-cu">
                    <label htmlFor="company">
                      <FiBriefcase className="label-icon" />
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="form-group-cu">
                    <label htmlFor="job_title">
                      <FiBriefcase className="label-icon" />
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                      placeholder="Product Manager"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-cu">
                    <label htmlFor="phone">
                      <FiPhone className="label-icon" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1332-112077"
                    />
                  </div>
                  <div className="form-group-cu">
                    <label htmlFor="country">
                      <FiGlobe className="label-icon" />
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="BD">Bangladesh</option>
                      <option value="IN">India</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-cu">
                  <label htmlFor="message">
                    <FiMail className="label-icon" />
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, goals, and how we can help..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      Sending your message...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FiSend className="btn-icon" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              <div className="info-header">
                <h2>Let's start a conversation</h2>
                <p>We're here to help and answer any questions you might have. We look forward to hearing from you.</p>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <FiMapPin />
                  </div>
                  <div className="info-content">
                    <h3>Visit Our Office</h3>
                    <p>{contactInfo.address}</p>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${contactInfo.encodedAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="info-link"
                    >
                      Get directions →
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FiPhone />
                  </div>
                  <div className="info-content">
                    <h3>Call Us</h3>
                    <p>{contactInfo.phone}</p>
                    <a href={`tel:${contactInfo.phone}`} className="info-link">
                      Call now →
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FiMail />
                  </div>
                  <div className="info-content">
                    <h3>Email Us</h3>
                    <p>{contactInfo.email}</p>
                    <a href={`mailto:${contactInfo.email}`} className="info-link">
                      Send email →
                    </a>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <div className="map-header">
                  <h3>Find us on the map</h3>
                  <p>Located in Siddeshwari, Dhaka</p>
                </div>
                <div className="map-wrapper">
                  <iframe 
                    title="Office Location"
                    src={contactInfo.mapUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              <div className="social-section">
                <h3>Follow our journey</h3>
                <p>Stay updated with our latest projects and insights</p>
                <div className="social-icons">
                  <a href="#" aria-label="LinkedIn" className="social-link linkedin">
                    <FaLinkedin />
                  </a>
                  <a href="#" aria-label="Twitter" className="social-link twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" aria-label="Facebook" className="social-link facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" aria-label="Instagram" className="social-link instagram">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;