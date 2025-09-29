import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiFileText, 
  FiCalendar
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPaySlips: 0,
    pendingPaySlips: 0
  });

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        // Simulated data - replace with actual API calls
        const mockStats = {
          totalEmployees: 24,
          totalPaySlips: 156,
          pendingPaySlips: 8
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="DB-dashboard">
      <div className="DB-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your payroll.</p>
      </div>

      {/* Stats Cards */}
      <div className="DB-stats-grid">
        <div className="DB-stat-card">
          <div className="DB-stat-icon employees">
            <FiUsers />
          </div>
          <div className="DB-stat-content">
            <h3>Total Employees</h3>
            <span className="DB-stat-value">{stats.totalEmployees}</span>
            <span className="DB-stat-label">Active staff members</span>
          </div>
        </div>

        <div className="DB-stat-card">
          <div className="DB-stat-icon payslips">
            <FiFileText />
          </div>
          <div className="DB-stat-content">
            <h3>Pay Slips Generated</h3>
            <span className="DB-stat-value">{stats.totalPaySlips}</span>
            <span className="DB-stat-label">All-time records</span>
          </div>
        </div>

        <div className="DB-stat-card">
          <div className="DB-stat-icon pending">
            <FiCalendar />
          </div>
          <div className="DB-stat-content">
            <h3>Pending Pay Slips</h3>
            <span className="DB-stat-value">{stats.pendingPaySlips}</span>
            <span className="DB-stat-label">Require attention</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="DB-quick-actions">
        <h2>Quick Actions</h2>
        <div className="DB-action-buttons">
          <button className="DB-action-btn primary">
            <FiFileText />
            <span>Generate Pay Slip</span>
          </button>
          <button className="DB-action-btn secondary">
            <FiUsers />
            <span>Add Employee</span>
          </button>
          <button className="DB-action-btn secondary">
            <FiFileText />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;