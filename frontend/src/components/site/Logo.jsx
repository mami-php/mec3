import React from 'react';

const Logo = ({ brandPrefix = 'Koçum', brandSuffix = 'Sınav', tagline = 'MENTORLUK & REHBERLİK', className = '' }) => (
  <a href="/" className={`flex items-center gap-2 group ${className}`}>
    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gold text-ink font-black shadow-[0_6px_18px_-6px_rgba(201,169,97,0.6)]">
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V5l7 4 2-4 2 4 5-3v14" />
      </svg>
    </span>
    <div className="leading-none">
      <div className="font-display font-black text-white text-xl tracking-tight">
        {brandPrefix}<span className="text-gold">{brandSuffix}</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-gold/70 mt-0.5">{tagline}</div>
    </div>
  </a>
);

export default Logo;
