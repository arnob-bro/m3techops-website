import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import AuthApi from '../../../apis/authApi'; // adjust path
import './Login.css';
const authApi = new AuthApi();

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validToken, setValidToken] = useState(null); // null = checking, true/false after check
  const navigate = useNavigate();
  const { token } = useParams(); // expects route like /change-password/:token

  useEffect(() => {
    const verify = async () => {
      try {
        await authApi.verifyNewPassToken(token);
        setValidToken(true);
      } catch (err) {
        setValidToken(false);
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
      await authApi.changePasswordWithToken(token, newPassword);

      setSuccess('Password changed successfully!');
      setTimeout(() => navigate('/admin-login'), 2000);
    } catch (err) {
      setError(err.error || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Still checking token
  if (validToken === null) {
    return (
      <div className="login-page">
        <motion.div 
          className="login-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Checking token...</h2>
        </motion.div>
      </div>
    );
  }

  // Invalid token
  if (validToken === false) {
    return (
      <div className="login-page">
        <motion.div 
          className="login-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ color: 'red' }}>Invalid or expired token</h2>
          <p><Link to="/admin-login">Back to Login</Link></p>
        </motion.div>
      </div>
    );
  }

  // Valid token → show form
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
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Change Password'}
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
