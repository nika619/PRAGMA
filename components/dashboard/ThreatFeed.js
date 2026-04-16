'use client';

import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import Badge from '../shared/Badge';
import { AlertCircle } from 'lucide-react';
import EmptyState from '../shared/EmptyState';

export default function ThreatFeed({ threats }) {
  if (!threats || threats.length === 0) {
    return (
      <GlassCard title="Live Threat Feed" className="threat-feed-card h-full">
        <EmptyState title="Awaiting Data" description="Listening for incoming threat intelligence..." />
      </GlassCard>
    );
  }

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <GlassCard 
      title={<div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--high)] animate-pulse"></div>Live Threat Feed</div>} 
      className="threat-feed-card h-full flex flex-col"
    >
      <div className="feed-header text-data">
        <div className="w-20">TIME</div>
        <div className="flex-1">SOURCE IP</div>
        <div className="w-24">TYPE</div>
        <div className="w-24 text-right">SEVERITY</div>
      </div>
      
      <div className="feed-list-container">
        <div className="feed-list">
          <AnimatePresence initial={false}>
            {threats.slice(0, 50).map((threat) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, height: 0, scale: 0.9, backgroundColor: 'rgba(0, 229, 255, 0.4)' }}
                animate={{ opacity: 1, height: 'auto', scale: 1, backgroundColor: 'rgba(0, 0, 0, 0)' }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.4 }}
                className="feed-item"
              >
                <div className="feed-time text-data">{formatTime(threat.timestamp)}</div>
                
                <div className="feed-source">
                  <span className="text-data">{threat.source_ip}</span>
                  <span className="country-code" title={threat.country}>{threat.countryCode}</span>
                </div>
                
                <div className="feed-type">{threat.type}</div>
                
                <div className="feed-severity flex justify-end">
                  <Badge variant={threat.severity}>
                    {threat.severity}
                  </Badge>
                </div>
                
                {threat.isSimulated && (
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2 opacity-50" title="Simulated Data">
                    <AlertCircle size={12} className="text-[var(--text-muted)]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        :global(.threat-feed-card .card-content) {
          padding: 0;
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .feed-header {
          display: flex;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          font-size: 11px;
          color: var(--text-secondary);
          background: rgba(5, 10, 18, 0.4);
        }

        .feed-list-container {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .feed-list {
          padding: 8px 12px;
          height: 100%;
          overflow-y: auto;
          /* mask-image: linear-gradient(to bottom, black 90%, transparent 100%); */
        }

        /* Minimal scrollbar */
        .feed-list::-webkit-scrollbar {
          width: 4px;
        }
        .feed-list::-webkit-scrollbar-thumb {
          background: rgba(0, 229, 255, 0.2);
          border-radius: 4px;
        }

        .feed-item {
          display: flex;
          align-items: center;
          padding: 12px 8px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
          position: relative;
          transition: background 0.2s ease;
        }

        .feed-item:hover {
          background: rgba(255, 255, 255, 0.03) !important;
        }

        .feed-time {
          width: 80px;
          color: var(--text-muted);
          font-size: 12px;
        }

        .feed-source {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .country-code {
          font-size: 10px;
          padding: 2px 4px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .feed-type {
          width: 96px;
          font-size: 13px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Tailwind classes mapped for local use if tailwind is totally disabled but we missed some */
        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .w-2 { width: 0.5rem; }
        .h-2 { height: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .flex-1 { flex: 1 1 0%; }
        .flex-col { flex-direction: column; }
        .h-full { height: 100%; }
        .justify-end { justify-content: flex-end; }
        .absolute { position: absolute; }
        .right-0 { right: 0; }
        .top-0 { top: 0; }
        .bottom-0 { bottom: 0; }
        .pr-2 { padding-right: 0.5rem; }
        .opacity-50 { opacity: 0.5; }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .animate-pulse { animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </GlassCard>
  );
}
