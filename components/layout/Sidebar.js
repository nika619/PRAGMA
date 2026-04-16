'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Globe, 
  Activity, 
  Crosshair, 
  Database, 
  BookOpen, 
  Code,
  Plug
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Command Center', icon: Activity, href: '/dashboard' },
    { label: 'Data Integrations', icon: Plug, href: '/integrations' },
    { label: 'Threat Globe', icon: Globe, href: '/globe' },
    { label: 'AI Analyzer', icon: Crosshair, href: '/analyzer' },
    { label: 'Scanner', icon: ShieldAlert, href: '/scanner' },
    { label: 'Vulnerabilities', icon: Database, href: '/vulnerabilities' },
    { label: 'Incidents', icon: BookOpen, href: '/incidents' },
    { label: 'API Docs', icon: Code, href: '/api-docs' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="logo-container">
        <Link href="/" className="logo-link">
          <div className="logo-icon">
            <div className="inner-dot"></div>
          </div>
          <span className="logo-text">PRAGMA</span>
        </Link>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border);
          z-index: 100;
          transition: width 0.3s ease;
        }

        .logo-container {
          height: 72px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          border-bottom: 1px solid var(--border);
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 28px;
          height: 28px;
          border: 2px solid var(--accent-cyan);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glow-cyan);
          position: relative;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          width: 36px;
          height: 1px;
          background: var(--accent-cyan);
          transform: rotate(45deg);
        }

        .inner-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-cyan);
          border-radius: 50%;
        }

        .logo-text {
          font-family: var(--font-data);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--text-primary);
        }

        .nav-menu {
          flex: 1;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--text-secondary);
          position: relative;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(41, 121, 255, 0.1);
        }

        .nav-item.active {
          color: var(--accent-cyan);
          background: rgba(0, 229, 255, 0.1);
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: var(--accent-cyan);
          border-radius: 0 4px 4px 0;
          box-shadow: var(--glow-cyan);
        }

        .nav-icon {
          min-width: 20px;
        }

        .nav-label {
          font-weight: 500;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
            /* Will implement mobile bottom nav instead */
          }
        }
      `}</style>
    </aside>
  );
}
