
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PaySlipGenerator.css';

// Import the default logo
import defaultLogo from '../../../assets/images/m3logo.png';

const PaySlipGenerator = () => {
  const [formData, setFormData] = useState({
    companyName: 'm³ techOps Ltd.',
    companyAddress: '77/1, Siddeshwari Road\nAnarkali Super Market\n4th floor shop No.26/A\nDhaka 1217',
    reference: '',
    paymentMonth: '',             
    employeeName: '',
    designation: '',
    employeeId: '',
    payDate: '',
    earnings: 0,
    deductions: 0,
    netPay: 0,
    paymentMode: 'Bank',
    accountHolder: '',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    bkashTransaction: '',
    authorizedBy: 'Sumaiya Ahmed',
    payee: '',
    logo: null,
    logoUrl: defaultLogo, // Set default logo here
    note: "** In case of bkash payments, the payee agrees to pay any required charges for bkash service.\n*** This document is for internal documentation only."
  });

  const paySlipRef = useRef();
  
  // Add reset logo functionality
  const resetLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoUrl: defaultLogo
    }));
  };

  const generatePDF = () => {
    const input = paySlipRef.current;
    
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = `Pay_Slip_${formData.employeeName.replace(/\s+/g, '_')}_${formData.payDate}.pdf`;
      pdf.save(fileName);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // First update the changed field
      const updatedData = { ...prev, [name]: value };
      
      // Then calculate netPay if earnings or deductions changed
      if (name === 'earnings' || name === 'deductions') {
        const earnings = parseFloat(updatedData.earnings) || 0;
        const deductions = parseFloat(updatedData.deductions) || 0;
        if (!isNaN(earnings) && !isNaN(deductions)) {
          updatedData.netPay = (earnings - deductions).toFixed(2);
        }
      }
      
      return updatedData;
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="payslip-generator">
    <div className="app-container">
      <header className="app-header">
        <h1>M^3TECHOPS Pay Slip Generator</h1>
        <p>Create pay slips in PDF format</p>
      </header>
      
      <div className="content-container">
        <div className="form-section">
          <div className="form-card">
            <h2>Company Information</h2>
            
            <div className="form-group">
              <label>Company Logo</label>
              <div className="logo-controls">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="file-input"
                />
                <button 
                  onClick={resetLogo}
                  className="reset-logo-btn"
                >
                  Reset to Default
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Company Address</label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Reference</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
              />
            </div>
            
            <h2>Employee Information</h2>
            
            <div className="form-group">
              <label>Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Pay Date (DD-MM-YYYY)</label>
              <input
                type="text"
                name="payDate"
                value={formData.payDate}
                onChange={handleChange}
              />
            </div>
            
            <h2>Payment Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Earnings (৳)</label>
                <input
                  type="number"
                  name="earnings"
                  value={formData.earnings}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Deductions (৳)</label>
                <input
                  type="number"
                  name="deductions"
                  
                  value={formData.deductions}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Net Pay (৳)</label>
                <input
                  type="number"
                  name="netPay"
                  value={formData.netPay}
                  onChange={handleChange}
                  readOnly
                  className="read-only"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="Bank">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Bkash">Bkash</option>
              </select>
            </div>
            <div className="form-group">
                <label>Payment Month-Year</label>
                <input
                  type="Text"
                  name="paymentMonth"
                  value={formData.paymentMonth}
                  onChange={handleChange}
                />
              </div>
            
            {formData.paymentMode === 'Bank' && (
              <>
                <h3>Bank Details</h3>
                <div className="form-group">
                  <label>Account Holder</label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bank Branch</label>
                    <input
                      type="text"
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            {formData.paymentMode === 'Bkash' && (
              <div className="form-group">
                <label>Bkash Transaction No.</label>
                <input
                  type="text"
                  name="bkashTransaction"
                  value={formData.bkashTransaction}
                  onChange={handleChange}
                  placeholder="TRXID___________"
                />
              </div>
            )}
            
            <h2>Authorization</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Authorized By</label>
                <input
                  type="text"
                  name="authorizedBy"
                  value={formData.authorizedBy}
                  onChange={handleChange}
                />
              </div>
              
              {/* <div className="form-group">
                <label>Payee Name</label>
                <input
                  type="text"
                  name="payee"
                  value={formData.payee}
                  onChange={handleChange}
                />
              </div> */}
            </div>
            
            <h2>Custom Note</h2>
            <div className="form-group">
              <label>Note (supports multiple lines)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your custom note here..."
              />
              <p className="note-hint">
                Use new lines for separate paragraphs. Special characters like ** will be preserved.
              </p>
            </div>
            
            <button
              onClick={generatePDF}
              className="generate-btn"
            >
              Generate Pay Slip PDF
            </button>
          </div>
        </div>
        
        <div className="preview-section">
          <h2>Pay Slip Preview</h2>
          <div className="preview-container">
            <PaySlip ref={paySlipRef} data={formData} />
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p>© 2025 m³ techOps Ltd. | Professional Pay Slip Generator</p>
      </footer>
    </div>
    </div>
  );
};

const PaySlip = React.forwardRef(({ data }, ref) => {
  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div ref={ref} className="payslip-container">
    <div className="payslip-header">
      <div className="left-header">
        <div className="company-logo">
          <img 
            src={data.logoUrl} 
            alt="Company Logo" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentNode.innerHTML = '<div class="logo-placeholder">Logo</div>';
            }}
          />
        </div>
        <div className="reference-info">
          <div className="reference-label">REFERENCE:</div>
          <div className="reference-value">{data.reference}</div>
        </div>
      </div>

      <div className="company-info">
        <h1>{data.companyName}</h1>
        <div className="company-address">{data.companyAddress}</div>
      </div>
    </div>
      <div className="payslip-title">
        <h2>Pay Slip - {data.paymentMonth}</h2>
      </div>
      
      <div className="employee-info">
        <div className="info-item">
          <span className="info-label">Name:</span>
          <span className="info-value">{data.employeeName}</span>
        </div>
        <div className="info-item">
          <span className="info-label">A. Designation:</span>
          <span className="info-value">{data.designation}</span>
        </div>
        <div className="info-item">
          <span className="info-label">B. ID:</span>
          <span className="info-value">{data.employeeId}</span>
        </div>
        <div className="info-item">
          <span className="info-label">C. Pay Date:</span>
          <span className="info-value">{data.payDate}</span>
        </div>
      </div>
      
      <div className="payment-info">
        <div className="payment-item">
          <span className="payment-label">Earnings:</span>
          <span className="payment-value">৳ {formatCurrency(data.earnings)}</span>
        </div>
        <div className="payment-item">
          <span className="payment-label">A. Deductions:</span>
          <span className="payment-value">৳ {formatCurrency(data.deductions)}</span>
        </div>
        <div className="payment-item net-pay">
          <span className="payment-label">B. Net Pay:</span>
          <span className="payment-value">৳ {formatCurrency(data.netPay)}</span>
        </div>
      </div>
      
      <div className="payment-mode">
        <span className="mode-label">Payment Mode:</span>
        <div className="mode-options">
          {['Bank', 'Cash', 'Bkash'].map(mode => (
            <div key={mode} className="mode-option">
              <div className={`mode-checkbox ${data.paymentMode === mode ? 'checked' : ''}`}>
                {data.paymentMode === mode && '✓'}
              </div>
              <span>{mode}</span>
            </div>
          ))}
        </div>
      </div>
      
      {data.paymentMode === 'Bank' && (
        <div className="bank-details">
          <h4>Bank Details</h4>
          <div className="bank-grid">
            <div>Account Holder:</div>
            <div>{data.accountHolder}</div>
            <div>Bank Name:</div>
            <div>{data.bankName}</div>
            <div>Bank Branch:</div>
            <div>{data.bankBranch}</div>
            <div>Account Number:</div>
            <div>{data.accountNumber}</div>
            <div>Reference No.:</div>
            <div>{data.reference}</div>
          </div>
        </div>
      )}
      
      {data.paymentMode === 'Bkash' && (
        <div className="bkash-details">
          <h4>Bkash Details</h4>
          <div className="bkash-info">
            <span>Bkash Transaction No.:</span>
            <span>{data.bkashTransaction || 'TRXID___________'}</span>
          </div>
          <div className="bkash-info">
            <span>Reference No.:</span>
            <span>{data.reference}</span>
          </div>
        </div>
      )}
      
      <div className="signature-section">
        <div className="signature authorized">
          <div className="signature-line"></div>
          <div>Authorized by: {data.authorizedBy}</div>
          <div>Place: Dhaka, Bangladesh</div>
        </div>
        
        {/* <div className="signature payee">
          <div className="signature-line"></div>
          <div>Payee: {data.payee}</div>
          <div>Place: Dhaka, Bangladesh</div>
        </div> */}
      </div>
      
      <div className="footer-notes">
        {data.note.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
});

export default PaySlipGenerator;