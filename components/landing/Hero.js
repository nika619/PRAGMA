'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="cyber-grid absolute inset-0 z-0 opacity-20"></div>
      
      <div className="content-container z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="badge-container"
        >
          <div className="hero-badge">
            <ShieldCheck size={16} className="text-accent-cyan" />
            <span className="text-data text-xs">PRAGMA ENGINE v2.0 ACTIVE</span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-title"
        >
          See Every Threat.<br />
          <span className="text-gradient">Before It Strikes.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-subtitle"
        >
          An AI-powered cyber defense command center. We aggregate global threat feeds, 
          analyze them with Gemini, and provide real-time response playbooks.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="actions-container"
        >
          <Link href="/login" className="cta-button primary">
            <span className="btn-text text-data space-x-2">ENTER COMMAND CENTER</span>
            <ChevronRight size={18} className="btn-icon" />
          </Link>
          
          <Link href="/globe" className="cta-button secondary">
            <span className="btn-text">View 3D Threat Map</span>
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          padding: 0 24px;
        }

        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-0 { z-index: 0; }
        .z-10 { z-index: 10; position: relative; }
        .opacity-20 { opacity: 0.2; }

        .content-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 900px;
        }

        .badge-container {
          margin-bottom: 32px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          border-radius: 20px;
          color: var(--accent-cyan);
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
        }

        .text-accent-cyan { color: var(--accent-cyan); }
        .text-xs { font-size: var(--text-xs); }

        .hero-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 700px;
          margin-bottom: 48px;
          line-height: 1.6;
        }

        .actions-container {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          border-radius: 4px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .primary {
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--accent-cyan);
          color: var(--accent-cyan);
          box-shadow: var(--glow-cyan);
        }

        .primary:hover {
          background: rgba(0, 229, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.4);
        }

        .primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: skewX(-20deg);
          animation: shine 3s infinite;
        }

        .secondary {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--text-secondary);
        }

        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        @media (max-width: 768px) {
          .actions-container {
            flex-direction: column;
            width: 100%;
          }
          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
