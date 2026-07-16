import React from 'react';
import { ArrowRight, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { HERO } from '../../mock';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 hero-grid opacity-70 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[540px] h-[540px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-ink-3/60 blur-3xl pointer-events-none" />

      {/* Floating doodles */}
      <div className="hidden md:block absolute top-24 left-8 float-slow opacity-70">
        <Sparkles className="w-8 h-8 text-gold" />
      </div>
      <div className="hidden md:block absolute top-40 right-12 float-slower opacity-60">
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <path d="M20 3 L23 16 L37 20 L23 24 L20 37 L17 24 L3 20 L17 16 Z" fill="#c9a961" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            {HERO.eyebrow}
          </div>

          <h1 className="mt-6 font-display font-black leading-tr text-white">
            <span className="block text-[54px] sm:text-[72px] lg:text-[96px] leading-[0.95] tracking-tight">
              <span className="gold-text italic">{HERO.titleGold}</span>
            </span>
            <span className="block relative mt-1 text-[46px] sm:text-[62px] lg:text-[86px] leading-[0.95] tracking-tight">
              <span className="swash-underline">{HERO.titleWhite}</span>
            </span>
          </h1>

          <p className="mt-8 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            {HERO.subtitle}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 px-6 bg-gold hover:bg-gold-light text-ink font-semibold shadow-[0_16px_40px_-14px_rgba(201,169,97,0.7)]"
            >
              {HERO.primaryCta}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-gold hover:border-gold/40"
            >
              <Play className="mr-1 w-4 h-4" />
              {HERO.secondaryCta}
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <ShieldCheck className="w-4 h-4 text-gold" />
            14 gün içinde <span className="text-white font-semibold">%100 iade garantisi</span>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {HERO.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur px-4 py-5"
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-gold">{s.value}</div>
                <div className="mt-1 text-xs sm:text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
