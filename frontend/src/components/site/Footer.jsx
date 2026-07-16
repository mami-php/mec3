import React from 'react';
import { Instagram, Youtube, Facebook, Twitter, Phone, Mail, MapPin, Apple, Play } from 'lucide-react';
import Logo from './Logo';
import { useSiteContent } from '../../lib/cms';

const socialIcon = { instagram: Instagram, youtube: Youtube, facebook: Facebook, twitter: Twitter };

const Footer = () => {
  const { content } = useSiteContent();
  const g = content.general || {};
  const f = content.footer || {};
  const social = g.social || {};

  const copyright = f.copyright || `© ${new Date().getFullYear()} ${g.site_name || 'Koçum Sınav'}. Tüm hakları saklıdır.`;

  return (
    <footer className="relative bg-ink border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo brandPrefix={g.brand_prefix} brandSuffix={g.brand_suffix} tagline={g.brand_tagline} />
            <p className="mt-5 text-white/60 max-w-sm text-sm leading-relaxed">
              {f.tagline}
            </p>

            <div className="mt-6 space-y-2 text-sm text-white/60">
              {g.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold" /> {g.phone}
                </div>
              )}
              {g.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold" /> {g.email}
                </div>
              )}
              {g.address && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gold" /> {g.address}
                </div>
              )}
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

          {(f.columns || []).map((col, i) => (
            <div key={i}>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {(col.links || []).map((l, j) => (
                  <li key={j}>
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
          <p className="text-xs text-white/40">{copyright}</p>
          <div className="flex items-center gap-2">
            {Object.entries(socialIcon).map(([k, Icon]) => (
              social[k] ? (
                <a
                  key={k}
                  href={social[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-gold hover:text-ink hover:border-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
