'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Shield, AlertTriangle, Bug, Wifi, Clock } from 'lucide-react';
import Badge from '@/components/shared/Badge';

const mockNotifications = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Threat Detected',
    message: 'C2 beaconing observed from 185.153.196.22 to internal host.',
    time: '2 min ago',
    icon: Shield,
    unread: true,
  },
  {
    id: 2,
    type: 'high',
    title: 'Scan Complete',
    message: 'Attack surface scan on scanme.nmap.org revealed 6 open ports.',
    time: '12 min ago',
    icon: AlertTriangle,
    unread: true,
  },
  {
    id: 3,
    type: 'medium',
    title: 'New CVE Published',
    message: 'CVE-2026-1234 affects OpenSSL 3.x — CVSS 8.1 (High)',
    time: '1 hour ago',
    icon: Bug,
    unread: true,
  },
  {
    id: 4,
    type: 'low',
    title: 'Feed Reconnected',
    message: 'Live threat feed re-established after brief interruption.',
    time: '3 hours ago',
    icon: Wifi,
    unread: false,
  },
];

export default function NotificationPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="notification-panel glass-panel"
        >
          <div className="panel-header">
            <div className="panel-title">
              <Bell size={16} />
              <span className="text-data">NOTIFICATIONS</span>
              {unreadCount > 0 && <Badge variant="critical">{unreadCount}</Badge>}
            </div>
            <div className="panel-actions">
              <button className="panel-action-btn" onClick={markAllRead}>Mark all read</button>
              <button className="panel-action-btn" onClick={clearAll}>Clear</button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={32} style={{ color: 'var(--text-muted)' }} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                    <div className="notif-icon" style={{ color: `var(--${notif.type})` }}>
                      <Icon size={18} />
                    </div>
                    <div className="notif-body">
                      <div className="notif-title">{notif.title}</div>
                      <div className="notif-message">{notif.message}</div>
                      <div className="notif-time">
                        <Clock size={10} />
                        <span>{notif.time}</span>
                      </div>
                    </div>
                    {notif.unread && <div className="unread-dot" style={{ background: `var(--${notif.type})` }} />}
                  </div>
                );
              })
            )}
          </div>

          <style jsx>{`
            .notification-panel {
              position: absolute;
              top: 64px;
              right: 80px;
              width: 380px;
              max-height: 480px;
              border-radius: 12px;
              overflow: hidden;
              z-index: 200;
              box-shadow: 0 20px 60px rgba(0,0,0,0.8);
              background: rgba(8, 14, 26, 0.98);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
            }
            .panel-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px;
              border-bottom: 1px solid var(--border);
            }
            .panel-title {
              display: flex;
              align-items: center;
              gap: 8px;
              color: var(--text-primary);
              font-size: 11px;
              letter-spacing: 1.5px;
            }
            .panel-actions {
              display: flex;
              gap: 12px;
            }
            .panel-action-btn {
              font-size: 11px;
              color: var(--accent-cyan);
              cursor: pointer;
              transition: opacity 0.2s;
            }
            .panel-action-btn:hover { opacity: 0.7; }

            .notification-list {
              overflow-y: auto;
              max-height: 380px;
            }
            .notif-item {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              padding: 14px 16px;
              border-bottom: 1px solid rgba(255,255,255,0.03);
              transition: background 0.2s;
              cursor: pointer;
              position: relative;
            }
            .notif-item:hover {
              background: rgba(255,255,255,0.03);
            }
            .notif-item.unread {
              background: rgba(0, 229, 255, 0.03);
            }
            .notif-icon {
              margin-top: 2px;
              flex-shrink: 0;
            }
            .notif-body {
              flex: 1;
              min-width: 0;
            }
            .notif-title {
              font-size: 13px;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 4px;
            }
            .notif-message {
              font-size: 12px;
              color: var(--text-secondary);
              line-height: 1.4;
              margin-bottom: 6px;
            }
            .notif-time {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 10px;
              color: var(--text-muted);
            }
            .unread-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              flex-shrink: 0;
              margin-top: 6px;
              box-shadow: 0 0 8px currentColor;
            }
            .empty-state {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 12px;
              padding: 48px 24px;
              color: var(--text-muted);
              font-size: 13px;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
