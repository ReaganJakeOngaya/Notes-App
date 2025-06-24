import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => document.body.classList.remove('landing-page');
  }, []);

  return (
    <div className="landing-container">
      {/* Animated background elements */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="app-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Notes<span>Hub</span>
        </motion.h1>

        <motion.p 
          className="app-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Your secure, cloud-synced notes application with collaboration features and beautiful interface.
        </motion.p>

        <motion.div 
          className="cta-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/login', { state: { showRegister: true } })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </button>
        </motion.div>
      </motion.div>

      <motion.footer 
        className="landing-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p>© {new Date().getFullYear()} NotesHub. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact Us</a>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;