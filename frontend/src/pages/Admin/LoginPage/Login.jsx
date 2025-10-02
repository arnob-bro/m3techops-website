import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import './Login.css';
import useUserStore from "../../../stores/userStore";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Logging in with:', { email, password });
      const result = await login(email, password);
      
      if (result && result.success) {
        navigate("/admin");
      } else {
        // Handle cases where login fails but doesn't throw an error
        const errorMessage = result?.message || 'Invalid credentials. Please try again.';
        setError(errorMessage);
      }
      
    } catch (err) {
      // Display the actual error message from the API or a fallback
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
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
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
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

          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div> */}
      </motion.div>
    </div>
  );
};

export default Login;