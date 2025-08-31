import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const location = useLocation();
  
  useEffect(() => {
    document.title = "M3 TECHOPS | Privacy Policy";
    
    // Scroll to top when the component mounts or when location changes
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
    <div className="privacy-container">
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="privacy-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="privacy-hero-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="privacy-hero-title"
              variants={fadeInUp}
            >
              Privacy <span className="accent">Policy</span>
            </motion.h1>
            <motion.p 
              className="privacy-hero-subtitle"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
            >
              Your privacy is important to us. Learn how we protect and manage your data.
            </motion.p>
            <motion.div 
              className="privacy-hero-meta"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <span>Last Updated: January 1, 2024</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="privacy-content">
        <div className="container">
          <motion.div 
            className="privacy-sections"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>1. Introduction</h2>
              <p>
                At M3 TECHOPS, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                or use our services.
              </p>
              <p>
                By accessing our website or using our services, you consent to the practices described in this Privacy Policy. 
                Please read this policy carefully to understand our views and practices regarding your personal data.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              
              <h3>Personal Information</h3>
              <ul>
                <li>Contact information (name, email address, phone number)</li>
                <li>Business information (company name, job title)</li>
                <li>Payment information for service transactions</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3>Technical Information</h3>
              <ul>
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>
              <ul>
                <li>Providing, operating, and maintaining our services</li>
                <li>Improving, personalizing, and expanding our services</li>
                <li>Understanding and analyzing how you use our website</li>
                <li>Developing new products, services, features, and functionality</li>
                <li>Communicating with you for customer service, updates, and marketing</li>
                <li>Processing transactions and sending related information</li>
                <li>Preventing fraud and enhancing security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>4. Data Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              
              <h3>Service Providers</h3>
              <p>
                Third-party vendors who perform services on our behalf (e.g., payment processing, data analysis, 
                email delivery, hosting services, customer service).
              </p>
              
              <h3>Business Transfers</h3>
              <p>
                In connection with any merger, sale of company assets, financing, or acquisition of all or a portion 
                of our business to another company.
              </p>
              
              <h3>Legal Requirements</h3>
              <p>
                When required by law, court order, or governmental authority, or to protect our rights, property, 
                or safety, or that of our users or others.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect the security 
                of any personal information we process. However, please also remember that we cannot guarantee that the 
                internet itself is 100% secure. Although we will do our best to protect your personal information, 
                transmission of personal information to and from our Services is at your own risk.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>6. Your Data Protection Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul>
                <li>The right to access and receive a copy of your personal information</li>
                <li>The right to rectify or update inaccurate personal information</li>
                <li>The right to request erasure of your personal information</li>
                <li>The right to restrict or object to our processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the contact information provided at the end 
                of this Privacy Policy.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain 
                information. The technologies we use may include:
              </p>
              <ul>
                <li><strong>Cookies:</strong> Small data files stored on your device</li>
                <li><strong>Web Beacons:</strong> Electronic files used to track browsing activity</li>
                <li><strong>Log Files:</strong> Track actions occurring on the website</li>
              </ul>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>8. Children's Privacy</h2>
              <p>
                Our website and services are not intended for children under the age of 13. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian and believe 
                that your child has provided us with personal information, please contact us, and we will delete 
                such information from our systems.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
                Policy are effective when they are posted on this page.
              </p>
            </motion.div>

            <motion.div className="privacy-section" variants={fadeInUp}>
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, 
                please contact us at:
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

export default PrivacyPolicy;