'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/shared/GlassCard';
import Badge from '@/components/shared/Badge';
import SearchInput from '@/components/shared/SearchInput';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Modal from '@/components/shared/Modal';
import { Bug, Calendar, Package, ExternalLink, ChevronRight } from 'lucide-react';

export default function VulnerabilitiesPage() {
  const [cves, setCves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCVE, setSelectedCVE] = useState(null);

  useEffect(() => {
    const fetchCVEs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cve?keyword=${searchQuery}`);
        const data = await res.json();
        if (data.success) setCves(data.data);
      } catch (e) {
        console.error("Failed to fetch CVEs:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCVEs();
  }, [searchQuery]);

  const getScoreColor = (score) => {
    if (score >= 9.0) return 'var(--critical)';
    if (score >= 7.0) return 'var(--high)';
    if (score >= 4.0) return 'var(--medium)';
    return 'var(--low)';
  };

  const getSeverityFromScore = (score) => {
    if (score >= 9.0) return 'critical';
    if (score >= 7.0) return 'high';
    if (score >= 4.0) return 'medium';
    return 'low';
  };

  return (
    <div className="vuln-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vulnerability Index</h1>
          <p className="page-subtitle">CVE database enriched with AI-generated explanations</p>
        </div>
        <div className="search-area">
          <SearchInput
            placeholder="Search CVEs (e.g., WebP, XZ, curl)..."
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-center"><LoadingSpinner /></div>
      ) : (
        <div className="cve-grid">
          {cves.map((cve, i) => (
            <motion.div
              key={cve.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="cve-card" onClick={() => setSelectedCVE(cve)}>
                <div className="cve-card-inner">
                  {/* Score Gauge */}
                  <div className="cvss-gauge" style={{ '--gauge-color': getScoreColor(cve.score) }}>
                    <svg viewBox="0 0 60 60" className="gauge-mini">
                      <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                      <circle
                        cx="30" cy="30" r="25" fill="none"
                        stroke={getScoreColor(cve.score)}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${(cve.score / 10) * 157} 157`}
                        transform="rotate(-90 30 30)"
                        style={{ filter: `drop-shadow(0 0 4px ${getScoreColor(cve.score)})` }}
                      />
                    </svg>
                    <span className="gauge-score text-data">{cve.score}</span>
                  </div>

                  {/* CVE Info */}
                  <div className="cve-body">
                    <div className="cve-header-row">
                      <span className="cve-id text-data">{cve.id}</span>
                      <Badge variant={getSeverityFromScore(cve.score)}>{cve.severity}</Badge>
                    </div>
                    <h3 className="cve-title">{cve.title}</h3>
                    <p className="cve-desc">{cve.description?.substring(0, 150)}...</p>

                    <div className="cve-meta">
                      <div className="meta-tag">
                        <Calendar size={12} />
                        <span>{new Date(cve.published).toLocaleDateString()}</span>
                      </div>
                      <div className="meta-tag">
                        <Package size={12} />
                        <span>{(cve.products || []).slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={18} className="cve-arrow" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* CVE Detail Modal */}
      <Modal
        isOpen={!!selectedCVE}
        onClose={() => setSelectedCVE(null)}
        title={selectedCVE?.id || ''}
        maxWidth="700px"
      >
        {selectedCVE && (
          <div className="cve-detail">
            <div className="detail-score-row">
              <div className="detail-gauge" style={{ '--gauge-color': getScoreColor(selectedCVE.score) }}>
                <svg viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke={getScoreColor(selectedCVE.score)}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${(selectedCVE.score / 10) * 213.6} 213.6`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <span className="detail-gauge-score text-data">{selectedCVE.score}</span>
              </div>
              <div>
                <h2 className="detail-title">{selectedCVE.title}</h2>
                <Badge variant={getSeverityFromScore(selectedCVE.score)}>{selectedCVE.severity}</Badge>
              </div>
            </div>

            <div className="detail-section">
              <h4>Description</h4>
              <p>{selectedCVE.description}</p>
            </div>

            <div className="detail-section">
              <h4>Affected Products</h4>
              <div className="product-tags">
                {(selectedCVE.products || []).map((p, i) => (
                  <span key={i} className="product-tag text-data">{p}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Published</h4>
              <p className="text-data">{new Date(selectedCVE.published).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <a
              href={`https://nvd.nist.gov/vuln/detail/${selectedCVE.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nvd-link"
            >
              <ExternalLink size={14} />
              <span>View on NVD</span>
            </a>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .vuln-page { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
        .page-title { font-size: var(--text-3xl); margin-bottom: 8px; }
        .page-subtitle { color: var(--text-secondary); }
        .search-area { width: 350px; }
        .loading-center { display: flex; justify-content: center; padding: 100px 0; }

        .cve-grid { display: flex; flex-direction: column; gap: 16px; }
        :global(.cve-card) { cursor: pointer; transition: border-color 0.2s ease, transform 0.2s ease !important; }
        :global(.cve-card:hover) { border-color: rgba(0, 229, 255, 0.3) !important; transform: translateX(4px); }

        .cve-card-inner { display: flex; align-items: center; gap: 20px; }
        .cvss-gauge { position: relative; width: 60px; height: 60px; flex-shrink: 0; }
        .gauge-mini { width: 100%; height: 100%; }
        .gauge-score { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; font-weight: 800; color: var(--gauge-color); }

        .cve-body { flex: 1; min-width: 0; }
        .cve-header-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .cve-id { font-size: 13px; color: var(--accent-cyan); font-weight: 600; }
        .cve-title { font-size: var(--text-lg); margin-bottom: 6px; color: var(--text-primary); }
        .cve-desc { font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.5; }
        .cve-meta { display: flex; gap: 16px; margin-top: 10px; }
        .meta-tag { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
        .cve-arrow { color: var(--text-muted); flex-shrink: 0; }

        /* Detail Modal */
        .cve-detail { display: flex; flex-direction: column; gap: 24px; }
        .detail-score-row { display: flex; align-items: center; gap: 20px; }
        .detail-gauge { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
        .detail-gauge svg { width: 100%; height: 100%; }
        .detail-gauge-score { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; font-weight: 800; color: var(--gauge-color); }
        .detail-title { font-size: var(--text-xl); margin-bottom: 8px; }
        .detail-section h4 { color: var(--text-secondary); margin-bottom: 8px; font-size: var(--text-sm); text-transform: uppercase; letter-spacing: 1px; }
        .detail-section p { color: var(--text-primary); line-height: 1.6; }
        .product-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .product-tag { padding: 4px 12px; background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 4px; font-size: 12px; color: var(--accent-cyan); }
        .nvd-link { display: inline-flex; align-items: center; gap: 8px; color: var(--accent-cyan); font-size: var(--text-sm); transition: opacity 0.2s; }
        .nvd-link:hover { opacity: 0.8; }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: stretch; }
          .search-area { width: 100%; }
          .cve-card-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
