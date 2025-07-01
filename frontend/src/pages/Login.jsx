import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/api';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl -left-32 -top-32"></div>
      <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-20 blur-3xl -right-48 bottom-0"></div>
      
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/10"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-white/80">
              {isLogin ? 'Sign in to continue to NotesHub' : 'Join NotesHub to start organizing your notes'}
            </p>
          </motion.div>

          {error && (
            <motion.div 
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="username" className="block text-white/80 mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </motion.div>
            )}
            
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.3 : 0.4 }}
            >
              <label htmlFor="email" className="block text-white/80 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </motion.div>
            
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.4 : 0.5 }}
            >
              <label htmlFor="password" className="block text-white/80 mb-2">Password</label>
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </motion.div>
            
            <motion.button 
              type="submit" 
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.5 : 0.6 }}
            >
              {isSubmitting ? (
                <span className="inline-block h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
              ) : isLogin ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </form>
          
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button 
              className="text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-colors w-full text-center mb-6"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-transparent text-sm text-white/60">OR</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <motion.button 
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                type="button"
                onClick={handleGoogleLogin}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fab fa-google"></i>
                Continue with Google
              </motion.button>
              <motion.button 
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
