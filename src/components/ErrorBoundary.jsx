import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to monitoring service in production
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
      // Example: reportError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // Use custom fallback component if provided
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
          />
        );
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened. Please try again.</p>
            
            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="retry-btn"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="reload-btn"
              >
                Reload Page
              </button>
            </div>

            {showDetails && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 300px;
              padding: 2rem;
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 0.5rem;
              margin: 1rem;
            }

            .error-content {
              text-align: center;
              max-width: 500px;
            }

            .error-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }

            .error-content h2 {
              color: #dc3545;
              margin-bottom: 1rem;
              font-size: 1.5rem;
            }

            .error-content p {
              color: #6c757d;
              margin-bottom: 2rem;
              line-height: 1.5;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 2rem;
            }

            .retry-btn,
            .reload-btn {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 0.375rem;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.2s ease;
            }

            .retry-btn {
              background-color: #007bff;
              color: white;
            }

            .retry-btn:hover {
              background-color: #0056b3;
            }

            .reload-btn {
              background-color: #6c757d;
              color: white;
            }

            .reload-btn:hover {
              background-color: #545b62;
            }

            .error-details {
              text-align: left;
              margin-top: 2rem;
              padding: 1rem;
              background-color: #f1f3f4;
              border-radius: 0.375rem;
              border: 1px solid #dee2e6;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 500;
              color: #495057;
              margin-bottom: 1rem;
            }

            .error-stack {
              font-family: 'Courier New', monospace;
              font-size: 0.75rem;
              color: #dc3545;
              white-space: pre-wrap;
              overflow-x: auto;
              max-height: 200px;
              overflow-y: auto;
            }

            @media (max-width: 768px) {
              .error-boundary {
                margin: 0.5rem;
                padding: 1rem;
              }

              .error-actions {
                flex-direction: column;
                align-items: center;
              }

              .retry-btn,
              .reload-btn {
                width: 100%;
                max-width: 200px;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;