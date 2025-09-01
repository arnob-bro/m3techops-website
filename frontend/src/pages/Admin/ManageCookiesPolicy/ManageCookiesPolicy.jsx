import { useState, useEffect, useRef } from 'react';
import { FaSave, FaEdit, FaTimes, FaUpload } from 'react-icons/fa';
import Modal from 'react-modal';
import './ManageCookiesPolicy.css';

const ManageCookiesPolicy = () => {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchCookiesPolicy();
  }, []);

  const fetchCookiesPolicy = async () => {
    try {
      // Simulated API response
      const mockData = {
        content: `# Cookie Policy\n\n## 1. What Are Cookies\nCookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to the website owners.\n\n## 2. How We Use Cookies\nWe use cookies for several purposes:\n\n### Essential Cookies\nThese cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.\n\n### Analytics Cookies\nThese cookies help us understand how visitors interact with our website. We use this information to improve our services and user experience.`,
        lastUpdated: '2024-01-01'
      };
      setContent(mockData.content);
      setLastUpdated(mockData.lastUpdated);
    } catch (error) {
      console.error('Error fetching cookies policy:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Simulate API call to save content
      console.log('Saving cookies policy:', content);
      setLastUpdated(new Date().toISOString().split('T')[0]);
      setIsModalOpen(false);
      alert('Cookies policy saved successfully!');
    } catch (error) {
      console.error('Error saving cookies policy:', error);
      alert('Error saving cookies policy. Please try again.');
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
        <h2>Cookies Policy Management</h2>
        <div className="policy-actions">
          <span className="last-updated">
            Last Updated: {formatDate(lastUpdated)}
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="policy-edit-btn"
          >
            <FaEdit /> Edit Policy
          </button>
        </div>
      </div>

      <div className="policy-content">
        <div className="policy-preview">
          <h3>Current Cookies Policy</h3>
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
            <h3>Edit Cookies Policy</h3>
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
              <label>Policy Content (Markdown supported)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder="Enter your cookies policy content here..."
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

export default ManageCookiesPolicy;