export default function Badge({ children, variant = 'info', outline = false, className = '' }) {
  const isOutline = outline ? 'outline' : 'solid';
  
  return (
    <span className={`badge badge-${variant} badge-${isOutline} ${className}`}>
      {children}
      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: var(--text-xs);
          font-weight: 600;
          font-family: var(--font-ui);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* Solid Variants */
        .badge-solid.badge-critical {
          background-color: rgba(255, 23, 68, 0.2);
          color: #ff4d6d;
          border: 1px solid rgba(255, 23, 68, 0.4);
        }

        .badge-solid.badge-high {
          background-color: rgba(255, 109, 0, 0.2);
          color: #ff9100;
          border: 1px solid rgba(255, 109, 0, 0.4);
        }

        .badge-solid.badge-medium {
          background-color: rgba(255, 234, 0, 0.2);
          color: #ffee58;
          border: 1px solid rgba(255, 234, 0, 0.4);
        }

        .badge-solid.badge-low {
          background-color: rgba(0, 230, 118, 0.2);
          color: #69f0ae;
          border: 1px solid rgba(0, 230, 118, 0.4);
        }

        .badge-solid.badge-info {
          background-color: rgba(68, 138, 255, 0.2);
          color: #82b1ff;
          border: 1px solid rgba(68, 138, 255, 0.4);
        }

        /* Outline Variants */
        .badge-outline.badge-critical {
          border: 1px solid var(--critical);
          color: var(--critical);
        }

        .badge-outline.badge-high {
          border: 1px solid var(--high);
          color: var(--high);
        }

        .badge-outline.badge-medium {
          border: 1px solid var(--medium);
          color: var(--medium);
        }

        .badge-outline.badge-low {
          border: 1px solid var(--low);
          color: var(--low);
        }

        .badge-outline.badge-info {
          border: 1px solid var(--info);
          color: var(--info);
        }
      `}</style>
    </span>
  );
}
