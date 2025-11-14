import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Users, ArrowRight, Lock, Cloud, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 30,
        y: (e.clientY - window.innerHeight / 2) / 30
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: Shield, label: "256-bit Encryption", color: "#0066FF" },
    { icon: Zap, label: "Lightning Fast", color: "#0066FF" },
    { icon: Users, label: "10K+ Users", color: "#0066FF" }
  ];

  const handleGetStarted = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    navigate('/login');
  };

  const handleLearnMore = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    // You can navigate to a different page or scroll to features section
    navigate('/login', { state: { showRegister: true } });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Background Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(0, 102, 255, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 102, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '100px 100px',
        opacity: 0.3
      }} />

      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Content */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            maxWidth: '900px'
          }}
        >
          {/* Sparkle Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: 'rgba(0, 102, 255, 0.1)',
              border: '1px solid rgba(0, 102, 255, 0.3)',
              borderRadius: '50px',
              marginBottom: '2rem',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <Sparkles size={16} color="#0066FF" />
            <span>AI-Powered Notes</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              lineHeight: 1,
              letterSpacing: '-0.03em'
            }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 30%, #0066FF 50%, #FFFFFF 70%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
              }}
            >
              NotesHub
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '3rem',
              fontWeight: 300,
              maxWidth: '700px',
              margin: '0 auto 3rem'
            }}
          >
            Your thoughts, organized. Your ideas, secured.
            <br />
            <span style={{ color: '#0066FF', fontWeight: 500 }}>Experience the future of note-taking.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              style={{
                padding: '1.25rem 3rem',
                fontSize: '1.125rem',
                fontWeight: 600,
                background: '#0066FF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 40px rgba(0, 102, 255, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Get Started
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLearnMore}
              style={{
                padding: '1.25rem 3rem',
                fontSize: '1.125rem',
                fontWeight: 600,
                background: 'transparent',
                color: '#FFFFFF',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '1rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer'
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon size={20} color={feature.color} />
                  </motion.div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                    {feature.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Floating Cards */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            display: 'flex',
            gap: '1rem'
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(0, 102, 255, 0.05))',
              border: '1px solid rgba(0, 102, 255, 0.3)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Cloud size={32} color="#0066FF" />
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            right: '8%',
            display: 'flex',
            gap: '1rem'
          }}
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(0, 102, 255, 0.05))',
              border: '1px solid rgba(0, 102, 255, 0.3)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Lock size={32} color="#0066FF" />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.4)'
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            © 2025 NotesHub. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                whileHover={{ color: '#0066FF' }}
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;