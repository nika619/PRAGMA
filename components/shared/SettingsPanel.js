'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Moon, Sun, Palette, Globe, Bell, Shield } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

export default function SettingsPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const settingSections = [
    {
      title: 'APPEARANCE',
      items: [
        { icon: Moon, label: 'Dark Mode', value: 'Enabled', type: 'toggle', enabled: true },
        { icon: Palette, label: 'Accent Color', value: 'Cyan', type: 'badge' },
        { icon: Monitor, label: 'Compact Mode', value: 'Off', type: 'toggle', enabled: false },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: Bell, label: 'Notifications', value: 'Active', type: 'toggle', enabled: true },
        { icon: Globe, label: 'Threat Feed', value: 'Live', type: 'badge' },
        { icon: Shield, label: 'AI Analysis', value: 'Gemini 2.5 Flash', type: 'badge' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="settings-panel glass-panel"
        >
          <div className="panel-header">
            <span className="panel-title text-data">SETTINGS</span>
            <button className="close-btn" onClick={onClose}><X size={16} /></button>
          </div>

          {settingSections.map((section) => (
            <div key={section.title} className="settings-section">
              <div className="section-title text-data">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="setting-row"
                    onClick={() => toast.info(`${item.label} setting noted. Configuration persists in session.`)}
                  >
                    <div className="setting-left">
                      <Icon size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <span className="setting-label">{item.label}</span>
                    </div>
                    {item.type === 'toggle' ? (
                      <div className={`toggle ${item.enabled ? 'on' : 'off'}`}>
                        <div className="toggle-thumb" />
                      </div>
                    ) : (
                      <span className="setting-value text-data">{item.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="settings-footer text-data">
            PRAGMA v2.0.42 — © 2026
          </div>

          <style jsx>{`
            .settings-panel {
              position: absolute;
              top: 64px;
              right: 40px;
              width: 320px;
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
              font-size: 11px;
              letter-spacing: 1.5px;
              color: var(--text-primary);
            }
            .close-btn {
              color: var(--text-muted);
              cursor: pointer;
              transition: color 0.2s;
            }
            .close-btn:hover { color: var(--text-primary); }

            .settings-section {
              padding: 12px 16px;
              border-bottom: 1px solid rgba(255,255,255,0.03);
            }
            .section-title {
              font-size: 10px;
              letter-spacing: 1.5px;
              color: var(--text-muted);
              margin-bottom: 12px;
            }
            .setting-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              cursor: pointer;
              transition: opacity 0.2s;
            }
            .setting-row:hover { opacity: 0.8; }
            .setting-left {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .setting-label {
              font-size: 13px;
              color: var(--text-primary);
            }
            .setting-value {
              font-size: 11px;
              color: var(--accent-cyan);
            }
            .toggle {
              width: 36px;
              height: 20px;
              border-radius: 10px;
              position: relative;
              cursor: pointer;
              transition: all 0.2s;
            }
            .toggle.on {
              background: rgba(0, 229, 255, 0.3);
              border: 1px solid var(--accent-cyan);
            }
            .toggle.off {
              background: rgba(255,255,255,0.1);
              border: 1px solid var(--border);
            }
            .toggle-thumb {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              position: absolute;
              top: 2px;
              transition: all 0.2s;
            }
            .toggle.on .toggle-thumb {
              left: 19px;
              background: var(--accent-cyan);
              box-shadow: 0 0 8px var(--accent-cyan);
            }
            .toggle.off .toggle-thumb {
              left: 2px;
              background: var(--text-muted);
            }
            .settings-footer {
              padding: 12px 16px;
              text-align: center;
              font-size: 10px;
              color: var(--text-muted);
              letter-spacing: 1px;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
