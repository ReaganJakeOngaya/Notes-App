import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to error monitoring service
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2 className="error-title">Something went wrong</h2>
            {this.props.fallback || (
              <>
                <p className="error-message">
                  {this.state.error?.toString() || 'An unexpected error occurred'}
                </p>
                {this.props.showReset && (
                  <button 
                    className="btn btn-primary"
                    onClick={this.handleReset}
                  >
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  showReset: PropTypes.bool,
  onError: PropTypes.func,
  onReset: PropTypes.func
};

ErrorBoundary.defaultProps = {
  showReset: true
};

export default ErrorBoundary;