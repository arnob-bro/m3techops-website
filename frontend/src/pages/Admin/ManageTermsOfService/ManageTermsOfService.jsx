import { useState, useEffect, useRef } from 'react';
import { FaSave, FaEdit, FaTimes, FaUpload } from 'react-icons/fa';
import Modal from 'react-modal';
import './ManageTermsOfService.css';

const ManageTermsOfService = () => {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchTermsOfService();
  }, []);

  const fetchTermsOfService = async () => {
    try {
      // Simulated API response
      const mockData = {
        content: `# Terms of Service\n\n## 1. Agreement to Terms\nBy accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.\n\n## 2. Use of Services\nYou agree to use our services only for lawful purposes and in accordance with these Terms:\n\n- You will not use our services in any way that violates applicable laws\n- You will not engage in unauthorized framing or linking to our website\n- You will not interfere with or disrupt the services or servers\n- You will not attempt to gain unauthorized access to any portion of our services`,
        lastUpdated: '2024-01-01'
      };
      setContent(mockData.content);
      setLastUpdated(mockData.lastUpdated);
    } catch (error) {
      console.error('Error fetching terms of service:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Simulate API call to save content
      console.log('Saving terms of service:', content);
      setLastUpdated(new Date().toISOString().split('T')[0]);
      setIsModalOpen(false);
      alert('Terms of service saved successfully!');
    } catch (error) {
      console.error('Error saving terms of service:', error);
      alert('Error saving terms of service. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/html') {
      alert('Please upload an HTML file only.');
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Extract text content from HTML
        const htmlContent = e.target.result;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        setContent(textContent);
        setIsUploading(false);
        alert('HTML file uploaded successfully! Content extracted to editor.');
      } catch (error) {
        console.error('Error processing HTML file:', error);
        alert('Error processing HTML file. Please try again.');
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="manage-policy">
      <div className="policy-header">
        <h2>Terms of Service Management</h2>
        <div className="policy-actions">
          <span className="last-updated">
            Last Updated: {formatDate(lastUpdated)}
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="policy-edit-btn"
          >
            <FaEdit /> Edit Terms
          </button>
        </div>
      </div>

      <div className="policy-content">
        <div className="policy-preview">
          <h3>Current Terms of Service</h3>
          <div className="policy-text">
            {content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index}>{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index}>{line.substring(3)}</h2>;
              } else if (line.startsWith('### ')) {
                return <h3 key={index}>{line.substring(4)}</h3>;
              } else if (line.startsWith('- ')) {
                return <li key={index}>{line.substring(2)}</li>;
              } else {
                return <p key={index}>{line}</p>;
              }
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="policy-modal"
        overlayClassName="policy-modal-overlay"
      >
        <div className="policy-modal-content">
          <div className="policy-modal-header">
            <h3>Edit Terms of Service</h3>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="policy-modal-close"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="policy-modal-body">
            <div className="upload-section">
              <h4>Upload HTML File</h4>
              <p>Upload an HTML file to extract content (will replace current content)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".html,.htm"
                style={{ display: 'none' }}
              />
              <button 
                onClick={triggerFileInput}
                className="upload-btn"
                disabled={isUploading}
              >
                <FaUpload /> {isUploading ? 'Processing...' : 'Upload HTML File'}
              </button>
            </div>

            <div className="form-group">
              <label>Terms Content (Markdown supported)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder="Enter your terms of service content here..."
              />
            </div>
          </div>
          
          <div className="policy-modal-footer">
            <div className="form-actions">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="save-btn"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageTermsOfService;