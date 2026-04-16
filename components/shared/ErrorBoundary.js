'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-state">
          <div className="icon-container">
            <AlertTriangle size={48} className="error-icon" strokeWidth={1} />
          </div>
          <h3 className="error-title">Component Error</h3>
          <p className="error-description">
            {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
          </p>
          <button 
            className="retry-button"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>

          <style jsx>{`
            .error-boundary-state {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 48px 24px;
              text-align: center;
              width: 100%;
              height: 100%;
              min-height: 250px;
              background: rgba(255, 23, 68, 0.05);
              border: 1px solid rgba(255, 23, 68, 0.2);
              border-radius: 8px;
            }

            .icon-container {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: rgba(255, 23, 68, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 24px;
            }

            .error-icon {
              color: var(--critical);
            }

            .error-title {
              font-size: var(--text-lg);
              color: var(--critical);
              margin-bottom: 8px;
            }

            .error-description {
              color: var(--text-secondary);
              max-width: 400px;
              margin-bottom: 24px;
              font-family: var(--font-data);
              font-size: var(--text-sm);
              word-break: break-all;
            }

            .retry-button {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              background: rgba(255, 23, 68, 0.2);
              border: 1px solid var(--critical);
              border-radius: 4px;
              color: var(--text-primary);
              font-size: var(--text-sm);
              transition: all 0.2s ease;
            }

            .retry-button:hover {
              background: rgba(255, 23, 68, 0.4);
              box-shadow: 0 0 10px rgba(255, 23, 68, 0.3);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
