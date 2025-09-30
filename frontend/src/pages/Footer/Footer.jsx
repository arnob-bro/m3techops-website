import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FiTwitter, FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  const footerLinks = [
    {
      title: "Services",
      links: [
        { name: "Web Development", path: "/services/web-development" },
        { name: "Mobile Apps", path: "/services/mobile-development" },
        { name: "Cloud Solutions", path: "/services/cloud-solutions" },
        { name: "AI & Automation", path: "/services/ai-automation" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about-us" },
        { name: "Projects", path: "/projects" },
        { name: "Insights", path: "/blog" },
        { name: "Careers", path: "/careers" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact", path: "/contact" },
        { name: "Help Center", path: "/help" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FiTwitter />, url: "https://twitter.com/m3techops", label: "Twitter" },
    { icon: <FiFacebook />, url: "https://facebook.com/m3techops", label: "Facebook" },
    { icon: <FiLinkedin />, url: "https://linkedin.com/company/m3techops", label: "LinkedIn" }
  ];

  return (
    <footer className="footer">
      <div className="footer-gradient-bg"></div>
      <div className="container">
        <div className="footer-content">
          <motion.div 
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="footer-logo">
              <span className="footer-logo-text">M³ TECHOPS</span>
            </Link>
            <p className="footer-tagline">
              Innovating for your digital future with cutting-edge technology solutions that drive real business results.
            </p>
            
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <FiMail className="footer-contact-icon" />
                <a href="mailto:contact@m3techops.com">contact@m3techops.com</a>
              </div>
              <div className="footer-contact-item">
  <FiPhone className="footer-contact-icon" />
  <a href="tel:+8801332112077">+880 1332-112077</a>
</div>
              <div className="footer-contact-item">
                <FiMapPin className="footer-contact-icon" />
                <span>77/1, Siddeshwari Road
Anarkali Super Market
4th floor shop No.26/A
Dhaka 1217</span>
              </div>
            </div>

            <div className="footer-socials">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={social.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {footerLinks.map((column, index) => (
            <motion.div
              key={index}
              className="footer-links-column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              viewport={{ once: true }}
            >
              <h4 className="footer-links-title">{column.title}</h4>
              <ul className="footer-links-list">
                {column.links.map((link, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={link.path} className="footer-link">
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div 
            className="footer-newsletter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="footer-links-title">Stay Updated</h4>
            <p className="footer-newsletter-text">
              Get the latest tech insights and updates delivered to your inbox.
            </p>
            <div className="footer-newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="footer-newsletter-input"
              />
              <button className="footer-newsletter-btn">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {new Date().getFullYear()} M³ TECHOPS. All rights reserved.
            </p>
            <p className="footer-built-text">
              Built with ❤️ using React & modern web technologies
            </p>
          </div>
          
          <div className="footer-bottom-right">
            <Link to="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-legal-link">
              Terms of Service
            </Link>
            <Link to="/cookies" className="footer-legal-link">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;