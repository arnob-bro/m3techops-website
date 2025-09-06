import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';
import { 
  FiMenu, FiX, FiHome, FiSettings, FiFileText, FiBriefcase, 
  FiMail, FiDollarSign, FiCalendar, FiUsers, FiBook, FiPieChart,
  FiChevronDown, FiChevronRight, FiPlusCircle, FiLogOut
} from 'react-icons/fi';
import useUserStore from "../../../stores/userStore"; // 👈 import your store

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout); // 👈 grab logout function

  // Extract the active tab from the current URL path
  const activeTab = location.pathname.split('/').pop() || 'dashboard';

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
    await logout(); // clear tokens, cookies and user state
    navigate("/admin-login"); // redirect to login page
  };

  const navItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard', path: '/admin' },
    { id: 'services', icon: <FiSettings />, label: 'Manage Services', path: '/admin/manage-services' },
    { id: 'portfolio', icon: <FiBriefcase />, label: 'Portfolio Items', path: '/admin/manage-portfolio' },
    { id: 'blog', icon: <FiFileText />, label: 'Blog Posts', path: '/admin/manage-blog' },
    { id: 'messages', icon: <FiMail />, label: 'Contact Messages', path: '/admin/manage-messages' },
    { id: 'create-payslip', icon: <FiPlusCircle />, label: 'Create Pay-slip', path: '/admin/pay-slip-generator' },
    { id: 'payslip-manager', icon: <FiDollarSign />, label: 'Pay Slip Manager', path: '/admin/pay-slip-manager' },
    { id: 'employees', icon: <FiUsers />, label: 'Employee Management', path: '/admin/employee-management' },
    { id: 'newsletter', icon: <FiBook />, label: 'Newsletter Management', path: '/admin/newsletter-management' },
    { 
      id: 'policy', 
      icon: <FiPieChart />, 
      label: 'Policy Management', 
      path: '/admin/policy-management',
      hasSubmenu: true,
      subItems: [
        { id: 'privacy', label: 'Privacy Policy', path: '/admin/policy-management/privacy' },
        { id: 'terms', label: 'Terms of Services', path: '/admin/policy-management/terms' },
        { id: 'cookies', label: 'Cookies Policy', path: '/admin/policy-management/cookies' }
      ]
    },
    { id: 'scheduler', icon: <FiCalendar />, label: 'Free Time Scheduler', path: '/admin/scheduler' },
  ];

  const isPolicySubItemActive = navItems
    .find(item => item.id === 'policy')?.subItems
    ?.some(subItem => activeTab === subItem.id);

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
            {navItems.map((item) => (
              <li key={item.id}>
                <div 
                  className={`nav-parent ${activeTab === item.id || (item.id === 'policy' && isPolicySubItemActive) ? 'active' : ''}`}
                >
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
            ))}
          </ul>

          {/* 🔴 Logout Button at bottom */}
          <li className="logout-btn" onClick={handleLogout}>
            <button className="nav-link logout-button">
              <span className="nav-icon"><FiLogOut /></span>
              {(!isMobile || sidebarOpen) && <span className="nav-label">Logout</span>}
            </button>
          </li>
        </nav>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
