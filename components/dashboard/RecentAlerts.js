'use client';

import { useMemo } from 'react';
import GlassCard from '../shared/GlassCard';
import Badge from '../shared/Badge';
import { AlertTriangle, Info, Skull } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecentAlerts({ threats }) {
  const alerts = useMemo(() => {
    if (!threats) return [];
    // Filter only high & critical severity items
    return threats.filter(t => t.severity === 'critical' || t.severity === 'high').slice(0, 5);
  }, [threats]);

  const getIcon = (severity) => {
    if (severity === 'critical') return <Skull size={18} className="text-[var(--critical)]" />;
    return <AlertTriangle size={18} className="text-[var(--high)]" />;
  };

  return (
    <GlassCard title="Critical Alerts" className="h-full">
      <div className="alerts-container">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
            <Info size={32} className="mb-2 opacity-50" />
            <span className="text-sm">No critical alerts detected</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert, i) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-[rgba(5,10,18,0.5)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(alert.severity)}
                    <span className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">{alert.type} Deteced</span>
                  </div>
                  <Badge variant={alert.severity}>{alert.severity}</Badge>
                </div>
                
                <p className="text-xs text-[var(--text-secondary)] mb-2 mt-1">
                  {alert.description || `Suspicious activity from ${alert.source_ip} targeting internal systems.`}
                </p>
                
                <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-[var(--font-data)]">
                  <span>SRC: {alert.source_ip}</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        /* Tailwind equivalents for internal component styling */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .items-start { align-items: flex-start; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .p-3 { padding: 0.75rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-1 { margin-top: 0.25rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .h-full { height: 100%; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .rounded-lg { border-radius: 0.5rem; }
        .border { border-width: 1px; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </GlassCard>
  );
}
