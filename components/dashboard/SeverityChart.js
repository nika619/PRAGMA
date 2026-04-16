'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import GlassCard from '../shared/GlassCard';

export default function SeverityChart({ metrics }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !metrics) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const data = [
      { label: 'Critical', value: metrics.critical || 0, color: 'var(--critical)' },
      { label: 'High', value: metrics.high || 0, color: 'var(--high)' },
      { label: 'Medium', value: metrics.medium || 0, color: 'var(--medium)' },
      { label: 'Low', value: metrics.low || 0, color: 'var(--low)' }
    ].filter(d => d.value > 0);

    // If no data, render empty state
    if (data.length === 0) {
      d3.select(chartRef.current)
        .append('div')
        .attr('class', 'empty-chart-text')
        .text('No data available');
      return;
    }

    const width = 280;
    const height = 280;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color));

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.03);

    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .cornerRadius(4);

    const arcHover = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.05)
      .cornerRadius(4);

    // Filter effect for glow
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
      
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
      
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const arcs = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    const path = arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'var(--bg-primary)')
      .attr('stroke-width', '2px')
      .style('filter', 'url(#glow)');

    // Animation
    path.transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        }
      });

    // Interaction
    path.on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arcHover);
      
      // Update center text inside the arc
      centerValue.text(d.data.value);
      centerLabel.text(d.data.label.toUpperCase());
      centerLabel.style('fill', color(d.data.label));
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arc);
        
      // Reset center text
      centerValue.text(metrics.total);
      centerLabel.text('TOTAL');
      centerLabel.style('fill', 'var(--text-secondary)');
    });

    // Center text
    const centerValue = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.1em')
      .style('font-size', '32px')
      .style('font-weight', '700')
      .style('font-family', 'var(--font-data)')
      .style('fill', 'var(--text-primary)')
      .text(metrics.total);

    const centerLabel = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('letter-spacing', '2px')
      .style('fill', 'var(--text-secondary)')
      .text('TOTAL');

  }, [metrics]);

  return (
    <GlassCard title="Severity Distribution">
      <div className="chart-container">
        <div ref={chartRef} className="d3-chart"></div>
        <div className="legend">
          {['Critical', 'High', 'Medium', 'Low'].map(level => {
            const val = parseFloat(metrics[level.toLowerCase()] || 0);
            const total = parseFloat(metrics.total || 1);
            const pct = Math.round((val / total) * 100) || 0;
            return (
              <div key={level} className="legend-item">
                <div className="legend-marker" style={{ backgroundColor: `var(--${level.toLowerCase()})` }}></div>
                <div className="legend-label">{level}</div>
                <div className="legend-value flex-1 text-right text-data">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .chart-container {
          display: flex;
          align-items: center;
          height: 250px;
          gap: 20px;
        }

        .d3-chart {
          flex: 1;
          height: 100%;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.empty-chart-text) {
          color: var(--text-muted);
          font-style: italic;
          font-size: var(--text-sm);
        }

        .legend {
          width: 120px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: var(--text-sm);
        }

        .legend-marker {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .legend-label {
          color: var(--text-secondary);
        }

        .flex-1 { flex: 1; }
        .text-right { text-align: right; }
      `}</style>
    </GlassCard>
  );
}
