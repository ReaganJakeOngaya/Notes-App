import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Mouse tracking for subtle parallax effects
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.classList.remove('landing-page');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const handleGetStarted = () => {
    // Add subtle haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate('/login');
  };

  const handleCreateAccount = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate('/login', { state: { showRegister: true } });
  };

  return (
    <div className="landing-container">
      {/* Animated background elements with mouse parallax */}
      <motion.div 
        className="bg-blob-1"
        style={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
      />
      <motion.div 
        className="bg-blob-2"
        style={{
          x: mousePosition.x * -0.3,
          y: mousePosition.y * -0.3,
        }}
      />
      <motion.div 
        className="bg-blob-3"
        style={{
          x: mousePosition.x * 0.4,
          y: mousePosition.y * 0.4,
        }}
      />

      <motion.div 
        className="glass-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y }}
        whileHover={{ 
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <motion.h1 
          className="app-title"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          Notes<span>Hub</span>
        </motion.h1>

        <motion.p 
          className="app-description"
          variants={itemVariants}
        >
          Your secure, cloud-synced notes application with AI-powered organization, 
          real-time collaboration, and a beautiful interface designed for productivity.
        </motion.p>

        <motion.div 
          className="cta-buttons"
          variants={itemVariants}
        >
          <motion.button 
            className="btn-primary"
            onClick={handleGetStarted}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            aria-label="Get started with NotesHub"
          >
            Get Started
          </motion.button>
          
          <motion.button 
            className="btn-secondary"
            onClick={handleCreateAccount}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            aria-label="Create a new account"
          >
            Create Account
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="trust-indicators"
          variants={itemVariants}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            marginTop: '2rem',
            opacity: 0.7 
          }}
        >
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>10K+</div>
            <div>Active Users</div>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>99.9%</div>
            <div>Uptime</div>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>256-bit</div>
            <div>Encryption</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.footer 
        className="landing-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p>© {new Date().getFullYear()} NotesHub. All rights reserved.</p>
        <div className="footer-links">
          <motion.a 
            href="#privacy"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Privacy Policy
          </motion.a>
          <motion.a 
            href="#terms"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Terms of Service
          </motion.a>
          <motion.a 
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;