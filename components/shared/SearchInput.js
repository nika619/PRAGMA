'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchInput({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  className = '' 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`search-container ${isFocused ? 'focused' : ''} ${className}`}>
      <Search className="search-icon" size={16} />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-input text-data"
      />
      
      {value && onClear && (
        <button onClick={onClear} className="clear-button">
          <X size={14} />
        </button>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          background: rgba(10, 22, 40, 0.5);
          border: 1px solid var(--border);
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .search-container.focused {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
          background: rgba(10, 22, 40, 0.8);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .search-container.focused .search-icon {
          color: var(--accent-cyan);
        }

        .search-input {
          width: 100%;
          height: 36px;
          background: transparent;
          border: none;
          padding: 0 36px;
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .search-input:focus {
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .clear-button {
          position: absolute;
          right: 12px;
          color: var(--text-muted);
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
