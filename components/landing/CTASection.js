'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="cta-section">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="cta-container glass-panel"
      >
        <div className="cta-content">
          <div className="icon-wrapper">
            <Terminal size={32} className="text-accent-cyan" />
          </div>
          <h2 className="cta-title">Ready to Initialize PRAGMA?</h2>
          <p className="cta-subtitle">
            Enter the command center to access real-time threat intelligence and AI-powered defense tools.
          </p>
          
          <Link href="/login" className="launch-button">
            <span className="btn-text">LAUNCH INITIATIVE</span>
            <ArrowRight size={20} className="btn-icon" />
            <div className="btn-glow"></div>
          </Link>
        </div>
      </motion.div>

      <style jsx>{`
        .cta-section {
          padding: 100px 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cta-container {
          max-width: 800px;
          width: 100%;
          padding: 64px 32px;
          border-radius: 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(10, 22, 40, 0.8), rgba(5, 10, 18, 0.9));
          border: 1px solid rgba(0, 229, 255, 0.2);
        }

        .cta-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0, 229, 255, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          background: rgba(0, 229, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: var(--glow-cyan);
        }

        .text-accent-cyan {
          color: var(--accent-cyan);
        }

        .cta-title {
          font-size: var(--text-3xl);
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .cta-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: 40px;
        }

        .launch-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 229, 255, 0.15);
          border: 1px solid var(--accent-cyan);
          padding: 16px 40px;
          border-radius: 8px;
          color: var(--accent-cyan);
          font-weight: 700;
          font-family: var(--font-data);
          letter-spacing: 1px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .launch-button:hover {
          background: rgba(0, 229, 255, 0.25);
          transform: translateY(-2px);
          color: white;
          border-color: white;
        }

        .btn-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.4) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .launch-button:hover .btn-glow {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .cta-container {
            padding: 48px 24px;
          }
        }
      `}</style>
    </section>
  );
}
