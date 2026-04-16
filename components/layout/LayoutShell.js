'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { ToastProvider } from '@/components/shared/Toast';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
    <div className="pragma-app">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main>{children}</main>
      </div>

      <style jsx>{`
        .pragma-app {
          display: flex;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          position: relative;
          z-index: 1;
        }
        main {
          flex: 1;
          position: relative;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            margin-bottom: 70px;
          }
        }
      `}</style>
    </div>
    </ToastProvider>
  );
}
