'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="cyber-grid absolute inset-0 z-0 opacity-20"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="content-container z-10"
      >
        <GlassCard className="error-card">
          <div className="error-content">
            <div className="error-icon">
              <ShieldAlert size={64} style={{ color: 'var(--critical)' }} />
            </div>
            
            <h1 className="error-code text-data">ERROR 404</h1>
            <h2 className="error-title">Target Not Found</h2>
            
            <p className="error-desc text-data">
              The requested system resource or directory does not exist in the active zone. 
              It may have been secured, relocated, or purged from the network.
            </p>

            <div className="actions">
              <Link href="/dashboard" className="return-btn text-data">
                <Home size={18} />
                <span>RETURN TO COMMAND CENTER</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-color: var(--bg-primary);
          overflow: hidden;
        }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-0 { z-index: 0; }
        .z-10 { z-index: 10; position: relative; }
        .opacity-20 { opacity: 0.2; }
        .content-container {
          width: 100%;
          max-width: 600px;
          padding: 24px;
        }
        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 16px;
        }
        .error-icon {
          margin-bottom: 24px;
          animation: pulse-glow 2s infinite;
          border-radius: 50%;
        }
        .error-code {
          font-size: 64px;
          font-weight: 800;
          color: var(--critical);
          letter-spacing: 4px;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(255, 23, 68, 0.4);
        }
        .error-title {
          font-size: 24px;
          color: var(--text-primary);
          margin-bottom: 24px;
        }
        .error-desc {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 450px;
        }
        .return-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--accent-cyan);
          color: var(--accent-cyan);
          border-radius: 4px;
          transition: all 0.3s;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
        }
        .return-btn:hover {
          background: rgba(0, 229, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0, 229, 255, 0.4);
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 23, 68, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(255, 23, 68, 0); }
        }
      `}</style>
    </div>
  );
}
