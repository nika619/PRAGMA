'use client';

import { Bell, Search, Settings, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/shared/Toast';
import NotificationPanel from '@/components/shared/NotificationPanel';
import SettingsPanel from '@/components/shared/SettingsPanel';

export default function TopBar() {
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const toast = useToast();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    // Global shortcut
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        window.location.href = `/analyzer?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  return (
    <header className="topbar glass-panel">
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input 
          ref={searchRef}
          type="text" 
          placeholder="Search IOCs, CVEs, IP addresses..." 
          className="search-input text-data"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <div className="keyboard-shortcut text-data">/</div>
      </div>

      <div className="actions-container">
        <div className="system-time text-data">
          {time}
        </div>

        <div className="status-indicator">
          <ShieldCheck size={16} className="status-icon safe" />
          <span className="status-text text-data">SYSTEM ACTIVE</span>
        </div>

        <button className="action-button" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <button className="action-button" onClick={() => setShowSettings(!showSettings)}>
          <Settings size={20} />
        </button>

        <div className="user-profile" onClick={() => toast.info('Profile management disabled in demo mode.')}>
          <div className="avatar">A</div>
        </div>

        <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>

      <style jsx>{`
        .topbar {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .search-container {
          position: relative;
          width: 400px;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          height: 40px;
          background: rgba(10, 22, 40, 0.5);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 0 40px 0 48px;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
          box-shadow: var(--glow-cyan);
          background: rgba(10, 22, 40, 0.8);
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .keyboard-shortcut {
          position: absolute;
          right: 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .actions-container {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .system-time {
          font-size: 14px;
          color: var(--accent-cyan);
          letter-spacing: 1px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 230, 118, 0.1);
          padding: 6px 12px;
          border-radius: 16px;
          border: 1px solid rgba(0, 230, 118, 0.3);
        }

        .status-icon.safe {
          color: var(--low);
        }

        .status-text {
          font-size: 12px;
          color: var(--low);
        }

        .action-button {
          position: relative;
          color: var(--text-secondary);
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .action-button:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .notification-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--critical);
          color: white;
          font-size: 10px;
          font-weight: bold;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 0 10px rgba(255, 23, 68, 0.5);
        }

        .user-profile {
          padding-left: 12px;
          border-left: 1px solid var(--border);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-family: var(--font-data);
          box-shadow: var(--glow-cyan);
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .search-container {
            width: 250px;
          }
          .system-time, .status-indicator {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
