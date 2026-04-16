'use client';

import dynamic from 'next/dynamic';
import { useThreatFeed } from '@/hooks/useThreatFeed';
import GlassCard from '@/components/shared/GlassCard';
import Badge from '@/components/shared/Badge';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Globe as GlobeIcon, Radio } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Dynamic import to prevent SSR issues with Three.js
const ThreatGlobe = dynamic(() => import('@/components/globe/ThreatGlobe'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner />
    </div>
  )
});

export default function GlobePage() {
  const { threats, metrics, isConnected } = useThreatFeed();
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredThreats = useMemo(() => {
    if (severityFilter === 'all') return threats;
    return threats.filter(t => t.severity === severityFilter);
  }, [threats, severityFilter]);

  const recentThreats = useMemo(() => filteredThreats.slice(0, 5), [filteredThreats]);

  return (
    <div className="globe-page">
      {/* Globe Container */}
      <div className="globe-container">
        <ThreatGlobe threats={filteredThreats} />

        {/* Overlay: Stats Bar */}
        <div className="stats-overlay">
          <div className="stat-item">
            <GlobeIcon size={14} />
            <span className="text-data">{filteredThreats.length} Active Vectors</span>
          </div>
          <div className="stat-item">
            <Radio size={14} />
            <span className="text-data">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            <div className={`dot ${isConnected ? 'online' : ''}`}></div>
          </div>
        </div>

        {/* Overlay: Filter Panel */}
        <div className="filter-panel glass-panel">
          <div className="filter-header">
            <Filter size={14} />
            <span className="text-data">FILTER</span>
          </div>
          <div className="filter-buttons">
            {['all', 'critical', 'high', 'medium', 'low'].map(s => (
              <button
                key={s}
                className={`filter-btn text-data ${severityFilter === s ? 'active' : ''}`}
                onClick={() => setSeverityFilter(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Overlay: Recent Events */}
        <div className="events-panel glass-panel">
          <div className="events-header text-data">RECENT EVENTS</div>
          <AnimatePresence initial={false}>
            {recentThreats.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="event-item"
              >
                <Badge variant={t.severity} size="sm">{t.severity[0].toUpperCase()}</Badge>
                <div className="event-details">
                  <span className="text-data event-ip">{t.source_ip}</span>
                  <span className="event-type">{t.type}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .globe-page {
          height: calc(100vh - 60px);
          position: relative;
          overflow: hidden;
        }

        .globe-container {
          width: 100%;
          height: 100%;
          position: relative;
          background: radial-gradient(ellipse at center, rgba(10, 22, 40, 0.3) 0%, rgba(5, 10, 18, 1) 70%);
        }

        .stats-overlay {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 24px;
          padding: 10px 24px;
          background: rgba(5, 10, 18, 0.8);
          border: 1px solid var(--border);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-cyan);
          font-size: 12px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
        }

        .dot.online {
          background: var(--low);
          box-shadow: 0 0 8px var(--low);
          animation: blink 1.5s infinite;
        }

        .filter-panel {
          position: absolute;
          bottom: 24px;
          left: 24px;
          padding: 16px;
          border-radius: 12px;
          z-index: 10;
          width: 200px;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--text-secondary);
          font-size: 11px;
          letter-spacing: 1.5px;
        }

        .filter-buttons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-btn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          letter-spacing: 1px;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: rgba(0, 229, 255, 0.1);
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }

        .events-panel {
          position: absolute;
          bottom: 24px;
          right: 24px;
          padding: 16px;
          border-radius: 12px;
          z-index: 10;
          width: 280px;
          max-height: 300px;
          overflow-y: auto;
        }

        .events-header {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .event-ip {
          font-size: 12px;
          color: var(--text-primary);
        }

        .event-type {
          font-size: 11px;
          color: var(--text-muted);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .filter-panel, .events-panel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
