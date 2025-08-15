import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import logo from '../../assets/images/download.jpeg';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      const isAtTop = window.scrollY < 10;
      
      setScrolled(isScrolled);
      setAtTop(isAtTop);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
      
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.navbar-hamburger')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  const closeAllMenus = () => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const serviceItems = [
    { name: 'Web Development', id: 'web-development' },
    { name: 'Mobile App Development', id: 'mobile-development' },
    { name: 'Cloud Solutions', id: 'cloud-solutions' },
    { name: 'AI & Automation', id: 'ai-automation' },
    { name: 'Custom Software', id: 'custom-software' }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: null, dropdown: true },
    { name: 'Portfolio', path: '/projects' },
    { name: 'Blogs', path: '/blog' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${atTop ? 'navbar-visible' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.6, 0.05, -0.01, 0.9] }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeAllMenus}>
          <img 
            src={logo} 
            alt="M3 TECHOPS Logo" 
            className="navbar-logo-img"
          />
          <span className="navbar-logo-text">TECHOPS</span>
        </Link>

        <div 
          className={`navbar-hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar-hamburger-line"></span>
          <span className="navbar-hamburger-line"></span>
          <span className="navbar-hamburger-line"></span>
        </div>

        <div 
          className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}
          ref={mobileMenuRef}
        >
          {navLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {link.dropdown ? (
                <div 
                  className="navbar-link-container"
                  ref={dropdownRef}
                  onMouseEnter={!mobileMenuOpen ? () => setServicesDropdownOpen(true) : undefined}
                  onMouseLeave={!mobileMenuOpen ? () => setServicesDropdownOpen(false) : undefined}
                >
                  <div 
                    className="navbar-link dropdown-trigger"
                    onClick={() => {
                      if (mobileMenuOpen) {
                        toggleServicesDropdown();
                      } else {
                        setServicesDropdownOpen(true);
                      }
                    }}
                  >
                    {link.name}
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`dropdown-icon ${servicesDropdownOpen ? 'open' : ''}`}
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <AnimatePresence>
                    {servicesDropdownOpen && (
                      <motion.div
                        className={`services-dropdown ${mobileMenuOpen ? 'mobile' : ''}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {serviceItems.map((service, i) => (
                          <Link
                            key={i}
                            to={`/services/${service.id}`}
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeAllMenus();
                            }}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  to={link.path} 
                  className="navbar-link"
                  onClick={closeAllMenus}
                >
                  {link.name}
                </Link>
              )}
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/login" 
              className="navbar-cta"
              onClick={closeAllMenus}
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;