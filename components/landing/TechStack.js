'use client';

import { motion } from 'framer-motion';

export default function TechStack() {
  const technologies = [
    { name: 'Next.js 14', type: 'Framework' },
    { name: 'Gemini 2.5', type: 'AI Engine' },
    { name: 'Three.js', type: '3D Graphics' },
    { name: 'D3.js', type: 'Data Viz' },
    { name: 'OTX', type: 'Intel Feed' },
    { name: 'NVD CVE', type: 'Database' },
    { name: 'VirusTotal', type: 'Scanner' },
    { name: 'Shodan', type: 'Recon' },
  ];

  return (
    <section className="tech-stack-section">
      <div className="section-header">
        <h2 className="section-title">Powered by Elite Technologies</h2>
        <p className="section-subtitle">
          Built with a robust, asynchronous architecture designed for real-time threat ingestion.
        </p>
      </div>

      <div className="tech-marquee-container">
        <div className="tech-marquee">
          <div className="tech-marquee-content">
            {technologies.map((tech, i) => (
              <div key={i} className="tech-item glass-panel">
                <span className="tech-name">{tech.name}</span>
                <span className="tech-type text-data">{tech.type}</span>
              </div>
            ))}
            {/* Duplicate for infinite loop effect */}
            {technologies.map((tech, i) => (
              <div key={`dup-${i}`} className="tech-item glass-panel">
                <span className="tech-name">{tech.name}</span>
                <span className="tech-type text-data">{tech.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tech-stack-section {
          padding: 80px 0;
          overflow: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
          padding: 0 24px;
        }

        .section-title {
          font-size: var(--text-3xl);
          margin-bottom: 12px;
        }

        .section-subtitle {
          color: var(--text-secondary);
        }

        .tech-marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, var(--bg-primary) 0%, transparent 10%, transparent 90%, var(--bg-primary) 100%);
        }

        .tech-marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .tech-marquee::after, .tech-marquee::before {
          content: '';
          position: absolute;
          top: 0;
          width: 150px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .tech-marquee::before {
          left: 0;
          background: linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%);
        }

        .tech-marquee::after {
          right: 0;
          background: linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%);
        }

        .tech-marquee-content {
          display: flex;
          gap: 24px;
          padding: 20px 0;
          width: max-content;
          animation: marquee 30s linear infinite;
        }

        .tech-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 40px;
          border-radius: 8px;
          background: rgba(10, 22, 40, 0.5);
          min-width: 200px;
          transition: all 0.3s ease;
        }

        .tech-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--glow-cyan);
          border-color: var(--accent-cyan);
          background: rgba(10, 22, 40, 0.8);
        }

        .tech-name {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .tech-type {
          font-size: var(--text-xs);
          color: var(--accent-cyan);
          text-transform: uppercase;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* Translate half because of duplicates */
        }
      `}</style>
    </section>
  );
}
