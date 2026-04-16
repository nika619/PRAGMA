'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import GlassCard from '../shared/GlassCard';

export default function ThreatCategories({ threats }) {
  const chartRef = useRef(null);

  const categoryData = useMemo(() => {
    if (!threats || threats.length === 0) return [];
    const counts = {};
    threats.forEach(t => {
      counts[t.type] = (counts[t.type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [threats]);

  useEffect(() => {
    if (!chartRef.current || categoryData.length === 0) return;

    const container = d3.select(chartRef.current);
    container.selectAll('*').remove();

    const width = chartRef.current.clientWidth || 400;
    const height = 220;
    const margin = { top: 10, right: 20, bottom: 30, left: 80 };

    const svg = container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(categoryData, d => d.value)])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(categoryData.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.25);

    // Gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'var(--accent-cyan)').attr('stop-opacity', 0.8);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'var(--accent-purple)').attr('stop-opacity', 0.9);

    // Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('fill', 'var(--text-secondary)')
        .attr('font-family', 'var(--font-data)')
        .attr('font-size', '11px'));

    // Bars
    svg.selectAll('.bar')
      .data(categoryData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', margin.left)
      .attr('y', d => y(d.name))
      .attr('height', y.bandwidth())
      .attr('rx', 3)
      .attr('fill', 'url(#bar-gradient)')
      .attr('width', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('width', d => x(d.value) - margin.left);

    // Value labels
    svg.selectAll('.bar-label')
      .data(categoryData)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => x(d.value) + 6)
      .attr('y', d => y(d.name) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--text-primary)')
      .attr('font-family', 'var(--font-data)')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(d => d.value)
      .style('opacity', 0)
      .transition()
      .duration(400)
      .delay((d, i) => 800 + i * 100)
      .style('opacity', 1);

  }, [categoryData]);

  return (
    <GlassCard title="Threat Categories">
      <div className="chart-container">
        {categoryData.length === 0 ? (
          <div className="empty text-data">Awaiting categorization data...</div>
        ) : (
          <div ref={chartRef} className="bar-chart"></div>
        )}
      </div>

      <style jsx>{`
        .chart-container {
          height: 220px;
          width: 100%;
          position: relative;
        }
        .bar-chart {
          width: 100%;
          height: 100%;
        }
        .empty {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-muted);
          font-size: var(--text-sm);
        }
      `}</style>
    </GlassCard>
  );
}
