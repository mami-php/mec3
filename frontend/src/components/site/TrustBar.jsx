import React from 'react';
import { TRUST_LOGOS } from '../../mock';

const TrustBar = () => {
  const doubled = [...TRUST_LOGOS, ...TRUST_LOGOS];
  return (
    <section className="relative py-14 border-y border-white/5 bg-ink-2/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-white/50">
          Sektörün en güvenilir yayınlarıyla başarıya hazırlanıyoruz
        </p>
      </div>

      <div className="mt-8 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-ink to-transparent pointer-events-none" />

        <div className="marquee-track flex gap-12 items-center whitespace-nowrap w-max">
          {doubled.map((name, i) => (
            <div
              key={i}
              className="px-6 py-3 rounded-lg border border-white/10 bg-white/[0.03] font-display font-bold text-white/70 hover:text-gold hover:border-gold/30 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
