import React from 'react';

export default function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false,
  color = 'primary',
  showProgress = false,
  progress = 0
}) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    warning: 'spinner-warning',
    danger: 'spinner-danger'
  };

  const containerClass = overlay ? 'loading-spinner-overlay' : 'loading-spinner-container';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        <div className="spinner"></div>
        {showProgress && (
          <div className="progress-ring">
            <svg className="progress-svg" viewBox="0 0 36 36">
              <path
                className="progress-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="progress-bar"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="progress-text">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
      {message && <p className="loading-message">{message}</p>}
      
      <style jsx>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          min-height: 120px;
        }

        .loading-spinner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .spinner {
          border: 3px solid #f3f3f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: relative;
        }

        .spinner-small .spinner {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        .spinner-medium .spinner {
          width: 40px;
          height: 40px;
          border-width: 3px;
        }

        .spinner-large .spinner {
          width: 60px;
          height: 60px;
          border-width: 4px;
        }

        .spinner-primary .spinner {
          border-top-color: #007bff;
        }

        .spinner-secondary .spinner {
          border-top-color: #6c757d;
        }

        .spinner-success .spinner {
          border-top-color: #28a745;
        }

        .spinner-warning .spinner {
          border-top-color: #ffc107;
        }

        .spinner-danger .spinner {
          border-top-color: #dc3545;
        }

        .progress-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .progress-svg {
          width: 60px;
          height: 60px;
          transform: rotate(-90deg);
        }

        .progress-bg {
          fill: none;
          stroke: #f3f3f3;
          stroke-width: 2;
        }

        .progress-bar {
          fill: none;
          stroke: #007bff;
          stroke-width: 2;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          font-size: 0.75rem;
          font-weight: 600;
          color: #495057;
        }

        .loading-message {
          margin-top: 1rem;
          color: #6c757d;
          font-size: 0.875rem;
          text-align: center;
          max-width: 300px;
          line-height: 1.4;
        }

        .loading-spinner-overlay .loading-message {
          color: #495057;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (prefers-reduced-motion: reduce) {
          .spinner {
            animation: none;
            border-top-color: #007bff;
          }
          
          .loading-message {
            animation: pulse 2s infinite;
          }
        }

        @media (max-width: 768px) {
          .loading-spinner-container {
            padding: 1rem;
            min-height: 80px;
          }

          .loading-message {
            font-size: 0.8125rem;
          }

          .spinner-large .spinner {
            width: 50px;
            height: 50px;
            border-width: 3px;
          }

          .progress-svg {
            width: 50px;
            height: 50px;
          }
        }

        @media (max-width: 480px) {
          .loading-spinner-container {
            padding: 0.75rem;
            min-height: 60px;
          }

          .spinner-medium .spinner {
            width: 32px;
            height: 32px;
            border-width: 2px;
          }

          .loading-message {
            font-size: 0.75rem;
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}