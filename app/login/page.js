'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Fingerprint, KeyRound, ChevronRight, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="cyber-grid absolute inset-0 z-0 opacity-20"></div>
      
      <div className="login-container z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="brand-header">
            <div className="logo-box">
              <Shield size={32} className="text-cyan" />
            </div>
            <h1 className="brand-name">PRAGMA</h1>
            <p className="brand-sub text-data">ENTERPRISE COMMAND CENTER</p>
          </div>

          <GlassCard className="login-card">
            <h2 className="login-title">Secure Access</h2>
            <p className="login-desc text-data">Authenticate via identity provider</p>

            <div className="sso-providers">
              <button className="sso-btn okta" onClick={handleLogin}>
                <div className="sso-icon-box"><KeyRound size={16} /></div>
                <span>Continue with Okta SSO</span>
                <ChevronRight size={16} className="arrow" />
              </button>
              
              <button className="sso-btn entra" onClick={handleLogin}>
                <div className="sso-icon-box"><Fingerprint size={16} /></div>
                <span>Continue with Microsoft Entra</span>
                <ChevronRight size={16} className="arrow" />
              </button>
            </div>

            <div className="divider">
              <span className="text-data">OR LOCAL ADMIN</span>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <input type="email" placeholder="Admin Email" className="auth-input text-data" />
              </div>
              <div className="input-group">
                <input type="password" placeholder="Password" className="auth-input text-data" />
              </div>
              
              <button type="submit" className="submit-btn text-data">
                <span>AUTHORIZE</span>
                <Shield size={16} />
              </button>
            </form>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="security-badges text-data"
        >
          <div className="badge"><CheckCircle2 size={12}/> SOC2 TYPE II</div>
          <div className="badge"><CheckCircle2 size={12}/> ISO 27001</div>
          <div className="badge"><CheckCircle2 size={12}/> FEDRAMP HIGH</div>
        </motion.div>
      </div>

      <style jsx>{`
        .login-page {
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
        
        .login-container {
          width: 100%;
          max-width: 440px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }
        .logo-box {
          width: 64px;
          height: 64px;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: var(--glow-cyan);
        }
        .text-cyan { color: var(--accent-cyan); }
        .brand-name {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 4px;
          margin-bottom: 4px;
          background: linear-gradient(135deg, #fff, var(--accent-cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-sub {
          font-size: 10px;
          color: var(--text-secondary);
          letter-spacing: 3px;
        }

        :global(.login-card) {
          width: 100%;
          padding: 32px !important;
        }

        .login-title {
          font-size: 20px;
          margin-bottom: 6px;
          text-align: center;
        }
        .login-desc {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 1px;
        }

        .sso-providers {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .sso-btn {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          position: relative;
        }
        .sso-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: var(--accent-cyan);
        }
        .sso-icon-box {
          display: flex;align-items: center;justify-content: center;
          width: 32px; height: 32px;
          border-radius: 6px;
          background: rgba(0,0,0,0.2);
          margin-right: 12px;
        }
        .okta .sso-icon-box { color: #007dc1; }
        .entra .sso-icon-box { color: #00a4ef; }
        .arrow {
          margin-left: auto;
          color: var(--text-muted);
          transition: transform 0.2s;
        }
        .sso-btn:hover .arrow { transform: translateX(4px); color: var(--accent-cyan); }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; border-bottom: 1px solid var(--border);
        }
        .divider span {
          padding: 0 10px; color: var(--text-muted); font-size: 10px; letter-spacing: 1px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .auth-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 13px;
        }
        .auth-input:focus {
          outline: none; border-color: var(--accent-cyan); box-shadow: 0 0 10px rgba(0,229,255,0.1);
        }
        .submit-btn {
          margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px;
          background: rgba(0, 229, 255, 0.15);
          border: 1px solid var(--accent-cyan);
          border-radius: 6px;
          color: var(--accent-cyan);
          font-weight: 700;
          letter-spacing: 2px;
          transition: all 0.2s;
        }
        .submit-btn:hover {
          background: rgba(0, 229, 255, 0.25);
          box-shadow: 0 0 15px rgba(0,229,255,0.3);
        }

        .security-badges {
          margin-top: 32px;
          display: flex;
          gap: 16px;
          font-size: 10px;
          color: var(--text-muted);
        }
        .badge {
          display: flex; align-items: center; gap: 4px;
        }
      `}</style>
    </div>
  );
}
