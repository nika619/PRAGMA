'use client';

import GlassCard from '../shared/GlassCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import { ShieldAlert, Crosshair, Database, Activity } from 'lucide-react';

export default function MetricCards({ metrics, isConnected }) {
  const cards = [
    {
      title: 'Active Threats',
      value: metrics.total,
      icon: ShieldAlert,
      color: 'var(--accent-cyan)',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Critical Alerts',
      value: metrics.critical,
      icon: Crosshair,
      color: 'var(--critical)',
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'High Severity',
      value: metrics.high,
      icon: Activity,
      color: 'var(--high)',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Feeds Synced',
      value: isConnected ? 8 : 0,
      icon: Database,
      color: isConnected ? 'var(--low)' : 'var(--text-muted)',
      trend: isConnected ? 'Online' : 'Offline',
      trendUp: isConnected
    }
  ];

  return (
    <div className="metrics-grid">
      {cards.map((card, i) => (
        <GlassCard key={i} className="metric-card" style={{ borderTop: `2px solid ${card.color}` }}>
          <div className="card-inner">
            <div className="metric-info">
              <h4 className="metric-title">{card.title}</h4>
              <div className="metric-value text-data" style={{ color: card.color }}>
                <AnimatedCounter value={card.value} duration={1} />
              </div>
            </div>
            
            <div className="metric-aside">
              <div className="icon-wrapper" style={{ color: card.color, backgroundColor: `${card.color}20` }}>
                <card.icon size={24} />
              </div>
              <div className={`metric-trend ${card.trendUp ? 'up' : 'down'}`}>
                {card.trend}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}

      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .metric-card {
          position: relative;
          overflow: hidden;
        }

        .card-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .metric-title {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .metric-value {
          font-size: var(--text-3xl);
          font-weight: 700;
          line-height: 1;
        }

        .metric-aside {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-trend {
          font-size: var(--text-xs);
          font-family: var(--font-data);
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .metric-trend.up {
          background: rgba(0, 230, 118, 0.1);
          color: var(--low);
        }

        .metric-trend.down {
          background: rgba(255, 109, 0, 0.1);
          color: var(--high);
        }

        @media (max-width: 1200px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
