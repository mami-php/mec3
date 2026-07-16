import React from 'react';
import {
  UserCheck, Activity, CalendarClock, BookOpenCheck, ClipboardList, Users,
} from 'lucide-react';
import { FEATURES } from '../../mock';

const iconMap = { UserCheck, Activity, CalendarClock, BookOpenCheck, ClipboardList, Users };

const Features = () => {
  return (
    <section id="kocluk" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.3em]">
            Koçum Sınav Neler Sunar?
          </p>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
            Senin programına uygun,{' '}
            <span className="gold-text italic">sana özel</span> koçluk deneyimi.
          </h2>
          <p className="mt-5 text-white/60 text-lg">
            Her öğrenciye hedeflerine ve çalışma düzenine uygun birebir koçluk desteği sunuyoruz.
            Düzenli görüşmeler, kişisel çalışma programı ve takip sistemi ile sürecin planlı ilerler.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = iconMap[f.icon];
            return (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7 card-lift hover:border-gold/40"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gold/15 border border-gold/25 text-gold group-hover:bg-gold group-hover:text-ink transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-white/40 font-semibold">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display font-bold text-xl text-white">{f.title}</h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">{f.desc}</p>

                <div className="absolute inset-x-7 -bottom-px h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
