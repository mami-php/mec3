import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { MENTORS } from '../../mock';
import { useSiteCollection } from '../../lib/cms';

const Mentors = () => {
  const { items } = useSiteCollection('/site/mentors');
  const list = items.length > 0 ? items : MENTORS;
  const doubled = [...list, ...list];
  return (
    <section id="mentorlar" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-gold text-sm font-semibold uppercase tracking-[0.3em]">Uzman Kadromuz</p>
            <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
              Sana uygun <span className="gold-text italic">YKS koçunu</span> seç.
            </h2>
            <p className="mt-5 text-white/60 text-lg">
              Hedeflerine, seviyene ve hazırlandığın sınava uygun öğrenci koçluğu ile kişisel çalışma planını oluştur.
            </p>
          </div>

          <a
            href="#"
            className="group inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
          >
            Tüm mentorları gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      <div className="mt-14 relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-ink to-transparent pointer-events-none" />

        <div className="marquee-slow flex gap-6 w-max">
          {doubled.map((m, i) => (
            <div
              key={i}
              className="w-[280px] shrink-0 rounded-2xl border border-white/10 bg-gradient-to-b from-ink-2 to-ink p-4 hover:border-gold/40 transition-colors"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-ink-3">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur border border-gold/25 text-[11px] text-gold font-semibold">
                  <GraduationCap className="w-3 h-3" />
                  Mentor
                </div>
              </div>
              <div className="pt-4 px-1">
                <div className="font-display font-bold text-lg text-white">{m.name}</div>
                <div className="text-xs text-white/60 mt-0.5">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentors;
