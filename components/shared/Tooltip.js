'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({ children, content, position = 'top', delay = 0.3 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay * 1000);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  let positionStyles = {};
  switch (position) {
    case 'top':
      positionStyles = { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' };
      break;
    case 'bottom':
      positionStyles = { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' };
      break;
    case 'left':
      positionStyles = { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' };
      break;
    case 'right':
      positionStyles = { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' };
      break;
  }

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="tooltip-content text-data"
            style={positionStyles}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-block;
        }

        .tooltip-content {
          position: absolute;
          background: rgba(5, 10, 18, 0.95);
          border: 1px solid var(--accent-cyan);
          border-radius: 4px;
          padding: 6px 10px;
          color: var(--text-primary);
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), var(--glow-cyan);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
