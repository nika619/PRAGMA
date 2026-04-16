'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '../shared/AnimatedCounter';

export default function Stats() {
  const stats = [
    { label: 'Threats Detected (24h)', value: 124892, suffix: '+' },
    { label: 'Active Attacks Tracked', value: 342, suffix: '' },
    { label: 'Vulnerabilities Indexed', value: 248921, suffix: '' },
    { label: 'Countries Protected', value: 184, suffix: '' }
  ];

  return (
    <div className="stats-section">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="stat-card glass-panel"
          >
            <div className="stat-value text-data">
              <AnimatedCounter value={stat.value} duration={2.5} />
              <span className="stat-suffix">{stat.suffix}</span>
            </div>
            <div className="stat-label uppercase tracking-widest">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .stats-section {
          padding: 64px 24px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .stat-card {
          padding: 32px 24px;
          text-align: center;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          background: rgba(10, 22, 40, 0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 229, 255, 0.1);
          border-color: rgba(0, 229, 255, 0.3);
        }

        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--accent-cyan);
          transition: width 0.3s ease;
          box-shadow: var(--glow-cyan);
        }

        .stat-card:hover::after {
          width: 100%;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          text-shadow: var(--glow-cyan);
        }

        .stat-suffix {
          color: var(--accent-cyan);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 2px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
