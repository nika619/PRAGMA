'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/shared/GlassCard';
import Badge from '@/components/shared/Badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Code, Play, Copy, CheckCircle, ChevronRight, Globe, Shield, Search, Bug, FileText, Radio } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

const endpoints = [
  {
    id: 'threats',
    method: 'GET',
    path: '/api/threats',
    title: 'Get Threat Feed',
    description: 'Retrieve the latest aggregated threat intelligence from multiple feeds including AlienVault OTX, URLhaus, and PhishTank.',
    icon: Globe,
    params: [{ name: 'limit', type: 'number', default: '20', description: 'Max number of results to return' }],
    response: `{
  "success": true,
  "data": [
    {
      "id": "th-01",
      "timestamp": "2026-04-16T12:00:00.000Z",
      "source_ip": "185.153.196.22",
      "target_ip": "10.0.0.5",
      "type": "Malware",
      "severity": "critical",
      "country": "Russia",
      "description": "Emotet C2 traffic detected"
    }
  ]
}`
  },
  {
    id: 'analyze',
    method: 'POST',
    path: '/api/analyze',
    title: 'AI Threat Analysis',
    description: 'Perform deep AI-powered analysis on an IP, URL, file hash, or free text using Gemini 2.5 Flash.',
    icon: Shield,
    params: [
      { name: 'input', type: 'string', required: true, description: 'The indicator to analyze' },
      { name: 'type', type: 'string', required: true, description: 'One of: ip, url, hash, text' }
    ],
    response: `{
  "success": true,
  "data": {
    "score": 85,
    "classification": "Command and Control (C2)",
    "severity": "High",
    "executiveSummary": "...",
    "technicalAnalysis": "...",
    "ioc": ["185.153.196.22"],
    "mitre": ["T1071 - Application Layer Protocol"],
    "recommendations": ["Block on firewall"]
  }
}`
  },
  {
    id: 'scan',
    method: 'POST',
    path: '/api/scan',
    title: 'Attack Surface Scan',
    description: 'Perform reconnaissance on a target domain or IP, revealing open ports, technologies, SSL configuration and security headers.',
    icon: Search,
    params: [
      { name: 'target', type: 'string', required: true, description: 'Domain or IP to scan' },
      { name: 'type', type: 'string', default: 'full', description: 'Scan type: full, quick, ports-only' }
    ],
    response: `{
  "success": true,
  "data": {
    "ip": "45.33.32.156",
    "domain": "scanme.nmap.org",
    "riskScore": 65,
    "ports": [...],
    "tech": [...],
    "ssl": { "grade": "F" },
    "headers": {...},
    "aiSummary": "..."
  }
}`
  },
  {
    id: 'cve',
    method: 'GET',
    path: '/api/cve',
    title: 'CVE Database',
    description: 'Query the National Vulnerability Database for CVEs with optional keyword search.',
    icon: Bug,
    params: [{ name: 'keyword', type: 'string', default: '', description: 'Search keyword (e.g., "WebP", "curl")' }],
    response: `{
  "success": true,
  "data": [
    {
      "id": "CVE-2023-4863",
      "title": "WebP Heap Buffer Overflow",
      "severity": "critical",
      "score": 9.8,
      "published": "2023-09-12T15:15:00.000Z",
      "description": "...",
      "products": ["Chrome", "Edge", "Firefox"]
    }
  ]
}`
  },
  {
    id: 'playbook',
    method: 'POST',
    path: '/api/playbook',
    title: 'Generate Playbook',
    description: 'Generate a step-by-step incident response playbook using Gemini AI for any incident type.',
    icon: FileText,
    params: [
      { name: 'incidentType', type: 'string', required: true, description: 'Type of incident (e.g., "Ransomware Attack")' },
      { name: 'context', type: 'string', default: '', description: 'Additional context about the incident' }
    ],
    response: `{
  "success": true,
  "data": "# Incident Response Playbook: Ransomware\\n\\n## 1. IMMEDIATE ACTIONS..."
}`
  },
  {
    id: 'feed',
    method: 'GET',
    path: '/api/feed',
    title: 'Live Threat Stream (SSE)',
    description: 'Server-Sent Events endpoint for real-time threat data streaming to the dashboard.',
    icon: Radio,
    params: [],
    response: `data: {"type":"threat","data":{"id":"th-sim-1713268000000","source_ip":"192.168.1.1","type":"Malware","severity":"high"}}

data: {"type":"threat","data":{...}}
// Stream continues every 3-8 seconds`
  }
];

