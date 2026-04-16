import { SearchX } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = SearchX, 
  title = 'No Data Found', 
  description = 'There is currently no data available to display.',
  action = null
}) {
  return (
    <div className="empty-state">
      <div className="icon-container">
        <Icon size={48} className="empty-icon" strokeWidth={1} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && <div className="empty-action">{action}</div>}

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
          width: 100%;
          height: 100%;
          min-height: 300px;
        }

        .icon-container {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: rgba(10, 22, 40, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px dashed var(--border);
        }

        .empty-icon {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .empty-title {
          font-size: var(--text-xl);
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-description {
          color: var(--text-secondary);
          max-width: 400px;
          margin-bottom: 24px;
        }

        .empty-action {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
