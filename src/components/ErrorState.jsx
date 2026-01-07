import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  icon = <IoWarningOutline aria-hidden="true" />,
  showRetry = true,
  onRetry,
  showReload = false,
  variant = "default",
  size = "medium"
}) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const sizeClasses = {
    small: 'error-state-small',
    medium: 'error-state-medium',
    large: 'error-state-large'
  };

  const variantClasses = {
    default: 'error-state-default',
    network: 'error-state-network',
    notFound: 'error-state-not-found',
    permission: 'error-state-permission'
  };

  return (
    <div className={`error-state ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <div className="error-content">
        <div className="error-icon">{icon}</div>
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message}</p>

        {(showRetry || showReload) && (
          <div className="error-actions">
            {showRetry && onRetry && (
              <button
                onClick={handleRetry}
                className="error-button retry-button"
              >
                Try Again
              </button>
            )}
            {showReload && (
              <button
                onClick={handleReload}
                className="error-button reload-button"
              >
                Reload Page
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .error-state {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }

        .error-state-small {
          padding: 1rem;
          min-height: 120px;
        }

        .error-state-medium {
          padding: 2rem;
          min-height: 200px;
        }

        .error-state-large {
          padding: 3rem;
          min-height: 300px;
        }

        .error-state-default {
          background: #f8f9fa;
          border-color: #dee2e6;
        }

        .error-state-network {
          background: #fff3cd;
          border-color: #ffeaa7;
        }

        .error-state-not-found {
          background: #e3f2fd;
          border-color: #bbdefb;
        }

        .error-state-permission {
          background: #ffebee;
          border-color: #ffcdd2;
        }

        .error-content {
          text-align: center;
          max-width: 400px;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .error-state-small .error-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }

        .error-state-large .error-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .error-title {
          color: #495057;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .error-state-small .error-title {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .error-state-large .error-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #6c757d;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          font-size: 0.875rem;
        }

        .error-state-small .error-message {
          font-size: 0.8125rem;
          margin-bottom: 1rem;
        }

        .error-state-large .error-message {
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .error-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .error-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .error-state-small .error-button {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          min-width: 100px;
        }

        .retry-button {
          background-color: #007bff;
          color: white;
        }

        .retry-button:hover {
          background-color: #0056b3;
          transform: translateY(-1px);
        }

        .reload-button {
          background-color: #6c757d;
          color: white;
        }

        .reload-button:hover {
          background-color: #545b62;
          transform: translateY(-1px);
        }

        .error-state-network .retry-button {
          background-color: #ffc107;
          color: #212529;
        }

        .error-state-network .retry-button:hover {
          background-color: #e0a800;
        }

        .error-state-not-found .retry-button {
          background-color: #17a2b8;
          color: white;
        }

        .error-state-not-found .retry-button:hover {
          background-color: #138496;
        }

        .error-state-permission .retry-button {
          background-color: #dc3545;
          color: white;
        }

        .error-state-permission .retry-button:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
          .error-state-medium {
            padding: 1.5rem 1rem;
          }

          .error-state-large {
            padding: 2rem 1rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .error-button {
            width: 100%;
            max-width: 200px;
          }
        }

        @media (max-width: 480px) {
          .error-state {
            margin: 0.5rem 0;
          }

          .error-content {
            max-width: 300px;
          }

          .error-icon {
            font-size: 2.5rem;
          }

          .error-title {
            font-size: 1.125rem;
          }

          .error-message {
            font-size: 0.8125rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .error-button {
            transition: none;
          }

          .error-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}