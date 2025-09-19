import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiSearch, FiX } from 'react-icons/fi';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import './ManagePaySlip.css';
import PayslipApi from '../../../apis/payslipApi';
const payslipApi = new PayslipApi();

const ManagePaySlip = () => {
  const [paySlips, setPaySlips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedPaySlip, setSelectedPaySlip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch pay slips from API
    const fetchPaySlips = async () => {
      try {
        const result = await payslipApi.getPayslips({
          page: page,
          limit: 10, 
          searchTerm: searchTerm ,
          status: statusFilter
        });
        if(result.success){
          const payslips = result.payslips;
          setPaySlips(payslips);
          setTotalPages(result.pagination.totalPages);
        }
        
      } catch (error) {
        console.error('Error fetching pay slips:', error);
      }
    };

    fetchPaySlips();
  }, [page, searchTerm, statusFilter]);

  

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
      Paid: 'MPS-status-paid',
      Pending: 'MPS-status-pending',
      Failed: 'MPS-status-failed'
    };

    const statusLabels = {
      Paid: 'Paid',
      Pending: 'Pending',
      Failed: 'Failed'
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
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
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
            {paySlips.length > 0 ? (
              paySlips.map((paySlip) => (
                <tr key={paySlip.payslip_id}>
                  <td>{paySlip.employee_id}</td>
                  <td>{paySlip.employee_name}</td>
                  <td>{paySlip.designation || 'N/A'}</td>
                  <td>{paySlip.reference}</td>
                  <td>{paySlip.payment_month}</td>
                  <td>{formatDate(paySlip.pay_date)}</td>
                  <td>{formatCurrency(paySlip.net_pay)}</td>
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
      {totalPages > 1 && (
                <div className="pagination">
                {/* Previous */}
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
              
                {/* Page numbers with ellipsis */}
                {(() => {
                  const pages = [];
                  const delta = 1; // show ±1 around current
              
                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 || 
                      i === totalPages || 
                      (i >= page - delta && i <= page + delta)
                    ) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== '...') {
                      pages.push('...');
                    }
                  }
              
                  return pages.map((page, idx) =>
                    page === '...' ? (
                      <span key={idx} className="pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setPage(page)}
                        className={page === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
              
                {/* Next */}
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
          
          
          )}

          {isModalOpen && selectedPaySlip && (
            <div className="MPS-modal-overlay" onClick={closeModal}>
              <div className="MPS-modal-content payslip-generator" onClick={(e) => e.stopPropagation()}>
                <div className="payslip-container">
                  
                  {/* Header */}
                  <div className="payslip-header">
                    <div className="company-logo">
                      <img
                        src={selectedPaySlip.logo_url}
                        alt="Company Logo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentNode.innerHTML =
                            '<div class="logo-placeholder">LOGO</div>';
                        }}
                      />
                    </div>
                    <div className="company-info-container">
                      <div className="company-info">
                        <h1>{selectedPaySlip.company_name}</h1>
                        <p className="company-address">{selectedPaySlip.company_address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="payslip-title">
                    <h2>PAY SLIP – {selectedPaySlip.payment_month}</h2>
                  </div>

                  {/* Employee Info */}
                  <div className="employee-info">
                    <div className="info-item">
                      <span className="info-label">Employee Name:</span>
                      <span className="info-value">{selectedPaySlip.employee_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Employee ID:</span>
                      <span className="info-value">{selectedPaySlip.employee_id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Designation:</span>
                      <span className="info-value">{selectedPaySlip.designation || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Pay Date:</span>
                      <span className="info-value">{formatDate(selectedPaySlip.pay_date)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Reference:</span>
                      <span className="info-value">{selectedPaySlip.reference}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status:</span>
                      <span className="info-value">{getStatusBadge(selectedPaySlip.status)}</span>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="payment-info">
                    <div className="payment-item">
                      <span className="payment-label">Earnings:</span>
                      <span className="payment-value">৳ {selectedPaySlip.earnings}</span>
                    </div>
                    <div className="payment-item">
                      <span className="payment-label">Deductions:</span>
                      <span className="payment-value">৳ {selectedPaySlip.deductions}</span>
                    </div>
                    <div className="payment-item net-pay">
                      <span className="payment-label">Net Pay:</span>
                      <span className="payment-value">৳ {selectedPaySlip.net_pay}</span>
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div className="payment-mode">
                    <span className="mode-label">Payment Mode:</span>
                    <span>{selectedPaySlip.payment_mode}</span>
                  </div>
                  {selectedPaySlip.payment_mode === 'Bank Transfer' && (
                    <div className="bank-details">
                      <h4>Bank Details</h4>
                      <div className="bank-grid">
                        <span>Account Holder:</span> <span>{selectedPaySlip.account_holder}</span>
                        <span>Bank:</span> <span>{selectedPaySlip.bank_name}, {selectedPaySlip.bank_branch}</span>
                        <span>Account No.:</span> <span>{selectedPaySlip.account_number}</span>
                      </div>
                    </div>
                  )}
                  {selectedPaySlip.payment_mode === 'Bkash' && (
                    <div className="bkash-details">
                      <h4>Bkash Details</h4>
                      <div className="bkash-info">
                        <span>Transaction:</span> <span>{selectedPaySlip.bkash_transaction}</span>
                        <span>Reference:</span> <span>{selectedPaySlip.reference}</span>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedPaySlip.note && (
                    <div className="footer-notes">
                      <strong>Notes:</strong>
                      <p>{selectedPaySlip.note}</p>
                    </div>
                  )}

                  {/* Signatures */}
                  <div className="signature-section">
                    <div className="signature authorized">
                      <div className="signature-line"></div>
                      <p>Authorized By</p>
                      <p>{selectedPaySlip.authorized_by}</p>
                    </div>
                    <div className="signature">
                      <div className="signature-line"></div>
                      <p>Employee / Payee</p>
                      <p>{selectedPaySlip.payee || selectedPaySlip.employee_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

    </div>
  );
};



export default ManagePaySlip;
