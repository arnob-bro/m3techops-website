import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import logo from '../../assets/images/m3logo.png';
import ServiceApi from '../../apis/serviceApi';

const serviceApi = new ServiceApi();

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const [serviceItems, setServiceItems] = useState([]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: null, dropdown: true },
    { name: 'Portfolio', path: '/projects' },
    { name: 'Blogs', path: '/blog' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' }
  ];

  // Function to split services into columns
  const getServiceColumns = () => {
    if (serviceItems.length <= 6) {
      return [serviceItems];
    }
    
    const midPoint = Math.ceil(serviceItems.length / 2);
    return [
      serviceItems.slice(0, midPoint),
      serviceItems.slice(midPoint)
    ];
  };

  const serviceColumns = getServiceColumns();

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
    const fetchServices = async () => {
      try {
        const result = await serviceApi.getServices();
        const allServices = result.services.map(s => ({
          ...s,
          key_benefits: s.key_benefits.map(k => ({ id: crypto.randomUUID(), value: k })),
          our_process: s.our_process.map(p => ({ id: crypto.randomUUID(), value: p }))
        }));
        setServiceItems(allServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

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

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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
          className={`navbar-sidebar ${mobileMenuOpen ? 'active' : ''}`}
          ref={mobileMenuRef}
        >
          <div className="sidebar-content">
            {navLinks.map((link, index) => (
              <div key={index} className="sidebar-link-container">
                {link.dropdown ? (
                  <div 
                    className="sidebar-link-wrapper"
                    ref={dropdownRef}
                  >
                    <div 
                      className={`sidebar-link ${isActiveLink('/services') ? 'active' : ''}`}
                      onClick={toggleServicesDropdown}
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
                          className="sidebar-dropdown"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {serviceItems.map((service, i) => (
                            <Link
                              key={i}
                              to={`/services/${service.service_id}`}
                              className={`sidebar-dropdown-item ${isActiveLink(`/services/${service.service_id}`) ? 'active' : ''}`}
                              onClick={closeAllMenus}
                            >
                              {service.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    to={link.path} 
                    className={`sidebar-link ${isActiveLink(link.path) ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            
            <Link 
              to="/contact" 
              className="sidebar-cta"
              onClick={closeAllMenus}
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="navbar-links">
          {navLinks.map((link, index) => (
            <div key={index} className="navbar-link-container">
              {link.dropdown ? (
                <div 
                  className="navbar-link-container"
                  ref={dropdownRef}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <div 
                    className={`navbar-link dropdown-trigger ${isActiveLink('/services') ? 'active' : ''}`}
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
                        className={`services-dropdown ${serviceColumns.length > 1 ? 'multi-column' : ''}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {serviceColumns.length === 1 ? (
                          // Single column layout
                          serviceColumns[0].map((service, i) => (
                            <Link
                              key={i}
                              to={`/services/${service.service_id}`}
                              className={`dropdown-item ${isActiveLink(`/services/${service.service_id}`) ? 'active' : ''}`}
                              onClick={closeAllMenus}
                            >
                              {service.title}
                            </Link>
                          ))
                        ) : (
                          // Multi-column layout
                          <div className="dropdown-columns">
                            {serviceColumns.map((column, columnIndex) => (
                              <div key={columnIndex} className="dropdown-column">
                                {column.map((service, i) => (
                                  <Link
                                    key={i}
                                    to={`/services/${service.service_id}`}
                                    className={`dropdown-item ${isActiveLink(`/services/${service.service_id}`) ? 'active' : ''}`}
                                    onClick={closeAllMenus}
                                  >
                                    {service.title}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  to={link.path} 
                  className={`navbar-link ${isActiveLink(link.path) ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          
          <Link 
            to="/contact" 
            className={`navbar-cta ${isActiveLink('/contact') ? 'active' : ''}`}
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;