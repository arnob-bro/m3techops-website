import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';
import { 
  FiMenu, FiX, FiHome, FiSettings, FiFileText, FiBriefcase, 
  FiMail, FiDollarSign, FiCalendar, FiUsers, FiBook, FiPieChart,
  FiChevronDown, FiChevronRight, FiPlusCircle, FiLogOut,FiMessageCircle
} from 'react-icons/fi';
import useUserStore from "../../../stores/userStore";



const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const permissionCodes = useUserStore(state => state.permissionCodes);
  const permissions = useUserStore(state => state.permissions);
  const logout = useUserStore((state) => state.logout);
  

  // Enhanced active tab detection
  const getActiveTab = () => {
    const pathname = location.pathname;
    
    // Handle dashboard route specifically
    if (pathname === '/admin' || pathname === '/admin/') {
      return 'dashboard';
    }
    
    // Handle policy sub-routes
    if (pathname.includes('/admin/policy-management/')) {
      const subPath = pathname.split('/').pop();
      return subPath; // returns 'privacy', 'terms', or 'cookies'
    }
    
    // Handle other routes
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    
    // Map specific routes to navigation items
    const routeMapping = {
      'manage-services': 'services',
      'manage-portfolio': 'portfolio',
      'manage-blog': 'blog',
      'manage-messages': 'messages',
      'pay-slip-generator': 'create-payslip',
      'pay-slip-manager': 'payslip-manager',
      'employee-management': 'employees',
      'newsletter-management': 'newsletter',
      'policy-management': 'policy',
      'scheduler': 'scheduler',
      'testimonials': 'testimonials-management',
      'manage-career': 'career'
    };
    
    return routeMapping[lastSegment] || lastSegment || 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSubmenu = (menuId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  const navItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard', path: '/admin', requiredPermission: 'VIEW_DASHBOARD' },
    { id: 'services', icon: <FiSettings />, label: 'Manage Services', path: '/admin/manage-services', requiredPermission: 'MANAGE_SERVICES' },
    { id: 'portfolio', icon: <FiBriefcase />, label: 'Portfolio Items', path: '/admin/manage-portfolio', requiredPermission: 'MANAGE_PORTFOLIO' },
    { id: 'blog', icon: <FiFileText />, label: 'Blog Posts', path: '/admin/manage-blog', requiredPermission: 'MANAGE_BLOG' },
    { id: 'messages', icon: <FiMail />, label: 'Contact Messages', path: '/admin/manage-messages', requiredPermission: 'MANAGE_MESSAGES' },
    { id: 'create-payslip', icon: <FiPlusCircle />, label: 'Create Pay-slip', path: '/admin/pay-slip-generator', requiredPermission: 'GENERATE_PAYSLIP' },
    { id: 'payslip-manager', icon: <FiDollarSign />, label: 'Pay Slip Manager', path: '/admin/pay-slip-manager', requiredPermission: 'MANAGE_PAYSLIP' },

    { id: 'employees', icon: <FiUsers />, label: 'Employee Management', path: '/admin/employee-management', requiredPermission: 'MANAGE_EMPLOYEES' },
    { id: 'career', icon: <FiBriefcase />, label: 'Career Management', path: '/admin/manage-career', requiredPermission: 'MANAGE_CAREER' },
    { id: 'testimonials', icon: <FiMessageCircle />, label: 'Testimonial Management', path: '/admin/testimonials-management', requiredPermission: 'MANAGE_EMPLOYEES' },

    { id: 'newsletter', icon: <FiBook />, label: 'Newsletter Management', path: '/admin/newsletter-management', requiredPermission: 'MANAGE_NEWSLETTER' },
    { 
      id: 'policy', 
      icon: <FiPieChart />, 
      label: 'Policy Management', 
      path: '/admin/policy-management',
      hasSubmenu: true,
      subItems: [
        { id: 'privacy', label: 'Privacy Policy', path: '/admin/policy-management/privacy', requiredPermission: 'MANAGE_PRIVACY_POLICY' },
        { id: 'terms', label: 'Terms of Services', path: '/admin/policy-management/terms', requiredPermission: 'MANAGE_TERMS_POLICY' },
        { id: 'cookies', label: 'Cookies Policy', path: '/admin/policy-management/cookies', requiredPermission: 'MANAGE_COOKIES_POLICY' }
      ]
    },
    { id: 'scheduler', icon: <FiCalendar />, label: 'Free Time Scheduler', path: '/admin/scheduler', requiredPermission: 'MANAGE_SCHEDULER' },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.hasSubmenu) {
      item.subItems = item.subItems.filter(sub => permissions[permissionCodes.indexOf(sub.requiredPermission)]);
      return item.subItems.length > 0;
    }
    return permissions[permissionCodes.indexOf(item.requiredPermission)];
  });
  
  

  const isPolicySubItemActive = navItems
    .find(item => item.id === 'policy')?.subItems
    ?.some(subItem => activeTab === subItem.id);

  // Enhanced navigation item rendering
  const renderNavItem = (item) => {
    const isActive = activeTab === item.id || 
      (item.id === 'policy' && isPolicySubItemActive) ||
      (item.id === 'dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'));
    
    return (
      <li key={item.id}>
        <div className={`nav-parent ${isActive ? 'active' : ''}`}>
          <Link 
            to={item.path} 
            className="nav-link"
            onClick={(e) => {
              if (item.hasSubmenu) {
                e.preventDefault();
                toggleSubmenu(item.id);
              } else {
                closeSidebar();
              }
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            {(!isMobile || sidebarOpen) && <span className="nav-label">{item.label}</span>}
            {item.hasSubmenu && (!isMobile || sidebarOpen) && (
              <span className="submenu-arrow">
                {openSubmenus[item.id] ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            )}
          </Link>
        </div>
        
        {item.subItems && (!isMobile || sidebarOpen || openSubmenus[item.id]) && (
          <ul className={`sub-nav ${openSubmenus[item.id] ? 'sub-nav-open' : 'sub-nav-closed'}`}>
            {item.subItems.map((subItem) => (
              <li 
                key={subItem.id} 
                className={activeTab === subItem.id ? 'active-sub' : ''}
                onClick={closeSidebar}
              >
                <Link to={subItem.path} className="sub-nav-link">
                  <span className="sub-nav-label">{subItem.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`admin-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile-view' : ''}`}>
      {isMobile && (
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      )}
      
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {filteredNavItems.map(renderNavItem)}
            
            {/* Logout Button */}
            <li className="logout-btn" onClick={handleLogout}>
              <button className="nav-link logout-button">
                <span className="nav-icon"><FiLogOut /></span>
                {(!isMobile || sidebarOpen) && <span className="nav-label">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;