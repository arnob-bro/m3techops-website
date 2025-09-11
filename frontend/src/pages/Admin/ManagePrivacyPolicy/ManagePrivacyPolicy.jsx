import { useState, useEffect, useRef } from 'react';
import { FaSave, FaEdit, FaTimes, FaUpload } from 'react-icons/fa';
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';   // Add this import
import './ManagePrivacyPolicy.css';
import PolicyApi from '../../../apis/policyApi';
const policyApi = new PolicyApi();

const ManagePrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      // const mockData = {
      //   content: `# Privacy Policy\n\n## 1. Introduction\nAt M3 TECHOPS, we are committed to protecting your privacy and ensuring the security of your personal information.\n\n- Contact info\n- Business info\n- Payment info`,
      //   lastUpdated: '2024-01-01'
      // };

      const privacy = await policyApi.getpolicyByType("privacy");

      setContent(privacy.content);
      setLastUpdated(privacy.updated_at);
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving privacy policy:', content);
      const updatedPrivacy = await policyApi.updatePolicy("privacy","Privacy Policy", content);

      setContent(updatedPrivacy.content);
      setLastUpdated(updatedPrivacy.updated_at);
      setIsModalOpen(false);
      alert('Privacy policy saved successfully!');
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      alert('Error saving privacy policy. Please try again.');
    }
  };

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   if (file.type !== 'text/html') {
  //     alert('Please upload an HTML file only.');
  //     return;
  //   }

  //   setIsUploading(true);
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const htmlContent = e.target.result;
  //       const tempDiv = document.createElement('div');
  //       tempDiv.innerHTML = htmlContent;
  //       const textContent = tempDiv.textContent || tempDiv.innerText || '';
  //       setContent(textContent);
  //       setIsUploading(false);
  //       alert('HTML file uploaded successfully! Content extracted to editor.');
  //     } catch (error) {
  //       console.error('Error processing HTML file:', error);
  //       alert('Error processing HTML file. Please try again.');
  //       setIsUploading(false);
  //     }
  //   };
  //   reader.onerror = () => {
  //     alert('Error reading file. Please try again.');
  //     setIsUploading(false);
  //   };
  //   reader.readAsText(file);
  // };

  // const triggerFileInput = () => {
  //   fileInputRef.current?.click();
  // };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="manage-policy">
      <div className="policy-header">
        <h2>Privacy Policy Management</h2>
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
          <h3>Current Privacy Policy</h3>
          <div className="policy-text">
            
            <ReactMarkdown>{content}</ReactMarkdown>
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
            <h3>Edit Privacy Policy</h3>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="policy-modal-close"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="policy-modal-body">
            {/* <div className="upload-section">
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
            </div> */}

            <div className="form-group">
              <label>Policy Content (Markdown supported)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder="Enter your privacy policy content here..."
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

export default ManagePrivacyPolicy;
