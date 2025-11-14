import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Cloud } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '',
  fullPage = false,
  text = '',
  textPosition = 'below',
  withBackground = true
}) => {
  const sizeValues = {
    small: { spinner: 40, icon: 16 },
    medium: { spinner: 60, icon: 20 },
    large: { spinner: 80, icon: 24 },
    xlarge: { spinner: 120, icon: 32 }
  };

  const colorValues = {
    primary: '#0066FF',
    secondary: '#6666FF',
    light: '#FFFFFF',
    dark: '#333333',
    danger: '#FF4444',
    success: '#00CC88'
  };

  const spinnerSize = sizeValues[size].spinner;
  const iconSize = sizeValues[size].icon;
  const spinnerColor = colorValues[color];

  const LoadingContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`spinner-container ${textPosition === 'beside' ? 'horizontal' : ''} ${className}`}
      style={{
        display: 'flex',
        flexDirection: textPosition === 'beside' ? 'row' : 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: fullPage ? '2rem' : '1rem'
      }}
    >
      {/* Animated Spinner with Gradient */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: '50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Outer Ring */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, transparent, ${spinnerColor}, transparent)`,
            filter: 'blur(8px)',
            opacity: 0.6
          }}
        />
        
        {/* Main Spinner */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `3px solid transparent`,
            borderTop: `3px solid ${spinnerColor}`,
            borderRight: `3px solid ${spinnerColor}`,
            filter: 'drop-shadow(0 0 20px rgba(0, 102, 255, 0.3))'
          }}
        />
        
        {/* Inner Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {size === 'xlarge' || size === 'large' ? (
            <Sparkles size={iconSize} color={spinnerColor} />
          ) : (
            <Zap size={iconSize} color={spinnerColor} />
          )}
        </motion.div>

        {/* Pulsing Glow */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: spinnerColor,
            filter: 'blur(20px)',
            opacity: 0.3
          }}
        />
      </motion.div>

      {/* Loading Text */}
      {text && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="spinner-text"
          style={{
            color: spinnerColor,
            fontSize: size === 'xlarge' ? '1.25rem' : '1rem',
            fontWeight: 600,
            textAlign: 'center',
            textShadow: `0 0 20px ${spinnerColor}`
          }}
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );

  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: withBackground ? '#000000' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        {/* Animated Background Elements */}
        {withBackground && (
          <>
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
                top: '20%',
                right: '20%',
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${spinnerColor}33 0%, transparent 70%)`,
                filter: 'blur(60px)',
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
                bottom: '20%',
                left: '20%',
                width: '250px',
                height: '250px',
                background: `radial-gradient(circle, ${spinnerColor}22 0%, transparent 70%)`,
                filter: 'blur(60px)',
                pointerEvents: 'none'
              }}
            />
            
            {/* Background Grid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${spinnerColor}11 1px, transparent 1px),
                               linear-gradient(90deg, ${spinnerColor}11 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              opacity: 0.3
            }} />
          </>
        )}
        
        <LoadingContent />
      </motion.div>
    );
  }

  return <LoadingContent />;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  color: PropTypes.oneOf(['primary', 'secondary', 'light', 'dark', 'danger', 'success']),
  className: PropTypes.string,
  fullPage: PropTypes.bool,
  text: PropTypes.string,
  textPosition: PropTypes.oneOf(['below', 'beside']),
  withBackground: PropTypes.bool
};

export default LoadingSpinner;