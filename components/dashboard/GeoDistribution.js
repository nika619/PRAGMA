'use client';

import { useMemo } from 'react';
import GlassCard from '../shared/GlassCard';
import { motion } from 'framer-motion';

export default function GeoDistribution({ threats }) {
  const regionData = useMemo(() => {
    if (!threats || threats.length === 0) return [];
    const counts = {};
    threats.forEach(t => {
      const key = t.countryCode || 'UN';
      if (!counts[key]) counts[key] = { code: key, country: t.country || 'Unknown', count: 0 };
      counts[key].count += 1;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [threats]);

  const maxCount = useMemo(() => Math.max(...regionData.map(r => r.count), 1), [regionData]);

  return (
    <GlassCard title="Geographic Distribution">
      <div className="geo-container">
        {regionData.length === 0 ? (
          <div className="empty-text text-data">Awaiting geolocation data...</div>
        ) : (
          <div className="geo-list">
            {regionData.map((region, i) => (
              <motion.div
                key={region.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="geo-row"
              >
                <div className="geo-info">
                  <span className="country-code text-data">{region.code}</span>
                  <span className="country-name">{region.country}</span>
                </div>
                <div className="bar-track">
                  <motion.div
                    className="bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(region.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                </div>
                <span className="geo-count text-data">{region.count}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .geo-container {
          min-height: 220px;
          position: relative;
        }
        .empty-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-muted);
          font-size: var(--text-sm);
        }
        .geo-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .geo-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .geo-info {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 120px;
          flex-shrink: 0;
        }
        .country-code {
          font-size: 10px;
          padding: 2px 5px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          color: var(--text-secondary);
          letter-spacing: 1px;
        }
        .country-name {
          font-size: var(--text-sm);
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bar-track {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
        }
        .geo-count {
          width: 36px;
          text-align: right;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--accent-cyan);
        }
      `}</style>
    </GlassCard>
  );
}
