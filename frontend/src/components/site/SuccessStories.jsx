import React from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { SUCCESS_STORIES } from '../../mock';

const SuccessStories = () => {
  return (
    <section id="basari" className="relative py-24 lg:py-32 bg-ink-2/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            YKS Şampiyonlarımız
          </div>
          <h2 className="mt-5 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
            Sıfırdan başlayıp{' '}
            <span className="gold-text italic">derece</span> yapanlar.
          </h2>
          <p className="mt-5 text-white/60 text-lg">
            Koçum Sınav ile başarıya ulaşan öğrencilerimizin geleceğe taşıdığı hikayeler.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((s) => (
            <div
              key={s.name}
              className="group relative rounded-2xl overflow-hidden bg-ink border border-white/10 hover:border-gold/40 transition-colors card-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-gold text-ink text-[11px] font-bold uppercase tracking-wider">
                    {s.field}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-ink/80 backdrop-blur border border-white/15 text-white text-[11px] font-semibold">
                    Sıralama {s.rank}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-display font-bold text-xl text-white">{s.name}</div>
                  <div className="text-sm text-gold mt-0.5">{s.dept}</div>
                </div>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.04] border border-white/10 px-4 py-3">
                  <div className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">TYT Net</div>
                  <div className="font-display font-black text-xl text-white mt-0.5">{s.tyt}</div>
                </div>
                <div className="rounded-lg bg-white/[0.04] border border-white/10 px-4 py-3">
                  <div className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">AYT Net</div>
                  <div className="font-display font-black text-xl text-white mt-0.5">{s.ayt}</div>
                </div>
              </div>

              <a
                href="#"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink/70 backdrop-blur border border-white/15 flex items-center justify-center text-white hover:bg-gold hover:text-ink hover:border-gold transition-all"
                aria-label={`${s.name} detaylar`}
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
