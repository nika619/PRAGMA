'use client';

import { motion } from 'framer-motion';
import { Activity, Globe, Crosshair, ShieldAlert, Database, BookOpen } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Activity,
      title: 'Command Center',
      description: 'Real-time threat monitoring dashboard aggregating global attacks with severity scoring and trend analysis.',
      color: 'var(--accent-cyan)'
    },
    {
      icon: Globe,
      title: '3D Threat Globe',
      description: 'Interactive visualization mapping incoming attacks to geographical locations across the globe.',
      color: 'var(--accent-purple)'
    },
    {
      icon: Crosshair,
      title: 'AI Threat Analyzer',
      description: 'Powered by Gemini 2.5 Flash, perform deep NLP-based analysis on IPs, hashes, URLs, and text.',
      color: 'var(--critical)'
    },
    {
      icon: ShieldAlert,
      title: 'Attack Surface Scanner',
      description: 'Complete reconnaissance on any domain or IP, revealing open ports, technologies, and SSL risks.',
      color: 'var(--high)'
    },
    {
      icon: Database,
      title: 'Vulnerability Index',
      description: 'Examine CVE databases enriched with AI-generated plain-English explanations and exploit statuses.',
      color: 'var(--medium)'
    },
    {
      icon: BookOpen,
      title: 'Incident Playbooks',
      description: 'Instantly generate step-by-step incident response playbooks using advanced AI context modeling.',
      color: 'var(--low)'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-header">
        <h2 className="section-title">A New Paradigm in Cyber Defense</h2>
        <p className="section-subtitle">
          PRAGMA unifies fragmented data streams into a single, cohesive intelligence platform.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="feature-card glass-panel"
            style={{ '--feature-color': feature.color }}
          >
            <div className="feature-icon-wrapper">
              <feature.icon size={28} className="feature-icon" />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <div className="feature-glow"></div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .features-section {
          padding: 100px 24px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-title {
          font-size: var(--text-4xl);
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          padding: 32px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
          background: rgba(10, 22, 40, 0.4);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: var(--feature-color);
        }

        .feature-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--feature-color);
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px var(--feature-color);
        }

        .feature-title {
          font-size: var(--text-xl);
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .feature-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top left, var(--feature-color), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 1;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .feature-card:hover .feature-glow {
          opacity: 0.15;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
