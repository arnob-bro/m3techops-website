import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import './CookiePolicy.css';
import PolicyApi from "../../apis/policyApi";

const policyApi = new PolicyApi();

const CookiePolicy = () => {
  const location = useLocation();
  const [policy, setPolicy] = useState({ content: "", updated_at: "" });
  
  useEffect(() => {
    document.title = "M3 TECHOPS | Cookie Policy";
    window.scrollTo(0, 0);

    const fetchPolicy = async () => {
      try {
        const res = await policyApi.getpolicyByType("cookie");
        setPolicy(res);
      } catch (err) {
        console.error("Failed to load policy:", err);
      }
    };
    fetchPolicy();
  }, [location]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <span>Last Updated: {formatDate(policy.updated_at)}</span>
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
              <div className="markdown-body">
                <ReactMarkdown
                  // components={{
                  //   h2: ({ node, ...props }) => <h2 {...props} className="section-title left-align" />,
                  //   h3: ({ node, ...props }) => <h3 {...props} className="section-subtitle left-align" />,
                  //   p: ({ node, ...props }) => <p {...props} className="section-text" />,
                  //   ul: ({ node, ...props }) => <ul {...props} className="section-list" />,
                  //   li: ({ node, ...props }) => <li {...props} className="section-list-item" />,
                  // }}
                >
                  {policy.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;