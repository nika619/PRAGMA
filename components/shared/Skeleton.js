export default function Skeleton({ className = '', width = '100%', height = '20px', borderRadius = '4px' }) {
  return (
    <div className={`skeleton ${className}`} style={{ width, height, borderRadius }}>
      <style jsx>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(0, 229, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
          display: inline-block;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
