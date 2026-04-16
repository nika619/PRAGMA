'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/shared/GlassCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Shield, Bug, Wifi, Lock, FileWarning, Zap, Send, Copy, CheckCircle, Download } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

const incidentTypes = [
  { id: 'ransomware', label: 'Ransomware Attack', icon: Lock, color: 'var(--critical)' },
  { id: 'phishing', label: 'Phishing Campaign', icon: FileWarning, color: 'var(--high)' },
  { id: 'malware', label: 'Malware Infection', icon: Bug, color: 'var(--critical)' },
  { id: 'ddos', label: 'DDoS Attack', icon: Zap, color: 'var(--high)' },
  { id: 'data_breach', label: 'Data Breach', icon: Shield, color: 'var(--critical)' },
  { id: 'insider_threat', label: 'Insider Threat', icon: Wifi, color: 'var(--medium)' },
];

export default function IncidentsPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playbook, setPlaybook] = useState('');
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleGenerate = async () => {
    if (!selectedType) return;
    setIsGenerating(true);
    setPlaybook('');

    try {
      const res = await fetch('/api/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentType: selectedType.label, context })
      });
      const data = await res.json();
      if (data.success) {
        setPlaybook(data.data);
      }
    } catch (e) {
      console.error("Playbook generation failed:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(playbook);
    setCopied(true);
    toast.copy('Playbook copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!playbook) return;
    const blob = new Blob([playbook], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pragma-playbook-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Playbook exported as Markdown');
  };

  // Simple markdown-to-html renderer for the playbook
  const renderMarkdown = (md) => {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gm, '<h3 class="md-h3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="md-h2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="md-h1">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="incidents-page">
      <div className="page-header">
        <h1 className="page-title">Incident Response</h1>
        <p className="page-subtitle">AI-generated step-by-step playbooks for active threat scenarios</p>
      </div>

      {/* Incident Type Selector */}
      <div className="type-grid">
        {incidentTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <GlassCard
              className={`type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type)}
              style={{ '--type-color': type.color }}
            >
              <div className="type-icon" style={{ color: type.color, backgroundColor: `${type.color}15` }}>
                <type.icon size={28} />
              </div>
              <span className="type-label">{type.label}</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Context Input */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard title={`Generate Playbook: ${selectedType.label}`}>
              <div className="context-form">
                <textarea
                  className="context-input text-data"
                  placeholder="Describe the situation, affected systems, timeline... (optional)"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                />
                <button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? <LoadingSpinner size="small" /> : <><Send size={18} /><span>GENERATE PLAYBOOK</span></>}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playbook Result */}
      <AnimatePresence>
        {playbook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard
              title={
                <div className="playbook-header">
                  <span>Response Playbook</span>
                  <div className="playbook-actions">
                    <button className="copy-btn" onClick={handleExport}>
                      <Download size={14} />
                      <span>Export MD</span>
                    </button>
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? <><CheckCircle size={14} /><span>Copied!</span></> : <><Copy size={14} /><span>Copy</span></>}
                    </button>
                  </div>
                </div>
              }
            >
              <div
                className="playbook-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(playbook) }}
              />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .incidents-page { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; }
        .page-header { margin-bottom: 8px; }
        .page-title { font-size: var(--text-3xl); margin-bottom: 8px; }
        .page-subtitle { color: var(--text-secondary); }

        .type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        :global(.type-card) { cursor: pointer; text-align: center; padding: 24px 16px !important; transition: all 0.2s ease !important; }
        :global(.type-card:hover) { border-color: var(--type-color) !important; }
        :global(.type-card.selected) { border-color: var(--type-color) !important; background: rgba(255,255,255,0.03) !important; box-shadow: 0 0 20px rgba(0,0,0,0.3) !important; }
        .type-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .type-label { font-weight: 600; font-size: var(--text-sm); color: var(--text-primary); }

        .context-form { display: flex; flex-direction: column; gap: 16px; }
        .context-input {
          width: 100%; padding: 14px 16px; background: rgba(5, 10, 18, 0.6); border: 1px solid var(--border);
          border-radius: 6px; color: var(--text-primary); font-size: var(--text-sm); resize: vertical;
        }
        .context-input:focus { outline: none; border-color: var(--accent-cyan); }
        .context-input::placeholder { color: var(--text-muted); }
        .generate-btn {
          align-self: flex-end; display: flex; align-items: center; gap: 8px; padding: 12px 24px;
          background: rgba(0, 229, 255, 0.15); border: 1px solid var(--accent-cyan); border-radius: 6px;
          color: var(--accent-cyan); font-weight: 700; font-family: var(--font-data); letter-spacing: 1px;
          cursor: pointer; transition: all 0.2s ease;
        }
        .generate-btn:hover:not(:disabled) { background: rgba(0, 229, 255, 0.25); }
        .generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .playbook-header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .playbook-actions { display: flex; gap: 8px; }
        .copy-btn {
          display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,255,255,0.05);
          border: 1px solid var(--border); border-radius: 4px; color: var(--text-secondary); font-size: 12px;
          cursor: pointer; transition: all 0.2s;
        }
        .copy-btn:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }

        .playbook-content {
          color: var(--text-primary);
          line-height: 1.8;
          font-size: var(--text-sm);
        }
        :global(.md-h1) { font-size: var(--text-2xl); margin: 20px 0 12px; color: var(--accent-cyan); }
        :global(.md-h2) { font-size: var(--text-xl); margin: 20px 0 10px; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        :global(.md-h3) { font-size: var(--text-lg); margin: 16px 0 8px; color: var(--text-primary); }
        :global(.playbook-content li) { padding: 4px 0; padding-left: 16px; position: relative; }
        :global(.playbook-content li::before) { content: '→'; position: absolute; left: 0; color: var(--accent-cyan); }
        :global(.playbook-content strong) { color: var(--accent-cyan); }

        @media (max-width: 768px) {
          .type-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .type-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
