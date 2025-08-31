import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './TermsOfService.css';

const TermsOfService = () => {
  const location = useLocation();
  
  useEffect(() => {
    document.title = "M3 TECHOPS | Terms of Service";
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
    <div className="terms-container">
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="terms-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="terms-hero-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="terms-hero-title"
              variants={fadeInUp}
            >
              Terms of <span className="accent">Service</span>
            </motion.h1>
            <motion.p 
              className="terms-hero-subtitle"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
            >
              Please read these terms carefully before using our services.
            </motion.p>
            <motion.div 
              className="terms-hero-meta"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <span>Effective Date: January 1, 2024</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="terms-content">
        <div className="container">
          <motion.div 
            className="terms-sections"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using our website and services, you agree to be bound by these Terms of Service. 
                If you disagree with any part of the terms, you may not access our services.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>2. Use of Services</h2>
              <p>You agree to use our services only for lawful purposes and in accordance with these Terms:</p>
              <ul>
                <li>You will not use our services in any way that violates applicable laws</li>
                <li>You will not engage in unauthorized framing or linking to our website</li>
                <li>You will not interfere with or disrupt the services or servers</li>
                <li>You will not attempt to gain unauthorized access to any portion of our services</li>
              </ul>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>3. Intellectual Property Rights</h2>
              <p>
                The content, features, and functionality of our services are owned by M3 TECHOPS and are protected 
                by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not copy, reproduce, distribute, transmit, display, sell, license, or otherwise exploit 
                any content without prior written consent from us.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>4. User Contributions</h2>
              <p>
                Our services may allow you to post, link, store, share, and otherwise make available certain information. 
                You are responsible for the content that you post on or through our services.
              </p>
              <p>
                By posting content, you grant us the right to use, modify, publicly perform, display, reproduce, 
                and distribute such content on and through our services.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>5. Service Management</h2>
              <p>
                We reserve the right to:
              </p>
              <ul>
                <li>Monitor the services for violations of these Terms</li>
                <li>Refuse, restrict, or terminate service to anyone for any reason</li>
                <li>Remove or disable access to any content that we consider objectionable</li>
                <li>Modify or discontinue all or part of our services</li>
              </ul>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>6. Third-Party Websites and Content</h2>
              <p>
                Our services may contain links to third-party websites or services that are not owned or controlled by M3 TECHOPS.
                We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>7. Disclaimer of Warranties</h2>
              <p>
                Our services are provided on an "AS IS" and "AS AVAILABLE" basis. M3 TECHOPS disclaims all warranties 
                of any kind, whether express or implied, including but not limited to implied warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall M3 TECHOPS, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>9. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless M3 TECHOPS and its licensees and licensors from and 
                against any claims, damages, obligations, losses, liabilities, costs or debt, and expenses resulting 
                from your use of our services or violation of these Terms.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                We will provide notice of any changes by posting the new Terms on this page.
              </p>
              <p>
                By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the State of California, 
                United States, without regard to its conflict of law provisions.
              </p>
            </motion.div>

            <motion.div className="terms-section" variants={fadeInUp}>
              <h2>12. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> legal@m3techops.com</p>
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

export default TermsOfService;