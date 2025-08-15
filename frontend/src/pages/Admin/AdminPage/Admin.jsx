import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Admin.css';
import { FiMenu, FiX, FiHome, FiSettings, FiFileText, FiBriefcase, FiMail, FiDollarSign, FiCalendar } from 'react-icons/fi';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Extract the active tab from the current URL path
  const activeTab = location.pathname.split('/').pop() || 'dashboard';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard', path: '/admin' },
    { id: 'services', icon: <FiSettings />, label: 'Manage Services', path: '/admin/manage-services' },
    { id: 'portfolio', icon: <FiBriefcase />, label: 'Portfolio Items', path: '/admin/manage-portfolio' },
    { id: 'blog', icon: <FiFileText />, label: 'Blog Posts', path: '/admin/manage-blog' },
    { id: 'messages', icon: <FiMail />, label: 'Contact Messages', path: '/admin/manage-messages' },
    { id: 'payslips', icon: <FiDollarSign />, label: 'Create Pay-slips', path: '/admin/payslips' },
    { id: 'scheduler', icon: <FiCalendar />, label: 'Free Time Scheduler', path: '/admin/scheduler' },
  ];

  return (
    <div className={`admin-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
              >
                <Link to={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="nav-label">{item.label}</span>}
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