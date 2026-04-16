'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import GlassCard from '../shared/GlassCard';

export default function AttackTimeline({ threats }) {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Process data to group by minute over the last 15 minutes
    if (!threats || threats.length === 0) return;

    const now = new Date();
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
    
    // Create bins for last 15 minutes
    const bins = new Map();
    for (let i = 0; i <= 15; i++) {
      const d = new Date(fifteenMinsAgo.getTime() + i * 60 * 1000);
      d.setSeconds(0, 0); // round to minute
      bins.set(d.getTime(), 0);
    }

    threats.forEach(t => {
      const d = new Date(t.timestamp);
      d.setSeconds(0, 0);
      const time = d.getTime();
      if (bins.has(time)) {
        bins.set(time, bins.get(time) + 1);
      }
    });

    const parsedData = Array.from(bins, ([time, count]) => ({
      date: new Date(time),
      count
    })).sort((a, b) => a.date - b.date);

    setData(parsedData);
  }, [threats]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    
    const container = d3.select(chartRef.current);
    container.selectAll('*').remove();

    // Get container dimensions
    const width = chartRef.current.clientWidth || 600;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 10])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    const area = d3.area()
      .x(d => x(d.date))
      .y0(height - margin.bottom)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%H:%M')))
      .call(g => g.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.1)'))
      .call(g => g.selectAll('.tick text').attr('fill', 'var(--text-secondary)').attr('font-family', 'var(--font-data)'));

    // Y Axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.1)').attr('x2', width - margin.left - margin.right))
      .call(g => g.selectAll('.tick text').attr('fill', 'var(--text-secondary)').attr('font-family', 'var(--font-data)'));

    // Gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--accent-cyan)')
      .attr('stop-opacity', 0.4);
      
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--accent-cyan)')
      .attr('stop-opacity', 0);

    // Draw Area
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);

    // Draw Line
    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-cyan)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animation for line drawing (first render)
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Draw Dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', 'var(--bg-primary)')
      .attr('stroke', 'var(--accent-cyan)')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .delay((d, i) => i * (1500 / data.length))
      .style('opacity', 1);

  }, [data]);

  return (
    <GlassCard title="Attack Timeline (15m)">
      <div className="chart-container">
        {data.length === 0 ? (
          <div className="empty-state text-data">Awaiting data points...</div>
        ) : (
          <div ref={chartRef} className="d3-line-chart"></div>
        )}
      </div>

      <style jsx>{`
        .chart-container {
          height: 250px;
          width: 100%;
          position: relative;
        }

        .d3-line-chart {
          width: 100%;
          height: 100%;
        }

        .empty-state {
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
