import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    document.body.classList.add('bg-gradient-to-br', 'from-indigo-900', 'to-purple-900');
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.classList.remove('bg-gradient-to-br', 'from-indigo-900', 'to-purple-900');
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
    if (navigator.vibrate) navigator.vibrate(10);
    navigate('/login');
  };

  const handleCreateAccount = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    navigate('/login', { state: { showRegister: true } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs with improved positioning and z-index */}
      <motion.div 
        className="absolute w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl -left-32 -top-32 z-0"
        style={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
      />
      <motion.div 
        className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl -right-48 bottom-0 z-0"
        style={{
          x: mousePosition.x * -0.3,
          y: mousePosition.y * -0.3,
        }}
      />
      <motion.div 
        className="absolute w-80 h-80 rounded-full bg-pink-500/20 blur-3xl left-1/4 bottom-1/3 z-0"
        style={{
          x: mousePosition.x * 0.4,
          y: mousePosition.y * 0.4,
        }}
      />

      <motion.div 
        className="backdrop-blur-md bg-white/10 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl w-full max-w-2xl border border-white/10 z-10"
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
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          Notes<span className="text-indigo-300">Flow</span>
        </motion.h1>

        <motion.p 
          className="text-base sm:text-lg text-white/80 text-center mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Your secure, cloud-synced notes application with AI-powered organization, 
          real-time collaboration, and a beautiful interface designed for productivity.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
          variants={itemVariants}
        >
          <motion.button 
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
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
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-white/10 border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
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

        {/* Trust indicators with better spacing */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 opacity-70"
          variants={itemVariants}
        >
          {[
            { value: "10K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "256-bit", label: "Encryption" }
          ].map((item, index) => (
            <div key={index} className="text-center text-white/60 text-sm sm:text-base">
              <div className="font-semibold mb-1">{item.value}</div>
              <div>{item.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.footer 
        className="mt-auto py-6 text-center text-white/60 text-xs sm:text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p>© {new Date().getFullYear()} NotesFlow. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
          {["Privacy Policy", "Terms of Service", "Contact Us"].map((item, index) => (
            <motion.a 
              key={index}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              whileFocus={{ scale: 1.05 }}
            >
              {item}
            </motion.a>
          ))}
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;