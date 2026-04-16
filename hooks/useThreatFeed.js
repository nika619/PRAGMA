'use client';

import { useState, useEffect, useCallback } from 'react';

export function useThreatFeed() {
  const [threats, setThreats] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  const aggregateThreatData = useCallback((threatList) => {
    let crit = 0, high = 0, med = 0, low = 0;
    
    threatList.forEach(t => {
      if (t.severity === 'critical') crit++;
      else if (t.severity === 'high') high++;
      else if (t.severity === 'medium') med++;
      else low++;
    });

    setMetrics({
      total: threatList.length,
      critical: crit,
      high: high,
      medium: med,
      low: low
    });
  }, []);

  useEffect(() => {
    // Initial fetch to get some baseline data
    const fetchInitial = async () => {
      try {
        const res = await fetch('/api/threats?limit=50');
        const data = await res.json();
        if (data.success) {
          setThreats(data.data);
          aggregateThreatData(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch initial threats:", e);
      }
    };
    
    fetchInitial();

    // Set up SSE for live updates
    const eventSource = new EventSource('/api/feed');
    
    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'threat') {
          setThreats(prev => {
            const newThreats = [parsed.data, ...prev].slice(0, 100); // keep last 100
            aggregateThreatData(newThreats);
            return newThreats;
          });
        }
      } catch (e) {
        // Parse error, ignore
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // Reconnect handled natively by EventSource, but could add manual retry logic here
    };

    return () => {
      eventSource.close();
    };
  }, [aggregateThreatData]);

  return { threats, metrics, isConnected };
}
