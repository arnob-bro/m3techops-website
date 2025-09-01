import { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import './ManagePaySlip.css';

const ManagePaySlip = () => {
  const [paySlips, setPaySlips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedPaySlip, setSelectedPaySlip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch pay slips from API
    const fetchPaySlips = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockPaySlips = [
          {
            id: 'PS001',
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            reference: 'REF202401',
            payDate: '2024-01-15',
            paymentMonth: 'January 2024',
            status: 'paid',
            amount: 85000,
            earnings: 90000,
            deductions: 5000,
            paymentMode: 'Bank Transfer',
            bankName: 'City Bank',
            accountNumber: 'XXXX-XXXX-1234',
            authorizedBy: 'Sumaiya Ahmed'
          },
          {
            id: 'PS002',
            employeeId: 'EMP002',
            employeeName: 'Sarah Johnson',
            reference: 'REF202401',
            payDate: '2024-01-15',
            paymentMonth: 'January 2024',
            status: 'paid',
            amount: 95000,
            earnings: 100000,
            deductions: 5000,
            paymentMode: 'Bkash',
            bkashNumber: 'XXXX-XXXX-5678',
            authorizedBy: 'Sumaiya Ahmed'
          },
          {
            id: 'PS003',
            employeeId: 'EMP003',
            employeeName: 'Michael Chen',
            reference: 'REF202401',
            payDate: '2024-01-15',
            paymentMonth: 'January 2024',
            status: 'pending',
            amount: 75000,
            earnings: 80000,
            deductions: 5000,
            paymentMode: 'Cash',
            authorizedBy: 'Sumaiya Ahmed'
          },
          {
            id: 'PS004',
            employeeId: 'EMP004',
            employeeName: 'Emma Williams',
            reference: 'REF202312',
            payDate: '2023-12-15',
            paymentMonth: 'December 2023',
            status: 'paid',
            amount: 65000,
            earnings: 70000,
            deductions: 5000,
            paymentMode: 'Bank Transfer',
            bankName: 'Eastern Bank',
            accountNumber: 'XXXX-XXXX-9012',
            authorizedBy: 'Sumaiya Ahmed'
          },
          {
            id: 'PS005',
            employeeId: 'EMP005',
            employeeName: 'David Kim',
            reference: 'REF202312',
            payDate: '2023-12-15',
            paymentMonth: 'December 2023',
            status: 'failed',
            amount: 90000,
            earnings: 95000,
            deductions: 5000,
            paymentMode: 'Bank Transfer',
            bankName: 'DBBL',
            accountNumber: 'XXXX-XXXX-3456',
            authorizedBy: 'Sumaiya Ahmed'
          }
        ];
        setPaySlips(mockPaySlips);
      } catch (error) {
        console.error('Error fetching pay slips:', error);
      }
    };

    fetchPaySlips();
  }, []);

  const filteredPaySlips = paySlips.filter(paySlip => {
    const matchesSearch = 
      paySlip.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paySlip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paySlip.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || paySlip.status === statusFilter;
    const matchesDate = !dateFilter || paySlip.payDate === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      paid: 'MPS-status-paid',
      pending: 'MPS-status-pending',
      failed: 'MPS-status-failed'
    };
    
    const statusLabels = {
      paid: 'Paid',
      pending: 'Pending',
      failed: 'Failed'
    };
    
    return (
      <span className={`MPS-status-badge ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const handleView = (paySlip) => {
    setSelectedPaySlip(paySlip);
    setIsModalOpen(true);
  };

  const handleDownload = (paySlip) => {
    // Create a PDF download
    const pdfContent = `
      PAY SLIP - ${paySlip.paymentMonth}
      ==================================
      Employee: ${paySlip.employeeName} (${paySlip.employeeId})
      Reference: ${paySlip.reference}
      Pay Date: ${formatDate(paySlip.payDate)}
      ----------------------------------
      Earnings: ${formatCurrency(paySlip.earnings)}
      Deductions: ${formatCurrency(paySlip.deductions)}
      Net Pay: ${formatCurrency(paySlip.amount)}
      ----------------------------------
      Payment Mode: ${paySlip.paymentMode}
      ${paySlip.bankName ? `Bank: ${paySlip.bankName}` : ''}
      ${paySlip.accountNumber ? `Account: ${paySlip.accountNumber}` : ''}
      ${paySlip.bkashNumber ? `Bkash: ${paySlip.bkashNumber}` : ''}
      ----------------------------------
      Authorized By: ${paySlip.authorizedBy}
      
      m³ techOps Ltd.
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${paySlip.employeeId}-${paySlip.paymentMonth}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPaySlip(null);
  };

  return (
    <div className="MPS-manage-payslip">
      <div className="MPS-payslip-header">
        <h2>Manage Pay Slips</h2>
        <div className="MPS-payslip-header-actions">
          <div className="MPS-payslip-search">
            <input
              type="text"
              placeholder="Search pay slips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="MPS-search-icon" />
          </div>
          <div className="MPS-payslip-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </div>
      </div>

      <div className="MPS-payslip-table-container">
        <table className="MPS-payslip-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Reference</th>
              <th>Payment Month</th>
              <th>Pay Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaySlips.length > 0 ? (
              filteredPaySlips.map(paySlip => (
                <tr key={paySlip.id}>
                  <td>
                    <span className="MPS-employee-id">{paySlip.employeeId}</span>
                  </td>
                  <td>
                    <span className="MPS-employee-name">{paySlip.employeeName}</span>
                  </td>
                  <td>
                    <span className="MPS-reference-code">{paySlip.reference}</span>
                  </td>
                  <td>
                    <span className="MPS-payment-month">{paySlip.paymentMonth}</span>
                  </td>
                  <td>{formatDate(paySlip.payDate)}</td>
                  <td>
                    <span className="MPS-amount">{formatCurrency(paySlip.amount)}</span>
                  </td>
                  <td>
                    {getStatusBadge(paySlip.status)}
                  </td>
                  <td>
                    <div className="MPS-action-icons">
                      <FiEye 
                        className="MPS-view-icon" 
                        onClick={() => handleView(paySlip)}
                        title="View Pay Slip"
                      />
                      <FiDownload 
                        className="MPS-download-icon" 
                        onClick={() => handleDownload(paySlip)}
                        title="Download PDF"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="MPS-no-results">
                <td colSpan="8">
                  No pay slips found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isModalOpen && selectedPaySlip && (
        <div className="MPS-modal-overlay" onClick={closeModal}>
          <div className="MPS-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="MPS-modal-header">
              <h3>Pay Slip Details</h3>
              <button className="MPS-modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <div className="MPS-modal-body">
              <div className="MPS-payslip-details">
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Employee ID:</span>
                  <span className="MPS-detail-value">{selectedPaySlip.employeeId}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Employee Name:</span>
                  <span className="MPS-detail-value">{selectedPaySlip.employeeName}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Reference:</span>
                  <span className="MPS-detail-value">{selectedPaySlip.reference}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Payment Month:</span>
                  <span className="MPS-detail-value">{selectedPaySlip.paymentMonth}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Pay Date:</span>
                  <span className="MPS-detail-value">{formatDate(selectedPaySlip.payDate)}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Earnings:</span>
                  <span className="MPS-detail-value">{formatCurrency(selectedPaySlip.earnings)}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Deductions:</span>
                  <span className="MPS-detail-value">{formatCurrency(selectedPaySlip.deductions)}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Net Pay:</span>
                  <span className="MPS-detail-value MPS-highlight">{formatCurrency(selectedPaySlip.amount)}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Payment Mode:</span>
                  <span className="MPS-detail-value">{selectedPaySlip.paymentMode}</span>
                </div>
                {selectedPaySlip.bankName && (
                  <div className="MPS-detail-row">
                    <span className="MPS-detail-label">Bank Name:</span>
                    <span className="MPS-detail-value">{selectedPaySlip.bankName}</span>
                  </div>
                )}
                {selectedPaySlip.accountNumber && (
                  <div className="MPS-detail-row">
                    <span className="MPS-detail-label">Account Number:</span>
                    <span className="MPS-detail-value">{selectedPaySlip.accountNumber}</span>
                  </div>
                )}
                {selectedPaySlip.bkashNumber && (
                  <div className="MPS-detail-row">
                    <span className="MPS-detail-label">Bkash Number:</span>
                    <span className="MPS-detail-value">{selectedPaySlip.bkashNumber}</span>
                  </div>
                )}
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Authorized By:</span>
                  <span className="MPS-detail-value">{selectedPaySlip.authorizedBy}</span>
                </div>
                <div className="MPS-detail-row">
                  <span className="MPS-detail-label">Status:</span>
                  <span className="MPS-detail-value">{getStatusBadge(selectedPaySlip.status)}</span>
                </div>
              </div>
            </div>
            <div className="MPS-modal-footer">
              <button className="MPS-download-btn" onClick={() => handleDownload(selectedPaySlip)}>
                <FiDownload /> Download Pay Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePaySlip;