'use client';

import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import Features from '@/components/landing/Features';
import TechStack from '@/components/landing/TechStack';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <div className="landing-page">
      <div className="scanline"></div>
      <Hero />
      <Stats />
      <Features />
      <TechStack />
      <CTASection />
      
      <footer className="landing-footer text-data">
        <p>PRAGMA ENGINE VER 2.0.42 // ALL SYSTEMS NOMINAL</p>
        <p className="copyright">&copy; {new Date().getFullYear()} PRAGMA Cyber Intelligence. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .landing-page {
          width: 100%;
          min-height: 100vh;
        }

        .landing-footer {
          text-align: center;
          padding: 40px 24px;
          border-top: 1px solid var(--border);
          color: var(--text-muted);
          font-size: var(--text-xs);
        }

        .copyright {
          margin-top: 8px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
