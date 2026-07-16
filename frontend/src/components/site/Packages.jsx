import React, { useState } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { EXAM_TABS, PACKAGES } from '../../mock';
import { useSiteCollection } from '../../lib/cms';

const Packages = () => {
  const [active, setActive] = useState('YKS');
  const { items } = useSiteCollection('/site/packages');
  // If CMS has packages, show them all (grouped by exam is not part of MVP CMS)
  const cmsPacks = items.map((p) => ({
    name: p.name,
    subtitle: p.description || `${p.duration_days} gün`,
    priceOld: null,
    price: p.price?.toLocaleString('tr-TR') || '0',
    unit: `₺ / ${p.duration_days} gün`,
    features: p.features || [],
    cta: 'Paketi Al',
    accent: !!p.accent,
    badge: p.badge || null,
  }));
  const packs = items.length > 0 ? cmsPacks : (PACKAGES[active] || []);

  return (
    <section id="deneme" className="relative py-24 lg:py-32 bg-ink-2/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.3em]">Fiyatlarımız</p>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
            Paketini <span className="gold-text italic">seç</span>, başarıya odaklan.
          </h2>
          <p className="mt-5 text-white/60 text-lg">
            Her seviyeye ve ihtiyaca uygun koçluk paketlerimizle yanındayız.
          </p>
        </div>

        {/* Exam Tabs */}
        <div className="mt-10 flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white/[0.04] border border-white/10">
            {EXAM_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === tab
                    ? 'bg-gold text-ink shadow-[0_10px_24px_-10px_rgba(201,169,97,0.7)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border card-lift p-7 flex flex-col ${
                p.accent
                  ? 'border-gold/50 bg-gradient-to-b from-gold/10 to-transparent shadow-[0_30px_80px_-40px_rgba(201,169,97,0.5)]'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {p.badge && (
                <div className={`absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  p.accent ? 'bg-gold text-ink' : 'bg-white text-ink'
                }`}>
                  <Star className="w-3 h-3 fill-current" />
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="font-display font-black text-2xl text-white">{p.name}</h3>
                <p className="mt-1 text-xs text-white/50 font-medium uppercase tracking-wider">{p.subtitle}</p>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <div className="font-display font-black text-5xl text-white">
                  {p.price}<span className="text-2xl align-top text-gold">₺</span>
                </div>
                <div className="text-sm text-white/40 line-through">{p.priceOld} ₺</div>
              </div>
              <p className="text-xs text-white/50">{p.unit}</p>

              <div className="mt-6 h-px bg-white/10" />

              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                    <span className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full ${
                      p.accent ? 'bg-gold text-ink' : 'bg-white/10 text-gold'
                    }`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 h-12 font-semibold ${
                  p.accent
                    ? 'bg-gold hover:bg-gold-light text-ink'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                {p.cta}
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
