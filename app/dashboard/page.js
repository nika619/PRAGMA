'use client';

import { useThreatFeed } from '@/hooks/useThreatFeed';
import MetricCards from '@/components/dashboard/MetricCards';
import ThreatFeed from '@/components/dashboard/ThreatFeed';
import SeverityChart from '@/components/dashboard/SeverityChart';
import AttackTimeline from '@/components/dashboard/AttackTimeline';
import TopAttackers from '@/components/dashboard/TopAttackers';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import ThreatCategories from '@/components/dashboard/ThreatCategories';
import GeoDistribution from '@/components/dashboard/GeoDistribution';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function DashboardPage() {
  const { threats, metrics, isConnected } = useThreatFeed();

  return (
    <div className="dashboard-page">
      {/* System Status Bar */}
      <div className="status-bar">
        <div className="status-indicator">
          <div className={`status-dot ${isConnected ? 'online' : 'offline'}`}></div>
          <span className="text-data">{isConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING...'}</span>
        </div>
        <div className="status-meta text-data">
          <span>PRAGMA ENGINE v2.0</span>
          <span className="separator">|</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span className="separator">|</span>
          <span>{threats.length} events tracked</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <ErrorBoundary>
        <MetricCards metrics={metrics} isConnected={isConnected} />
      </ErrorBoundary>

      {/* Main Grid: Feed + Charts */}
      <div className="dashboard-grid">
        {/* Left Column: Live Feed */}
        <div className="col-feed">
          <ErrorBoundary>
            <ThreatFeed threats={threats} />
          </ErrorBoundary>
        </div>

        {/* Right Column: Charts Stack */}
        <div className="col-charts">
          <ErrorBoundary>
            <SeverityChart metrics={metrics} />
          </ErrorBoundary>
          <ErrorBoundary>
            <ThreatCategories threats={threats} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Timeline Full Width */}
      <ErrorBoundary>
        <AttackTimeline threats={threats} />
      </ErrorBoundary>

      {/* Bottom Row: Geo + Attackers + Alerts */}
      <div className="dashboard-bottom-grid">
        <ErrorBoundary>
          <GeoDistribution threats={threats} />
        </ErrorBoundary>
        <ErrorBoundary>
          <TopAttackers threats={threats} />
        </ErrorBoundary>
        <ErrorBoundary>
          <RecentAlerts threats={threats} />
        </ErrorBoundary>
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 100%;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: rgba(10, 22, 40, 0.5);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
          font-size: var(--text-xs);
          letter-spacing: 1.5px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: var(--low);
          box-shadow: 0 0 10px var(--low);
          animation: pulse-glow 2s infinite;
        }

        .status-dot.offline {
          background: var(--text-muted);
        }

        .status-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 11px;
        }

        .separator {
          color: var(--border);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          min-height: 500px;
        }

        .col-feed {
          display: flex;
          flex-direction: column;
        }

        .col-charts {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-bottom-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px var(--low); }
          50% { opacity: 0.6; box-shadow: 0 0 5px var(--low); }
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
