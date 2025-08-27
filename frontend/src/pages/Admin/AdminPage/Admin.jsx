import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Admin.css';
import { FiMenu, FiX, FiHome, FiSettings, FiFileText, FiBriefcase, FiMail, FiDollarSign, FiCalendar } from 'react-icons/fi';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  
  // Extract the active tab from the current URL path
  const activeTab = location.pathname.split('/').pop() || 'dashboard';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when resizing to desktop
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

  const navItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard', path: '/admin' },
    { id: 'services', icon: <FiSettings />, label: 'Manage Services', path: '/admin/manage-services' },
    { id: 'portfolio', icon: <FiBriefcase />, label: 'Portfolio Items', path: '/admin/manage-portfolio' },
    { id: 'blog', icon: <FiFileText />, label: 'Blog Posts', path: '/admin/manage-blog' },
    { id: 'messages', icon: <FiMail />, label: 'Contact Messages', path: '/admin/manage-messages' },
    { id: 'payslips', icon: <FiDollarSign />, label: 'Create Pay-slips', path: '/admin/pay-slip-generator' },
    { id: 'scheduler', icon: <FiCalendar />, label: 'Free Time Scheduler', path: '/admin/scheduler' },
  ];

  return (
    <div className={`admin-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile-view' : ''}`}>
      {/* Mobile menu button */}
      {isMobile && (
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      )}
      
      {/* Sidebar overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
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
              <li 
                key={item.id} 
                className={activeTab === item.id ? 'active' : ''}
                onClick={closeSidebar}
              >
                <Link to={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  {(!isMobile || sidebarOpen) && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;