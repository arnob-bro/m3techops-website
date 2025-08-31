import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CookiePolicy.css';

const CookiePolicy = () => {
  const location = useLocation();
  
  useEffect(() => {
    document.title = "M3 TECHOPS | Cookie Policy";
    window.scrollTo(0, 0);
  }, [location]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="cookie-container">
      {/* Hero Section */}
      <section className="cookie-hero">
        <div className="cookie-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="cookie-hero-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="cookie-hero-title"
              variants={fadeInUp}
            >
              Cookie <span className="accent">Policy</span>
            </motion.h1>
            <motion.p 
              className="cookie-hero-subtitle"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
            >
              Learn how we use cookies and similar technologies to enhance your experience.
            </motion.p>
            <motion.div 
              className="cookie-hero-meta"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <span>Last Updated: January 1, 2024</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="cookie-content">
        <div className="container">
          <motion.div 
            className="cookie-sections"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>2. How We Use Cookies</h2>
              <p>We use cookies for several purposes:</p>
              
              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable core functionality 
                such as security, network management, and accessibility.
              </p>
              
              <h3>Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website. We use this information 
                to improve our services and user experience.
              </p>
              
              <h3>Functionality Cookies</h3>
              <p>
                These cookies enable the website to provide enhanced functionality and personalization. 
                They may be set by us or by third-party providers whose services we have added to our pages.
              </p>
              
              <h3>Targeting Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising partners. They may be used by 
                those companies to build a profile of your interests and show you relevant advertisements.
              </p>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>3. Types of Cookies We Use</h2>
              <p>We use the following types of cookies on our website:</p>
              <ul>
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period</li>
                <li><strong>First-Party Cookies:</strong> Cookies set by our website</li>
                <li><strong>Third-Party Cookies:</strong> Cookies set by third-party services integrated with our website</li>
              </ul>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>4. Third-Party Cookies</h2>
              <p>
                We may use various third-party services that also set cookies on your device when you visit our website. 
                These include:
              </p>
              <ul>
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for sharing content</li>
                <li>Advertising networks for relevant advertisements</li>
                <li>Payment processors for transaction processing</li>
              </ul>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>5. Managing Cookies</h2>
              <p>
                You can control and manage cookies in various ways. Please note that removing or blocking cookies 
                may impact your user experience and parts of our website may no longer be fully accessible.
              </p>
              
              <h3>Browser Settings</h3>
              <p>
                Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so 
                vary from browser to browser, and from version to version.
              </p>
              
              <h3>Opt-Out Tools</h3>
              <p>
                You can opt out of certain third-party cookies through various opt-out tools provided by the 
                respective third parties.
              </p>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>6. Your Choices Regarding Cookies</h2>
              <p>
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, 
                please visit the help pages of your web browser.
              </p>
              <p>
                For more information about cookies, including how to see what cookies have been set and how to manage 
                and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
              </p>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>7. Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
                the new Cookie Policy on this page and updating the "Last Updated" date.
              </p>
            </motion.div>

            <motion.div className="cookie-section" variants={fadeInUp}>
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@m3techops.com</p>
                <p><strong>Address:</strong> 123 Tech Street, San Francisco, CA 94103</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;