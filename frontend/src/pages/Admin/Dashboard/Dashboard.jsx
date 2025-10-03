import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiFileText, 
  FiCalendar
} from 'react-icons/fi';
import './Dashboard.css';
import EmployeeApi from '../../../apis/employeeApi';
import PayslipApi from '../../../apis/payslipApi';
import ServiceApi from '../../../apis/serviceApi';
const employeeApi = new EmployeeApi();
const payslipApi = new PayslipApi();
const serviceApi = new ServiceApi();

const Dashboard = () => {
  
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayslips: 0,
    totalServices: 0
  });

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        // Simulated data - replace with actual API calls
        

        const employees = await employeeApi.getEmployees();
        const totalEmployees = employees.pagination?.total;
        const payslips = await payslipApi.getPayslips();
        const totalPayslips = payslips.pagination?.total;
        const services = await serviceApi.getServices();
        const totalServices = services.services?.length;

        const Stats = {
          totalEmployees: totalEmployees || 0,
          totalPayslips: totalPayslips || 0,
          totalServices: totalServices || 0
        };
        
        setStats(Stats);
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
            <span className="DB-stat-value">{stats.totalPayslips}</span>
            <span className="DB-stat-label">All-time records</span>
          </div>
        </div>

        <div className="DB-stat-card">
          <div className="DB-stat-icon pending">
            <FiCalendar />
          </div>
          <div className="DB-stat-content">
            <h3>Total Services</h3>
            <span className="DB-stat-value">{stats.totalServices}</span>
            <span className="DB-stat-label">Require attention</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="DB-quick-actions">
        <h2>Quick Actions</h2>
        <div className="DB-action-buttons">
          <button className="DB-action-btn primary"
          onClick={()=> {navigate("/admin/pay-slip-generator")}}
          >
            <FiFileText />
            <span>Generate Pay Slip</span>
          </button>
          <button className="DB-action-btn secondary"
          onClick={()=> {navigate("/admin/employee-management")}}
          >
            <FiUsers />
            <span>See Employees</span>
          </button>
          <button className="DB-action-btn secondary"
          onClick={()=> {navigate("/admin/pay-slip-manager")}}
          >
            <FiFileText />
            <span>See Payslips</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;