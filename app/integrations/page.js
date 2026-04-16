'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudCog, ShieldAlert, MonitorDot, MessageSquare, RefreshCw, Plug, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';
import Badge from '@/components/shared/Badge';
import { useToast } from '@/components/shared/Toast';

const integrationsList = [
  {
    id: 'splunk',
    name: 'Splunk Enterprise Security',
    category: 'SIEM',
    description: 'Bi-directional feed integration for automated correlation searches.',
    status: 'connected',
    icon: MonitorDot,
    color: '#000000',
    stats: '1.2M events/hr'
  },
  {
    id: 'crowdstrike',
    name: 'CrowdStrike Falcon',
    category: 'EDR',
    description: 'Endpoint telemetry ingestion and automated containment actions.',
    status: 'connected',
    icon: ShieldAlert,
    color: '#cc0000',
    stats: '1,420 agents'
  },
  {
    id: 'aws',
    name: 'AWS CloudTrail',
    category: 'Cloud',
    description: 'Continuous monitoring of IAM roles and S3 bucket policies.',
    status: 'syncing',
    icon: CloudCog,
    color: '#ff9900',
    stats: 'Syncing...'
  },
  {
    id: 'slack',
    name: 'Slack SecOps',
    category: 'Alerting',
    description: 'Direct alert routing to #soc-escalations channel.',
    status: 'configured',
    icon: MessageSquare,
    color: '#e01e5a',
    stats: 'Active'
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(integrationsList);
  const toast = useToast();

  const handleToggle = (id, currentStatus) => {
    // In mock demo, clicking "disconnect/connect" just shows a toast.
    if (currentStatus === 'connected' || currentStatus === 'configured') {
      toast.info('Disconnection requires Admin Level 3 approval in demo mode.');
    } else {
      toast.success('Integration request initiated. Waiting for OAuth handshake.');
    }
  };

  const syncAll = () => {
    toast.success('Forced manual sync triggered across all connected platforms.');
  };

  return (
    <div className="integrations-page p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Integrations</h1>
          <p className="text-slate-400">Manage third-party telemetry, SIEM connections, and endpoint providers.</p>
        </div>
        <button onClick={syncAll} className="sync-btn text-data">
          <RefreshCw size={16} />
          <span>FORCE SYNC OAUTH</span>
        </button>
      </div>

      <div className="integration-grid">
        {integrations.map((item, index) => {
          const Icon = item.icon;
          const isConnected = item.status === 'connected' || item.status === 'configured';
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="integration-card">
                <div className="card-header">
                  <div className="icon-wrap" style={{ borderLeft: `3px solid ${item.color}` }}>
                    <Icon size={24} style={{ color: item.color === '#000000' ? '#fff' : item.color }} />
                  </div>
                  <Badge variant={isConnected ? 'low' : (item.status === 'syncing' ? 'medium' : 'default')}>
                    {item.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="card-body">
                  <h3 className="name">{item.name}</h3>
                  <div className="category text-data">{item.category}</div>
                  <p className="desc">{item.description}</p>
                </div>

                <div className="card-footer">
                  <div className="stats text-data">
                    {item.status === 'syncing' ? <RefreshCw size={12} className="animate-spin" /> : <Plug size={12} />}
                    <span>{item.stats}</span>
                  </div>
                  
                  <button 
                    className={`toggle-btn ${isConnected ? 'active' : ''}`}
                    onClick={() => handleToggle(item.id, item.status)}
                  >
                    {isConnected ? 'DISCONNECT' : 'AUTHORIZE'}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <GlassCard className="mt-4 border-dashed border-slate-700 bg-transparent flex flex-col items-center justify-center py-12">
        <AlertCircle size={32} className="text-slate-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Need a custom integration?</h3>
        <p className="text-slate-400 text-center max-w-md mb-6">
          PRAGMA Engine supports custom data pipelining via REST API or Apache Kafka. 
          Contact Enterprise Support to configure your proprietary internal tools.
        </p>
        <button className="contact-btn text-data" onClick={() => toast.info('Support ticket opened.')}>
          CONTACT ENTERPRISE SUPPORT
        </button>
      </GlassCard>

      <style jsx>{`
        .sync-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--accent-cyan); border-radius: 6px;
          color: var(--accent-cyan); transition: all 0.2s;
        }
        .sync-btn:hover { background: rgba(0, 229, 255, 0.2); }

        .integration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        :global(.integration-card) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 20px;
        }
        .icon-wrap {
          padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 8px;
        }

        .card-body {
          flex: 1;
        }
        .name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .category { font-size: 10px; color: var(--accent-cyan); margin-bottom: 12px; letter-spacing: 1px; }
        .desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 24px; }

        .card-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);
        }
        .stats { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); }

        .toggle-btn {
          padding: 6px 12px; font-size: 10px; font-family: var(--font-data); font-weight: bold; letter-spacing: 1px;
          border-radius: 4px; transition: all 0.2s;
          border: 1px solid var(--accent-cyan); color: var(--accent-cyan); background: transparent;
        }
        .toggle-btn:hover { background: rgba(0,229,255,0.1); }
        .toggle-btn.active {
          border-color: var(--border); color: var(--text-secondary); background: rgba(255,255,255,0.05);
        }
        .toggle-btn.active:hover { border-color: var(--critical); color: var(--critical); background: rgba(255,23,68,0.1); }

        .contact-btn {
          padding: 10px 20px; border: 1px solid var(--text-muted); color: var(--text-primary);
          border-radius: 4px; transition: all 0.2s; background: rgba(255,255,255,0.02);
        }
        .contact-btn:hover { background: rgba(255,255,255,0.08); border-color: var(--text-secondary); }
      `}</style>
    </div>
  );
}
