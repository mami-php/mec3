import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../mock';

const Testimonials = () => {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.3em]">Referanslarımız</p>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
            <span className="gold-text italic">Öğrencilerimiz</span> ne diyor?
          </h2>
          <p className="mt-5 text-white/60 text-lg">
            Koçum Sınav ile başarıya ulaşanlar deneyimlerini paylaşıyor.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7 card-lift hover:border-gold/40"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/30" />
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-white/85 leading-relaxed text-[15px]">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
