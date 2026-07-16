import React from 'react';
import {
  ArrowRight, Play, Sparkles, Users, CalendarClock, PackageOpen,
  MonitorPlay, MessageSquare, Trophy, Star,
} from 'lucide-react';
import { Button } from '../ui/button';
import { HERO } from '../../mock';
import { useSiteContent } from '../../lib/cms';

const badgeIcon = { Users, CalendarClock, PackageOpen, MonitorPlay, MessageSquare };

const Hero = () => {
  const { content } = useSiteContent();
  const hero = { ...HERO, ...(content.hero || {}) };
  // Support both mock keys and CMS keys
  const eyebrow = hero.eyebrow;
  const titleGold = hero.title_gold || hero.titleGold;
  const titleWhite = hero.title_white || hero.titleWhite;
  const subtitle = hero.subtitle;
  const primaryCta = hero.primary_cta || hero.primaryCta;
  const secondaryCta = hero.secondary_cta || hero.secondaryCta;
  const stats = hero.stats?.length ? hero.stats : HERO.stats;

  const [c1, c2, c3, c4, c5] = HERO.champions;

  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 hero-grid opacity-70 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[540px] h-[540px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-ink-3/60 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT: content */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              {eyebrow}
            </div>

            <h1 className="mt-6 font-display font-black leading-tr text-white">
              <span className="block text-[40px] sm:text-[56px] lg:text-[68px] xl:text-[82px] leading-[0.95] tracking-tight">
                <span className="gold-text italic">{titleGold}</span>
              </span>
              <span className="block relative mt-1 text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[72px] leading-[0.95] tracking-tight">
                <span className="swash-underline">{titleWhite}</span>
              </span>
            </h1>

            <p className="mt-7 text-base sm:text-lg text-white/70 max-w-xl">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                size="lg"
                className="h-12 px-6 bg-gold hover:bg-gold-light text-ink font-semibold shadow-[0_16px_40px_-14px_rgba(201,169,97,0.7)]"
              >
                {primaryCta}
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-gold hover:border-gold/40"
              >
                <Play className="mr-1 w-4 h-4" />
                {secondaryCta}
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5 max-w-xl">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur px-4 py-4"
                >
                  <div className="font-display font-black text-2xl sm:text-3xl text-gold">{s.value}</div>
                  <div className="mt-0.5 text-[11px] sm:text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Champions collage */}
          <div className="lg:col-span-6 xl:col-span-5">
            {/* Title above collage */}
            <div className="relative mb-4 flex items-center justify-end gap-3">
              <Sparkles className="w-5 h-5 text-gold float-slow" />
              <div className="text-right">
                <span className="block text-gold text-xs uppercase tracking-[0.4em] font-bold">YKS</span>
                <span className="block font-display font-black text-white text-3xl sm:text-4xl leading-tr italic">
                  Şampiyonlarımız
                </span>
              </div>
              <Trophy className="w-9 h-9 text-gold float-slower" />
            </div>

            <div className="relative aspect-[5/4.6] w-full max-w-[600px] ml-auto">
              {/* Doodle */}
              <Star className="absolute top-2 left-6 w-5 h-5 text-gold fill-current float-slower z-30" />
              <Sparkles className="absolute bottom-8 right-2 w-5 h-5 text-gold float-slow z-30" />

              {/* Center big photo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] aspect-[3/4] rounded-3xl overflow-hidden ring-4 ring-gold/70 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] z-20">
                <img src={c1.img} alt={c1.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent p-3">
                  <div className="text-white text-xs sm:text-sm font-semibold leading-tight">{c1.name}</div>
                  <div className="text-gold text-[11px] font-bold">{c1.rank}</div>
                </div>
              </div>

              {/* Top left photo */}
              <div className="absolute left-[2%] top-[6%] w-[30%] aspect-[3/4] rounded-2xl overflow-hidden ring-4 ring-white/80 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] rotate-[-8deg] z-10">
                <img src={c3.img} alt={c3.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-ink/85 p-2">
                  <div className="text-white text-[10px] font-semibold leading-tight truncate">{c3.name}</div>
                  <div className="text-gold text-[9px] font-bold">{c3.rank}</div>
                </div>
              </div>

              {/* Top right photo */}
              <div className="absolute right-[2%] top-[6%] w-[30%] aspect-[3/4] rounded-2xl overflow-hidden ring-4 ring-white/80 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] rotate-[8deg] z-10">
                <img src={c2.img} alt={c2.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-ink/85 p-2">
                  <div className="text-white text-[10px] font-semibold leading-tight truncate">{c2.name}</div>
                  <div className="text-gold text-[9px] font-bold">{c2.rank}</div>
                </div>
              </div>

              {/* Bottom left photo */}
              <div className="absolute left-[6%] bottom-[2%] w-[28%] aspect-[3/4] rounded-2xl overflow-hidden ring-4 ring-white/80 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] rotate-[6deg] z-10">
                <img src={c4.img} alt={c4.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-ink/85 p-2">
                  <div className="text-white text-[10px] font-semibold leading-tight truncate">{c4.name}</div>
                  <div className="text-gold text-[9px] font-bold">{c4.rank}</div>
                </div>
              </div>

              {/* Bottom right photo */}
              <div className="absolute right-[6%] bottom-[2%] w-[28%] aspect-[3/4] rounded-2xl overflow-hidden ring-4 ring-white/80 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] rotate-[-6deg] z-10">
                <img src={c5.img} alt={c5.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-ink/85 p-2">
                  <div className="text-white text-[10px] font-semibold leading-tight truncate">{c5.name}</div>
                  <div className="text-gold text-[9px] font-bold">{c5.rank}</div>
                </div>
              </div>

              {/* Feature badges */}
              <div className="absolute -left-3 top-[46%] z-30 float-slower">
                <FeatureBadge b={HERO.badges[0]} />
              </div>
              <div className="absolute -right-2 top-[38%] z-30 float-slow">
                <FeatureBadge b={HERO.badges[1]} />
              </div>
              <div className="absolute left-[20%] -bottom-4 z-30 float-slow">
                <FeatureBadge b={HERO.badges[2]} />
              </div>
              <div className="absolute right-[16%] -bottom-4 z-30 float-slower">
                <FeatureBadge b={HERO.badges[3]} />
              </div>
              <div className="absolute -left-4 bottom-[24%] z-30 float-slow">
                <FeatureBadge b={HERO.badges[4]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureBadge = ({ b }) => {
  const Icon = badgeIcon[b.icon] || Users;
  return (
    <div
      className="inline-flex items-center gap-2 pl-2 pr-3.5 py-2 rounded-full shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6)] font-semibold text-xs sm:text-sm ring-2 ring-white/15 whitespace-nowrap"
      style={{ backgroundColor: b.color, color: b.text }}
    >
      <span
        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
      >
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </span>
      {b.label}
    </div>
  );
};

export default Hero;
