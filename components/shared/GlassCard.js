export default function GlassCard({ children, className = '', title, action, onClick, style }) {
  return (
    <div
      className={`glass-card glass-panel ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{typeof title === 'string' ? title : <span>{title}</span>}</h3>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>

      <style jsx>{`
        .glass-card {
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 22, 40, 0.4);
        }

        .card-title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          flex: 1;
        }

        .card-content {
          padding: 20px;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
