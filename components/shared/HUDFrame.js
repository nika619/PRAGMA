export default function HUDFrame({ children, className = '', color = 'var(--accent-cyan)' }) {
  return (
    <div className={`hud-frame ${className}`}>
      <div className="corner top-left"></div>
      <div className="corner top-right"></div>
      <div className="corner bottom-left"></div>
      <div className="corner bottom-right"></div>
      
      <div className="content">
        {children}
      </div>

      <style jsx>{`
        .hud-frame {
          position: relative;
          padding: 1px;
        }

        .content {
          background: rgba(10, 22, 40, 0.6);
          backdrop-filter: blur(10px);
          padding: 16px;
          height: 100%;
        }

        .corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid ${color};
          z-index: 10;
        }

        .top-left {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .top-right {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        .bottom-left {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        .bottom-right {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }
      `}</style>
    </div>
  );
}
