export default function LoadingSpinner({ size = 24, label = 'Processing...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-inner"></div>
        <div className="spinner-outer"></div>
      </div>
      {label && <span className="spinner-label text-data">{label}</span>}

      <style jsx>{`
        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .spinner {
          width: ${size}px;
          height: ${size}px;
          position: relative;
        }

        .spinner-inner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid transparent;
          border-top-color: var(--accent-cyan);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
        }

        .spinner-outer {
          position: absolute;
          top: -4px;
          left: -4px;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          border: 1px solid transparent;
          border-bottom-color: rgba(0, 229, 255, 0.5);
          border-right-color: rgba(0, 229, 255, 0.3);
          border-radius: 50%;
          animation: spin-reverse 2s linear infinite;
        }

        .spinner-label {
          color: var(--accent-cyan);
          font-size: var(--text-xs);
          opacity: 0.8;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
