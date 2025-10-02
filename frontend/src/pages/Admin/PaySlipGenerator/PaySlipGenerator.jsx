
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PaySlipGenerator.css';
import PayslipApi from "../../../apis/payslipApi";
const payslipApi = new PayslipApi();

// Import the default logo
import defaultLogo from '../../../assets/images/m3logo.png';

const PaySlipGenerator = () => {
  const [formData, setFormData] = useState({
    company_name: 'm³ techOps Ltd.',
    company_address: '77/1, Siddeshwari Road\nAnarkali Super Market\n4th floor shop No.26/A\nDhaka 1217',
    reference: '',
    payment_month: '',             
    employee_name: '',
    designation: '',
    employee_id: '',
    pay_date: '',
    earnings: 0,
    deductions: 0,
    net_pay: 0,
    payment_mode: 'Bank Transfer',
    account_holder: '',
    bank_name: '',
    bank_branch: '',
    account_number: '',
    bkash_transaction: '',
    authorized_by: 'Sumaiya Ahmed',
    payee: '',
    logo: null,
    logo_url: defaultLogo, // Set default logo here
    note: "** In case of bkash payments, the payee agrees to pay any required charges for bkash service.\n*** This document is for internal documentation only."
  });

  const [error, setError] = useState("");   // 🔹 Error state
  const [loading, setLoading] = useState(false); // 🔹 Loading state
  const paySlipRef = useRef();
  
  // Add reset logo functionality
  const resetLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logo_url: defaultLogo
    }));
  };

  const generatePDF = async () => {
    setError(""); // clear previous errors
    setLoading(true);
    try {
      const input = paySlipRef.current;
      console.log(formData);

      // API call
      await payslipApi.createPayslip(formData);

      // Generate PDF only if API succeeds
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const fileName = `Pay_Slip_${formData.employee_name.replace(/\s+/g, '_')}_${formData.pay_date}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Error generating payslip:", err);
      setError(err.response?.data?.error || "Something went wrong while creating the payslip.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // First update the changed field
      const updatedData = { ...prev, [name]: value };
      
      // Then calculate net_pay if earnings or deductions changed
      if (name === 'earnings' || name === 'deductions') {
        const earnings = parseFloat(updatedData.earnings) || 0;
        const deductions = parseFloat(updatedData.deductions) || 0;
        if (!isNaN(earnings) && !isNaN(deductions)) {
          updatedData.net_pay = (earnings - deductions).toFixed(2);
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
          logo_url: reader.result
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
      {error && <div className="error-message">{error}</div>} {/* 🔹 Error display */}
      {loading && <div className="loading-message">Processing...</div>} {/* 🔹 Loading */}

      
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
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Company Address</label>
              <textarea
                name="company_address"
                value={formData.company_address}
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
                name="employee_name"
                value={formData.employee_name}
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
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Pay Date (YYYY-MM-DD)</label>
              <input
                type="text"
                name="pay_date"
                value={formData.pay_date}
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
                  name="net_pay"
                  value={formData.net_pay}
                  onChange={handleChange}
                  readOnly
                  className="read-only"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Payment Mode</label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Bkash">Bkash</option>
              </select>
            </div>
            <div className="form-group">
                <label>Payment Month-Year</label>
                <input
                  type="Text"
                  name="payment_month"
                  value={formData.payment_month}
                  onChange={handleChange}
                />
              </div>
            
            {formData.payment_mode === 'Bank Transfer' && (
              <>
                <h3>Bank Details</h3>
                <div className="form-group">
                  <label>Account Holder</label>
                  <input
                    type="text"
                    name="account_holder"
                    value={formData.account_holder}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bank Branch</label>
                    <input
                      type="text"
                      name="bank_branch"
                      value={formData.bank_branch}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            {formData.payment_mode === 'Bkash' && (
              <div className="form-group">
                <label>Bkash Transaction No.</label>
                <input
                  type="text"
                  name="bkash_transaction"
                  value={formData.bkash_transaction}
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
                  name="authorized_by"
                  value={formData.authorized_by}
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div ref={ref} className="payslip-container">
    <div className="payslip-header">
      <div className="left-header">
        <div className="company-logo">
          <img 
            src={data.logo_url} 
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
        <h1>{data.company_name}</h1>
        <div className="company-address">{data.company_address}</div>
      </div>
    </div>
      <div className="payslip-title">
        <h2>Pay Slip - {data.payment_month}</h2>
      </div>
      
      <div className="employee-info">
        <div className="info-item">
          <span className="info-label">Name:</span>
          <span className="info-value">{data.employee_name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">A. Designation:</span>
          <span className="info-value">{data.designation}</span>
        </div>
        <div className="info-item">
          <span className="info-label">B. ID:</span>
          <span className="info-value">{data.employee_id}</span>
        </div>
        <div className="info-item">
          <span className="info-label">C. Pay Date:</span>
          <span className="info-value">{formatDate(data.pay_date)}</span>
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
          <span className="payment-value">৳ {formatCurrency(data.net_pay)}</span>
        </div>
      </div>
      
      <div className="payment-mode">
        <span className="mode-label">Payment Mode:</span>
        <div className="mode-options">
          {['Bank Transfer', 'Cash', 'Bkash'].map(mode => (
            <div key={mode} className="mode-option">
              <div className={`mode-checkbox ${data.payment_mode === mode ? 'checked' : ''}`}>
                {data.payment_mode === mode && '✓'}
              </div>
              <span>{mode}</span>
            </div>
          ))}
        </div>
      </div>
      
      {data.payment_mode === 'Bank Transfer' && (
        <div className="bank-details">
          <h4>Bank Details</h4>
          <div className="bank-grid">
            <div>Account Holder:</div>
            <div>{data.account_holder}</div>
            <div>Bank Name:</div>
            <div>{data.bank_name}</div>
            <div>Bank Branch:</div>
            <div>{data.bank_branch}</div>
            <div>Account Number:</div>
            <div>{data.account_number}</div>
            <div>Reference No.:</div>
            <div>{data.reference}</div>
          </div>
        </div>
      )}
      
      {data.payment_mode === 'Bkash' && (
        <div className="bkash-details">
          <h4>Bkash Details</h4>
          <div className="bkash-info">
            <span>Bkash Transaction No.:</span>
            <span>{data.bkash_transaction || 'TRXID___________'}</span>
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
          <div>Authorized by: {data.authorized_by}</div>
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
    <p key={index} className="note-line">{line}</p>
  ))}
</div>
    </div>
  );
});

export default PaySlipGenerator;