import React from 'react';
import { Instagram, Youtube, Facebook, Twitter, Phone, Mail, MapPin, Apple, Play } from 'lucide-react';
import Logo from './Logo';
import { FOOTER } from '../../mock';

const Footer = () => {
  return (
    <footer className="relative bg-ink border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 text-white/60 max-w-sm text-sm leading-relaxed">
              {FOOTER.tagline} Derece yapmış koçlar, uzman PDR danışmanları ve teknolojiyle desteklenmiş bir sistem.
            </p>

            <div className="mt-6 space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold" /> {FOOTER.contact.phone}
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold" /> {FOOTER.contact.email}
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold" /> {FOOTER.contact.address}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-white hover:border-gold/40 hover:text-gold transition-colors text-xs font-semibold">
                <Apple className="w-4 h-4" /> App Store
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-white hover:border-gold/40 hover:text-gold transition-colors text-xs font-semibold">
                <Play className="w-4 h-4" /> Google Play
              </a>
            </div>
          </div>

          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/60 hover:text-gold transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {FOOTER.brand}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2">
            {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-gold hover:text-ink hover:border-gold transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
