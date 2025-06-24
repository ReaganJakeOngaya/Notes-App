import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/api';
import "../css/Login.css";

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.showRegister ? false : true);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(credentials);
      } else {
        await register(credentials);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${API_URL}/auth/apple`;
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-blob-1"></div>
      <div className="login-blob-2"></div>
      
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="login-card glass-card"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="login-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to continue to NotesHub' : 'Join NotesHub to start organizing your notes'}</p>
          </motion.div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                />
              </motion.div>
            )}
            
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.3 : 0.4 }}
            >
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your email"
              />
            </motion.div>
            
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.4 : 0.5 }}
            >
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Enter your password"
              />
            </motion.div>
            
            <motion.button 
              type="submit" 
              className="btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.5 : 0.6 }}
            >
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : isLogin ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </form>
          
          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button 
              className="btn btn-text"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
            
            <div className="divider">
              <span>OR</span>
            </div>
            
            <div className="social-auth">
              <motion.button 
                className="btn btn-google"
                type="button"
                onClick={handleGoogleLogin}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fab fa-google"></i>
                Continue with Google
              </motion.button>
              <motion.button 
                className="btn btn-apple"
                type="button"
                onClick={handleAppleLogin}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fab fa-apple"></i>
                Continue with Apple
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