export default function APIDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0]);
  const [tryItBody, setTryItBody] = useState('');
  const [tryItResult, setTryItResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleTryIt = async () => {
    setIsLoading(true);
    setTryItResult('');
    try {
      const options = { method: activeEndpoint.method };
      let url = activeEndpoint.path;

      if (activeEndpoint.method === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = tryItBody || '{}';
      } else if (activeEndpoint.method === 'GET' && tryItBody) {
        // Append as query string
        url += `?${tryItBody}`;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setTryItResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setTryItResult(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.copy('Snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (method) => {
    if (method === 'GET') return 'var(--low)';
    if (method === 'POST') return 'var(--accent-cyan)';
    return 'var(--medium)';
  };

  return (
    <div className="api-docs-page">
      {/* Sidebar */}
      <div className="docs-sidebar glass-panel">
        <div className="sidebar-title text-data">API ENDPOINTS</div>
        {endpoints.map(ep => (
          <button
            key={ep.id}
            className={`endpoint-btn ${activeEndpoint.id === ep.id ? 'active' : ''}`}
            onClick={() => { setActiveEndpoint(ep); setTryItResult(''); }}
          >
            <span className="method-badge text-data" style={{ color: getMethodColor(ep.method) }}>{ep.method}</span>
            <span className="endpoint-path text-data">{ep.path}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="docs-main">
        <motion.div
          key={activeEndpoint.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="docs-content"
        >
          {/* Header */}
          <div className="endpoint-header">
            <div className="endpoint-title-row">
              <activeEndpoint.icon size={28} className="text-cyan" />
              <h1>{activeEndpoint.title}</h1>
            </div>
            <p className="endpoint-desc">{activeEndpoint.description}</p>
            <div className="endpoint-url">
              <span className="method-label text-data" style={{ color: getMethodColor(activeEndpoint.method) }}>{activeEndpoint.method}</span>
              <code className="url-text text-data">{activeEndpoint.path}</code>
            </div>
          </div>

          {/* Parameters */}
          {activeEndpoint.params.length > 0 && (
            <GlassCard title="Parameters">
              <div className="params-table">
                <div className="params-header text-data">
                  <span>NAME</span><span>TYPE</span><span>REQUIRED</span><span>DESCRIPTION</span>
                </div>
                {activeEndpoint.params.map((p, i) => (
                  <div key={i} className="params-row">
                    <span className="param-name text-data">{p.name}</span>
                    <span className="param-type text-data">{p.type}</span>
                    <span>{p.required ? <Badge variant="high">Required</Badge> : <Badge variant="low">Optional</Badge>}</span>
                    <span className="param-desc">{p.description}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Example Response */}
          <GlassCard title={
            <div className="code-header">
              <span>Example Response</span>
              <button className="copy-sm" onClick={() => handleCopy(activeEndpoint.response)}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
            </div>
          }>
            <pre className="code-block text-data">{activeEndpoint.response}</pre>
          </GlassCard>

          {/* Try It */}
          {activeEndpoint.id !== 'feed' && (
            <GlassCard title={<span className="flex-title"><Play size={16}/> Try It</span>}>
              <div className="try-it-area">
                <textarea
                  className="try-input text-data"
                  placeholder={activeEndpoint.method === 'POST'
                    ? `{"input": "185.153.196.22", "type": "ip"}`
                    : 'keyword=WebP'}
                  value={tryItBody}
                  onChange={(e) => setTryItBody(e.target.value)}
                  rows={3}
                />
                <button className="try-btn" onClick={handleTryIt} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="small" /> : <><Play size={16} /><span>Execute</span></>}
                </button>
              </div>

              {tryItResult && (
                <pre className="code-block result-block text-data">{tryItResult}</pre>
              )}
            </GlassCard>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .api-docs-page { display: flex; height: calc(100vh - 60px); overflow: hidden; }

        .docs-sidebar {
          width: 280px; flex-shrink: 0; padding: 20px 12px; border-right: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 4px; overflow-y: auto;
        }
        .sidebar-title { font-size: 10px; letter-spacing: 2px; color: var(--text-muted); padding: 8px 12px; margin-bottom: 8px; }
        .endpoint-btn {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px;
          background: transparent; border: none; cursor: pointer; text-align: left; width: 100%;
          transition: all 0.2s ease; color: var(--text-secondary);
        }
        .endpoint-btn:hover { background: rgba(255,255,255,0.03); }
        .endpoint-btn.active { background: rgba(0, 229, 255, 0.08); border-left: 2px solid var(--accent-cyan); }
        .method-badge { font-size: 10px; font-weight: 700; letter-spacing: 1px; width: 36px; }
        .endpoint-path { font-size: 12px; }

        .docs-main { flex: 1; overflow-y: auto; padding: 24px 32px; }
        .docs-content { display: flex; flex-direction: column; gap: 24px; max-width: 900px; }

        .endpoint-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .text-cyan { color: var(--accent-cyan); }
        .endpoint-title-row h1 { font-size: var(--text-3xl); }
        .endpoint-desc { color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; }
        .endpoint-url {
          display: inline-flex; align-items: center; gap: 12px; padding: 10px 16px;
          background: rgba(5, 10, 18, 0.6); border: 1px solid var(--border); border-radius: 6px;
        }
        .method-label { font-weight: 700; font-size: 13px; }
        .url-text { font-size: 14px; color: var(--text-primary); }

        .params-table { display: flex; flex-direction: column; }
        .params-header {
          display: grid; grid-template-columns: 120px 80px 100px 1fr; gap: 12px;
          padding: 10px 12px; font-size: 10px; color: var(--text-muted); letter-spacing: 1px;
          border-bottom: 1px solid var(--border);
        }
        .params-row {
          display: grid; grid-template-columns: 120px 80px 100px 1fr; gap: 12px;
          padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.03); align-items: center;
        }
        .param-name { color: var(--accent-cyan); font-weight: 600; font-size: 13px; }
        .param-type { color: var(--accent-purple); font-size: 12px; }
        .param-desc { color: var(--text-secondary); font-size: var(--text-sm); }

        .code-header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .copy-sm { color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
        .copy-sm:hover { color: var(--accent-cyan); }
        .code-block {
          padding: 16px; background: rgba(5, 10, 18, 0.6); border: 1px solid var(--border);
          border-radius: 6px; font-size: 12px; line-height: 1.6; overflow-x: auto;
          color: var(--text-primary); white-space: pre-wrap; word-break: break-all;
        }
        .result-block { margin-top: 16px; border-color: var(--accent-cyan); }

        .flex-title { display: flex; align-items: center; gap: 8px; }
        .try-it-area { display: flex; gap: 12px; align-items: flex-start; }
        .try-input {
          flex: 1; padding: 12px; background: rgba(5, 10, 18, 0.6); border: 1px solid var(--border);
          border-radius: 6px; color: var(--text-primary); font-size: 13px; resize: vertical;
          font-family: var(--font-data);
        }
        .try-input:focus { outline: none; border-color: var(--accent-cyan); }
        .try-input::placeholder { color: var(--text-muted); }
        .try-btn {
          display: flex; align-items: center; gap: 8px; padding: 12px 20px;
          background: rgba(0, 229, 255, 0.15); border: 1px solid var(--accent-cyan); border-radius: 6px;
          color: var(--accent-cyan); font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .try-btn:hover:not(:disabled) { background: rgba(0, 229, 255, 0.25); }
        .try-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 900px) {
          .api-docs-page { flex-direction: column; height: auto; }
          .docs-sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid var(--border); }
          .params-header, .params-row { grid-template-columns: 1fr 1fr; }
          .try-it-area { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
