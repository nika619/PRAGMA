'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/shared/GlassCard';
import Badge from '@/components/shared/Badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Globe, Hash, FileText, Link as LinkIcon, Shield, AlertTriangle, Target, BookOpen, Send, Download } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

const inputTypes = [
  { id: 'ip', label: 'IP Address', icon: Globe, placeholder: '185.153.196.22' },
  { id: 'url', label: 'URL', icon: LinkIcon, placeholder: 'https://suspicious-domain.xyz/malware' },
  { id: 'hash', label: 'File Hash', icon: Hash, placeholder: 'e99a18c428cb38d5f260853678922e03' },
  { id: 'text', label: 'Free Text', icon: FileText, placeholder: 'Describe the suspicious activity...' },
];

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? searchParams.get('q') : '';

  const [activeTab, setActiveTab] = useState('ip');
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const resultRef = useRef(null);
  const toast = useToast();

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pragma-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analysis report exported successfully');
  };

  const copyIoc = (ioc) => {
    navigator.clipboard.writeText(ioc);
    toast.copy(`Copied indicator: ${ioc}`);
  };

  // Auto-analyze if query parameter is present on mount
  useEffect(() => {
    if (initialQuery) {
      // Small delay to ensure state and DOM are ready
      const timer = setTimeout(() => handleAnalyze(initialQuery), 500);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]);

  const handleAnalyze = async (searchStr = '') => {
    const textToAnalyze = typeof searchStr === 'string' && searchStr ? searchStr.trim() : input.trim();
    if (!textToAnalyze) return;
    
    setIsLoading(true);
    setResult(null);
    setDisplayedText('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textToAnalyze, type: activeTab })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error("Analysis failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Typing effect for executive summary
  useEffect(() => {
    if (!result?.executiveSummary) return;
    let i = 0;
    const text = result.executiveSummary;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [result]);

  // Scroll to results
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--critical)';
    if (score >= 60) return 'var(--high)';
    if (score >= 40) return 'var(--medium)';
    return 'var(--low)';
  };

  return (
    <div className="analyzer-page">
      <div className="page-header">
        <h1 className="page-title">AI Threat Analyzer</h1>
        <p className="page-subtitle">Powered by Gemini 2.5 Flash — Deep behavioral threat intelligence analysis</p>
      </div>

      {/* Input Section */}
      <GlassCard>
        {/* Tab Bar */}
        <div className="tab-bar">
          {inputTypes.map(type => (
            <button
              key={type.id}
              className={`tab-button ${activeTab === type.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(type.id); setInput(''); setResult(null); }}
            >
              <type.icon size={16} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="input-area">
          {activeTab === 'text' ? (
            <textarea
              className="analyze-input textarea text-data"
              placeholder={inputTypes.find(t => t.id === activeTab).placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
          ) : (
            <input
              type="text"
              className="analyze-input text-data"
              placeholder={inputTypes.find(t => t.id === activeTab).placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          )}
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <LoadingSpinner size="small" /> : <><Send size={18} /><span>ANALYZE</span></>}
          </button>
        </div>
      </GlassCard>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="results-section"
          >
            <div className="results-header">
              <h2 className="text-xl font-bold">Analysis Results</h2>
              <button className="export-btn" onClick={handleExport}>
                <Download size={16} />
                <span className="text-data">JSON</span>
              </button>
            </div>

            {/* Score Gauge */}
            <div className="results-top">
              <GlassCard className="score-card">
                <div className="score-gauge" style={{ '--score-color': getScoreColor(result.score) }}>
                  <svg viewBox="0 0 100 100" className="gauge-svg">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={getScoreColor(result.score)}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 264} 264`}
                      transform="rotate(-90 50 50)"
                      style={{ filter: `drop-shadow(0 0 6px ${getScoreColor(result.score)})` }}
                    />
                  </svg>
                  <div className="score-value text-data">{result.score}</div>
                  <div className="score-label">RISK SCORE</div>
                </div>
                <div className="score-meta">
                  <div className="meta-item">
                    <span className="meta-label">Classification</span>
                    <span className="meta-value">{result.classification}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Severity</span>
                    <Badge variant={result.severity?.toLowerCase()}>{result.severity}</Badge>
                  </div>
                </div>
              </GlassCard>

              {/* Executive Summary */}
              <GlassCard title="Executive Summary" className="summary-card">
                <p className="summary-text">{displayedText}<span className="cursor-blink">|</span></p>
              </GlassCard>
            </div>

            {/* Technical Analysis */}
            <GlassCard title={<span className="flex-title"><Target size={16}/> Technical Analysis</span>}>
              <p className="tech-text">{result.technicalAnalysis}</p>
            </GlassCard>

            {/* IOCs + MITRE */}
            <div className="results-bottom">
              <GlassCard title={<span className="flex-title"><AlertTriangle size={16}/> Extracted IOCs</span>}>
                <div className="ioc-list">
                  {(result.ioc || []).map((ioc, i) => (
                    <div key={i} className="ioc-item text-data" onClick={() => copyIoc(ioc)} title="Click to copy">
                      {ioc}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard title={<span className="flex-title"><Shield size={16}/> MITRE ATT&CK Mapping</span>}>
                <div className="mitre-list">
                  {(result.mitre || []).map((technique, i) => (
                    <div key={i} className="mitre-item">
                      <Badge variant="info">{technique.split(' - ')[0]}</Badge>
                      <span>{technique.split(' - ').slice(1).join(' - ')}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Recommendations */}
            <GlassCard title={<span className="flex-title"><BookOpen size={16}/> Recommendations</span>}>
              <div className="recs-list">
                {(result.recommendations || []).map((rec, i) => (
                  <div key={i} className="rec-item">
                    <span className="rec-num text-data">{String(i + 1).padStart(2, '0')}</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .analyzer-page {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header { margin-bottom: 8px; }
        .page-title { font-size: var(--text-3xl); margin-bottom: 8px; }
        .page-subtitle { color: var(--text-secondary); }

        .tab-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-button:hover { border-color: var(--text-secondary); color: var(--text-primary); }
        .tab-button.active {
          background: rgba(0, 229, 255, 0.1);
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }

        .input-area {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .analyze-input {
          flex: 1;
          padding: 14px 16px;
          background: rgba(5, 10, 18, 0.6);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: var(--text-base);
          transition: border-color 0.2s ease;
        }
        .analyze-input:focus { outline: none; border-color: var(--accent-cyan); box-shadow: 0 0 10px rgba(0,229,255,0.15); }
        .analyze-input.textarea { resize: vertical; min-height: 100px; font-family: var(--font-data); }
        .analyze-input::placeholder { color: var(--text-muted); }

        .analyze-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: rgba(0, 229, 255, 0.15);
          border: 1px solid var(--accent-cyan);
          border-radius: 6px;
          color: var(--accent-cyan);
          font-weight: 700;
          font-family: var(--font-data);
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .analyze-button:hover:not(:disabled) { background: rgba(0, 229, 255, 0.25); transform: translateY(-1px); }
        .analyze-button:disabled { opacity: 0.4; cursor: not-allowed; }

        .results-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }
        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-primary);
          transition: all 0.2s;
        }
        .export-btn:hover {
          background: rgba(0, 229, 255, 0.1);
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }
        .results-top {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
        }

        .score-gauge {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto 20px;
        }
        .gauge-svg { width: 100%; height: 100%; }
        .score-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          font-size: 42px;
          font-weight: 800;
          color: var(--score-color);
          text-shadow: 0 0 20px var(--score-color);
        }
        .score-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 60%);
          font-size: 10px;
          letter-spacing: 2px;
          color: var(--text-muted);
        }
        .score-meta {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meta-label { color: var(--text-secondary); font-size: var(--text-sm); }
        .meta-value { color: var(--text-primary); font-weight: 600; }

        .summary-text {
          color: var(--text-primary);
          line-height: 1.7;
          font-size: var(--text-base);
        }
        .cursor-blink { animation: blink 0.7s infinite; color: var(--accent-cyan); }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        .flex-title { display: flex; align-items: center; gap: 8px; }
        .tech-text { color: var(--text-secondary); line-height: 1.7; }

        .results-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .ioc-list { display: flex; flex-direction: column; gap: 8px; }
        .ioc-item {
          padding: 8px 12px;
          background: rgba(5, 10, 18, 0.5);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-size: 13px;
          color: var(--accent-cyan);
          cursor: pointer;
          transition: all 0.2s;
        }
        .ioc-item:hover { border-color: var(--accent-cyan); background: rgba(0, 229, 255, 0.05); }

        .mitre-list { display: flex; flex-direction: column; gap: 10px; }
        .mitre-item { display: flex; align-items: center; gap: 10px; font-size: var(--text-sm); color: var(--text-primary); }

        .recs-list { display: flex; flex-direction: column; gap: 12px; }
        .rec-item { display: flex; gap: 12px; align-items: flex-start; color: var(--text-primary); line-height: 1.5; }
        .rec-num { color: var(--accent-cyan); font-weight: 700; flex-shrink: 0; }

        @media (max-width: 900px) {
          .results-top { grid-template-columns: 1fr; }
          .results-bottom { grid-template-columns: 1fr; }
          .input-area { flex-direction: column; }
          .analyze-button { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <LoadingSpinner />
      </div>
    }>
      <AnalyzerContent />
    </Suspense>
  );
}
