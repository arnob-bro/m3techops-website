import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import './Login.css';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call - replace with your actual password change logic
      console.log('Changing password to:', newPassword);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If successful
      setSuccess('Password changed successfully!');
      
      // Redirect after success
      setTimeout(() => {
        navigate("/admin"); // or wherever you want to redirect
      }, 2000);
      
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="login-header">
          <motion.div 
            className="logo"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span>M³</span>
          </motion.div>
          <h2>Change Password</h2>
          <p>Create your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(0, 255, 0, 0.1)',
                color: '#4CAF50',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                textAlign: 'center',
                border: '1px solid rgba(0, 255, 0, 0.2)',
                marginBottom: '0.5rem'
              }}
            >
              {success}
            </motion.div>
          )}

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Change Password'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Remember your password? <Link to="/admin-login">Back to Login</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;