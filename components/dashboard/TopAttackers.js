'use client';

import { useMemo } from 'react';
import GlassCard from '../shared/GlassCard';
import DataTable from '../shared/DataTable';
import Badge from '../shared/Badge';

export default function TopAttackers({ threats }) {
  const topAttackers = useMemo(() => {
    if (!threats || threats.length === 0) return [];
    
    const ipCounts = new Map();
    threats.forEach(t => {
      if (!ipCounts.has(t.source_ip)) {
        ipCounts.set(t.source_ip, { 
          source_ip: t.source_ip, 
          countryCode: t.countryCode, 
          count: 0,
          types: new Set(),
          maxSeverity: 'low'
        });
      }
      
      const stats = ipCounts.get(t.source_ip);
      stats.count += 1;
      stats.types.add(t.type);
      
      // Update max severity
      const severityScores = { critical: 4, high: 3, medium: 2, low: 1 };
      if (severityScores[t.severity] > severityScores[stats.maxSeverity]) {
        stats.maxSeverity = t.severity;
      }
    });

    return Array.from(ipCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(entry => ({
        ...entry,
        type: Array.from(entry.types).join(', ')
      }));
  }, [threats]);

  const columns = [
    { 
      key: 'source_ip', 
      label: 'IP Address',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="text-data text-[10px] bg-[var(--bg-tertiary)] px-1 py-0.5 rounded text-[var(--text-secondary)]">{row.countryCode}</span>
          <span className="text-data">{val}</span>
        </div>
      )
    },
    { 
      key: 'count', 
      label: 'Hits',
      align: 'right',
      render: (val) => <span className="text-data font-bold">{val}</span>
    },
    { 
      key: 'maxSeverity', 
      label: 'Max Severity',
      align: 'right',
      render: (val) => <Badge variant={val}>{val}</Badge>
    }
  ];

  return (
    <GlassCard title="Top Attack Sources">
      <DataTable 
        data={topAttackers} 
        columns={columns} 
      />
    </GlassCard>
  );
}
