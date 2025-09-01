import { useState, useEffect } from 'react';
import { 
  FiDollarSign, 
  FiUsers, 
  FiFileText, 
  FiCalendar,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPaySlips: 0,
    pendingPaySlips: 0,
    totalPayroll: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [payrollTrend, setPayrollTrend] = useState([]);

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        // Simulated data - replace with actual API calls
        const mockStats = {
          totalEmployees: 24,
          totalPaySlips: 156,
          pendingPaySlips: 8,
          totalPayroll: 1856000
        };
        
        const mockRecentActivity = [
          {
            id: 1,
            action: 'Pay Slip Generated',
            employee: 'John Doe',
            timestamp: '2024-01-15T10:30:00',
            type: 'success'
          },
          {
            id: 2,
            action: 'New Employee Added',
            employee: 'Sarah Johnson',
            timestamp: '2024-01-14T14:22:00',
            type: 'info'
          },
          {
            id: 3,
            action: 'Pay Slip Failed',
            employee: 'Michael Chen',
            timestamp: '2024-01-14T09:45:00',
            type: 'error'
          },
          {
            id: 4,
            action: 'Employee Updated',
            employee: 'Emma Williams',
            timestamp: '2024-01-13T16:10:00',
            type: 'info'
          },
          {
            id: 5,
            action: 'Pay Slip Generated',
            employee: 'David Kim',
            timestamp: '2024-01-13T11:20:00',
            type: 'success'
          }
        ];
        
        const mockPayrollTrend = [
          { month: 'Sep', amount: 1650000, change: 2.5 },
          { month: 'Oct', amount: 1720000, change: 4.2 },
          { month: 'Nov', amount: 1780000, change: 3.5 },
          { month: 'Dec', amount: 1820000, change: 2.2 },
          { month: 'Jan', amount: 1856000, change: 2.0 }
        ];
        
        setStats(mockStats);
        setRecentActivity(mockRecentActivity);
        setPayrollTrend(mockPayrollTrend);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return <div className="activity-icon success">✓</div>;
      case 'error':
        return <div className="activity-icon error">⚠</div>;
      default:
        return <div className="activity-icon info">i</div>;
    }
  };

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

        <div className="DB-stat-card">
          <div className="DB-stat-card">
            <div className="DB-stat-icon payroll">
              <FiDollarSign />
            </div>
            <div className="DB-stat-content">
              <h3>Total Payroll</h3>
              <span className="DB-stat-value">{formatCurrency(stats.totalPayroll)}</span>
              <span className="DB-stat-label">This month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="DB-content-grid">
        {/* Payroll Trend Chart */}
        <div className="DB-card DB-chart-card">
          <div className="DB-card-header">
            <h2>Payroll Trend</h2>
            <span className="DB-card-subtitle">Last 5 months</span>
          </div>
          <div className="DB-chart-content">
            <div className="DB-trend-bars">
              {payrollTrend.map((item, index) => (
                <div key={index} className="DB-trend-item">
                  <div className="DB-trend-bar-container">
                    <div 
                      className="DB-trend-bar" 
                      style={{ height: `${(item.amount / 2000000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="DB-trend-info">
                    <span className="DB-trend-month">{item.month}</span>
                    <span className="DB-trend-amount">{formatCurrency(item.amount)}</span>
                    <div className={`DB-trend-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                      {item.change >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                      {Math.abs(item.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="DB-card DB-activity-card">
          <div className="DB-card-header">
            <h2>Recent Activity</h2>
            <span className="DB-card-subtitle">Latest system events</span>
          </div>
          <div className="DB-activity-content">
            {recentActivity.map(activity => (
              <div key={activity.id} className="DB-activity-item">
                {getActivityIcon(activity.type)}
                <div className="DB-activity-details">
                  <div className="DB-activity-action">{activity.action}</div>
                  <div className="DB-activity-employee">{activity.employee}</div>
                </div>
                <div className="DB-activity-time">
                  {formatDate(activity.timestamp)}
                </div>
              </div>
            ))}
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
            <FiDollarSign />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;