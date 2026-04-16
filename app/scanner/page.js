'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/shared/GlassCard';
import Badge from '@/components/shared/Badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Search, Server, Shield, Lock, CheckCircle, XCircle, AlertTriangle, Cpu, Scan } from 'lucide-react';

export default function ScannerPage() {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!target.trim()) return;
    setIsScanning(true);
    setResult(null);
    setProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim(), type: 'full' })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error("Scan failed:", e);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setIsScanning(false), 500);
    }
  };

  const getPortStateColor = (state) => state === 'open' ? 'var(--high)' : 'var(--low)';
  const getSSLColor = (grade) => {
    if (grade === 'A' || grade === 'A+') return 'var(--low)';
    if (grade === 'B' || grade === 'C') return 'var(--medium)';
    return 'var(--critical)';
  };

  const headerCheck = (value) => {
    if (value === 'MISSING') return { icon: XCircle, color: 'var(--critical)', label: 'Missing' };
    return { icon: CheckCircle, color: 'var(--low)', label: value };
  };

  return (
    <div className="scanner-page">
      <div className="page-header">
        <h1 className="page-title">Attack Surface Scanner</h1>
        <p className="page-subtitle">Comprehensive reconnaissance on any domain or IP address</p>
      </div>

      {/* Scan Input */}
      <GlassCard>
        <div className="scan-input-area">
          <div className="input-wrapper">
            <Scan size={18} className="input-icon" />
            <input
              type="text"
              className="scan-input text-data"
              placeholder="Enter domain or IP (e.g. scanme.nmap.org)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
          </div>
          <button className="scan-button" onClick={handleScan} disabled={isScanning || !target.trim()}>
            {isScanning ? <LoadingSpinner size="small" /> : <><Search size={18} /><span>SCAN TARGET</span></>}
          </button>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="progress-container">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="progress-text text-data">{Math.round(progress)}%</span>
          </div>
        )}
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="scan-results"
          >
            {/* Summary Row */}
            <div className="summary-row">
              <GlassCard>
                <div className="summary-item">
                  <Server size={24} className="text-cyan" />
                  <div>
                    <div className="summary-label">Target</div>
                    <div className="summary-value text-data">{result.domain || result.ip}</div>
                  </div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="summary-item">
                  <AlertTriangle size={24} style={{ color: getSSLColor('F') }} />
                  <div>
                    <div className="summary-label">Risk Score</div>
                    <div className="summary-value text-data" style={{ color: 'var(--high)' }}>{result.riskScore}/100</div>
                  </div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="summary-item">
                  <Cpu size={24} className="text-cyan" />
                  <div>
                    <div className="summary-label">Open Ports</div>
                    <div className="summary-value text-data">{result.ports?.length || 0}</div>
                  </div>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="summary-item">
                  <Lock size={24} style={{ color: getSSLColor(result.ssl?.grade) }} />
                  <div>
                    <div className="summary-label">SSL Grade</div>
                    <div className="summary-value text-data" style={{ color: getSSLColor(result.ssl?.grade) }}>{result.ssl?.grade}</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* AI Summary */}
            {result.aiSummary && (
              <GlassCard title="AI Risk Assessment">
                <p className="ai-summary">{result.aiSummary}</p>
              </GlassCard>
            )}

            {/* Port Results + Tech Detection */}
            <div className="detail-grid">
              <GlassCard title="Open Ports">
                <div className="ports-table">
                  <div className="port-header text-data">
                    <span>PORT</span><span>PROTOCOL</span><span>SERVICE</span><span>STATE</span><span>VERSION</span>
                  </div>
                  {(result.ports || []).map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="port-row"
                    >
                      <span className="text-data port-num">{p.port}</span>
                      <span className="text-data">{p.protocol}</span>
                      <span>{p.service}</span>
                      <Badge variant={p.state === 'open' ? 'high' : 'low'}>{p.state}</Badge>
                      <span className="port-version">{p.version || '—'}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <div className="right-col">
                <GlassCard title="Technologies Detected">
                  <div className="tech-list">
                    {(result.tech || []).map((t, i) => (
                      <div key={i} className="tech-item">
                        <Cpu size={16} className="text-cyan" />
                        <div>
                          <div className="tech-name">{t.name}</div>
                          <div className="tech-type">{t.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard title="Security Headers">
                  <div className="headers-list">
                    {Object.entries(result.headers || {}).map(([key, value], i) => {
                      const check = headerCheck(value);
                      return (
                        <div key={i} className="header-item">
                          <check.icon size={16} style={{ color: check.color, flexShrink: 0 }} />
                          <div className="header-info">
                            <span className="header-name text-data">{key}</span>
                            <span className="header-val" style={{ color: check.color }}>{check.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scanner-page { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; }
        .page-header { margin-bottom: 8px; }
        .page-title { font-size: var(--text-3xl); margin-bottom: 8px; }
        .page-subtitle { color: var(--text-secondary); }

        .scan-input-area { display: flex; gap: 12px; }
        .input-wrapper { flex: 1; position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 14px; color: var(--text-muted); }
        .scan-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(5, 10, 18, 0.6);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: var(--text-base);
        }
        .scan-input:focus { outline: none; border-color: var(--accent-cyan); box-shadow: 0 0 10px rgba(0,229,255,0.15); }
        .scan-input::placeholder { color: var(--text-muted); }
        .scan-button {
          display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: rgba(0, 229, 255, 0.15);
          border: 1px solid var(--accent-cyan); border-radius: 6px; color: var(--accent-cyan); font-weight: 700;
          font-family: var(--font-data); letter-spacing: 1px; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
        }
        .scan-button:hover:not(:disabled) { background: rgba(0, 229, 255, 0.25); }
        .scan-button:disabled { opacity: 0.4; cursor: not-allowed; }

        .progress-container { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
        .progress-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple)); border-radius: 2px; box-shadow: var(--glow-cyan); }
        .progress-text { font-size: 12px; color: var(--accent-cyan); width: 40px; }

        .scan-results { display: flex; flex-direction: column; gap: 24px; }
        .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .summary-item { display: flex; align-items: center; gap: 16px; }
        .summary-label { font-size: var(--text-xs); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .summary-value { font-size: var(--text-xl); font-weight: 700; }
        .text-cyan { color: var(--accent-cyan); }

        .ai-summary { color: var(--text-primary); line-height: 1.7; }

        .detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
        .right-col { display: flex; flex-direction: column; gap: 24px; }

        .ports-table { display: flex; flex-direction: column; }
        .port-header { display: grid; grid-template-columns: 60px 80px 1fr 80px 1fr; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--border); font-size: 10px; color: var(--text-secondary); letter-spacing: 1px; }
        .port-row { display: grid; grid-template-columns: 60px 80px 1fr 80px 1fr; gap: 8px; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.03); align-items: center; }
        .port-num { color: var(--accent-cyan); font-weight: 700; }
        .port-version { color: var(--text-muted); font-size: var(--text-sm); }

        .tech-list { display: flex; flex-direction: column; gap: 12px; }
        .tech-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(5,10,18,0.4); border-radius: 6px; border: 1px solid var(--border); }
        .tech-name { font-weight: 600; color: var(--text-primary); }
        .tech-type { font-size: var(--text-xs); color: var(--text-muted); }

        .headers-list { display: flex; flex-direction: column; gap: 10px; }
        .header-item { display: flex; align-items: center; gap: 10px; }
        .header-info { display: flex; flex-direction: column; gap: 2px; }
        .header-name { font-size: 12px; color: var(--text-primary); }
        .header-val { font-size: 11px; }

        @media (max-width: 1000px) {
          .summary-row { grid-template-columns: repeat(2, 1fr); }
          .detail-grid { grid-template-columns: 1fr; }
          .scan-input-area { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
