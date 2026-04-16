'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Don't render until client-side (for createPortal)
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-overlay"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-container glass-panel"
            style={{ maxWidth }}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <button className="close-button" onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              {children}
            </div>
          </motion.div>

          <style jsx>{`
            .modal-backdrop {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              padding: 24px;
            }

            .modal-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(5, 10, 18, 0.8);
              backdrop-filter: blur(4px);
            }

            .modal-container {
              position: relative;
              width: 100%;
              max-height: 90vh;
              display: flex;
              flex-direction: column;
              border-radius: 12px;
              box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border);
              overflow: hidden;
            }

            .modal-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px 24px;
              border-bottom: 1px solid var(--border);
              background: rgba(10, 22, 40, 0.6);
            }

            .modal-title {
              margin: 0;
              font-size: var(--text-lg);
              color: var(--text-primary);
            }

            .close-button {
              color: var(--text-muted);
              transition: color 0.2s ease, transform 0.2s ease;
              padding: 4px;
              border-radius: 4px;
            }

            .close-button:hover {
              color: var(--text-primary);
              background: rgba(255, 255, 255, 0.1);
              transform: scale(1.1);
            }

            .modal-content {
              padding: 24px;
              overflow-y: auto;
              overscroll-behavior: contain;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
