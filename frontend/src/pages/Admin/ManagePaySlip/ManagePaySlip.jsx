import { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiSearch, FiX } from 'react-icons/fi';
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
            companyName: 'm³ techOps Ltd.',
            companyAddress: '77/1, Siddeshwari Road, Dhaka 1217',
            reference: 'REF202401',
            paymentMonth: 'January 2024',
            payDate: '2024-01-15',
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            designation: 'Software Engineer',
            earnings: 90000,
            deductions: 5000,
            netPay: 85000,
            status: 'paid',
            paymentMode: 'Bank Transfer',
            accountHolder: 'John Doe',
            bankName: 'City Bank',
            bankBranch: 'Motijheel',
            accountNumber: 'XXXX-XXXX-1234',
            bkashTransaction: null,
            authorizedBy: 'Sumaiya Ahmed',
            payee: 'John Doe',
            logoUrl: '/default-logo.png',
            note: '** In case of bkash payments, the payee agrees to pay any required charges.\n*** Internal use only.'
          },
          {
            id: 'PS002',
            companyName: 'm³ techOps Ltd.',
            companyAddress: '77/1, Siddeshwari Road, Dhaka 1217',
            reference: 'REF202401',
            paymentMonth: 'January 2024',
            payDate: '2024-01-15',
            employeeId: 'EMP002',
            employeeName: 'Sarah Johnson',
            designation: 'UI Designer',
            earnings: 100000,
            deductions: 5000,
            netPay: 95000,
            status: 'pending',
            paymentMode: 'Bkash',
            bkashTransaction: 'TRX123456',
            authorizedBy: 'Sumaiya Ahmed',
            payee: 'Sarah Johnson',
            logoUrl: '/default-logo.png',
            note: '** In case of bkash payments, the payee agrees to pay any required charges.\n*** Internal use only.'
          }
        ];
        setPaySlips(mockPaySlips);
      } catch (error) {
        console.error('Error fetching pay slips:', error);
      }
    };

    fetchPaySlips();
  }, []);

  const filteredPaySlips = paySlips.filter((paySlip) => {
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

    return <span className={`MPS-status-badge ${statusClasses[status]}`}>{statusLabels[status]}</span>;
  };

  const handleView = (paySlip) => {
    setSelectedPaySlip(paySlip);
    setIsModalOpen(true);
  };

  const handleDownload = (paySlip) => {
    const pdfContent = `
      PAY SLIP - ${paySlip.paymentMonth}
      ==================================
      Company: ${paySlip.companyName}
      Address: ${paySlip.companyAddress}
      ----------------------------------
      Employee: ${paySlip.employeeName} (${paySlip.employeeId})
      Designation: ${paySlip.designation || 'N/A'}
      Reference: ${paySlip.reference}
      Pay Date: ${formatDate(paySlip.payDate)}
      ----------------------------------
      Earnings: ${formatCurrency(paySlip.earnings)}
      Deductions: ${formatCurrency(paySlip.deductions)}
      Net Pay: ${formatCurrency(paySlip.netPay)}
      ----------------------------------
      Payment Mode: ${paySlip.paymentMode}
      ${paySlip.accountHolder ? `Account Holder: ${paySlip.accountHolder}` : ''}
      ${paySlip.bankName ? `Bank: ${paySlip.bankName}` : ''}
      ${paySlip.bankBranch ? `Branch: ${paySlip.bankBranch}` : ''}
      ${paySlip.accountNumber ? `Account: ${paySlip.accountNumber}` : ''}
      ${paySlip.bkashTransaction ? `Bkash Transaction: ${paySlip.bkashTransaction}` : ''}
      ----------------------------------
      Authorized By: ${paySlip.authorizedBy}
      Payee: ${paySlip.payee}
      
      Notes: ${paySlip.note || 'N/A'}
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
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
              <th>Name</th>
              <th>Designation</th>
              <th>Reference</th>
              <th>Payment Month</th>
              <th>Pay Date</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaySlips.length > 0 ? (
              filteredPaySlips.map((paySlip) => (
                <tr key={paySlip.id}>
                  <td>{paySlip.employeeId}</td>
                  <td>{paySlip.employeeName}</td>
                  <td>{paySlip.designation || 'N/A'}</td>
                  <td>{paySlip.reference}</td>
                  <td>{paySlip.paymentMonth}</td>
                  <td>{formatDate(paySlip.payDate)}</td>
                  <td>{formatCurrency(paySlip.netPay)}</td>
                  <td>{getStatusBadge(paySlip.status)}</td>
                  <td>
                    <FiEye className="MPS-view-icon" onClick={() => handleView(paySlip)} title="View" />
                    <FiDownload
                      className="MPS-download-icon"
                      onClick={() => handleDownload(paySlip)}
                      title="Download"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="MPS-no-results">
                <td colSpan="9">No pay slips found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
              <img src={selectedPaySlip.logoUrl} alt="Company Logo" className="MPS-company-logo" />
              <h4>{selectedPaySlip.companyName}</h4>
              <p className="MPS-company-address">{selectedPaySlip.companyAddress}</p>

              <div className="MPS-payslip-details">
                <div className="MPS-detail-row">
                  <span>Employee:</span> {selectedPaySlip.employeeName} ({selectedPaySlip.employeeId})
                </div>
                <div className="MPS-detail-row">
                  <span>Designation:</span> {selectedPaySlip.designation || 'N/A'}
                </div>
                <div className="MPS-detail-row">
                  <span>Reference:</span> {selectedPaySlip.reference}
                </div>
                <div className="MPS-detail-row">
                  <span>Payment Month:</span> {selectedPaySlip.paymentMonth}
                </div>
                <div className="MPS-detail-row">
                  <span>Pay Date:</span> {formatDate(selectedPaySlip.payDate)}
                </div>
                <div className="MPS-detail-row">
                  <span>Earnings:</span> {formatCurrency(selectedPaySlip.earnings)}
                </div>
                <div className="MPS-detail-row">
                  <span>Deductions:</span> {formatCurrency(selectedPaySlip.deductions)}
                </div>
                <div className="MPS-detail-row">
                  <span>Net Pay:</span> <strong>{formatCurrency(selectedPaySlip.netPay)}</strong>
                </div>
                <div className="MPS-detail-row">
                  <span>Payment Mode:</span> {selectedPaySlip.paymentMode}
                </div>
                {selectedPaySlip.accountHolder && (
                  <div className="MPS-detail-row">
                    <span>Account Holder:</span> {selectedPaySlip.accountHolder}
                  </div>
                )}
                {selectedPaySlip.bankName && (
                  <div className="MPS-detail-row">
                    <span>Bank:</span> {selectedPaySlip.bankName}
                  </div>
                )}
                {selectedPaySlip.bankBranch && (
                  <div className="MPS-detail-row">
                    <span>Branch:</span> {selectedPaySlip.bankBranch}
                  </div>
                )}
                {selectedPaySlip.accountNumber && (
                  <div className="MPS-detail-row">
                    <span>Account Number:</span> {selectedPaySlip.accountNumber}
                  </div>
                )}
                {selectedPaySlip.bkashTransaction && (
                  <div className="MPS-detail-row">
                    <span>Bkash Transaction:</span> {selectedPaySlip.bkashTransaction}
                  </div>
                )}
                <div className="MPS-detail-row">
                  <span>Authorized By:</span> {selectedPaySlip.authorizedBy}
                </div>
                <div className="MPS-detail-row">
                  <span>Payee:</span> {selectedPaySlip.payee}
                </div>
                <div className="MPS-detail-row">
                  <span>Status:</span> {getStatusBadge(selectedPaySlip.status)}
                </div>
                {selectedPaySlip.note && (
                  <div className="MPS-detail-row MPS-note">
                    <span>Note:</span> {selectedPaySlip.note}
                  </div>
                )}
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
