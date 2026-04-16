import './globals.css';
import LayoutShell from '@/components/layout/LayoutShell';

export const metadata = {
  title: 'PRAGMA | AI Threat Intelligence',
  description: 'AI-Powered Cyber Threat Intelligence & Defense Platform — Real-time threat monitoring, AI-driven analysis, 3D attack visualization, and automated incident response.',
  keywords: 'cyber threat intelligence, AI security, threat analysis, vulnerability scanner, incident response, MITRE ATT&CK',
  openGraph: {
    title: 'PRAGMA | AI Threat Intelligence',
    description: 'See every threat before it strikes. AI-powered cyber defense command center.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
