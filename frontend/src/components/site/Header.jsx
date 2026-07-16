import React, { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import Logo from './Logo';
import { useSiteContent } from '../../lib/cms';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { content } = useSiteContent();
  const menu = content.header?.menu || [];
  const loginLabel = content.header?.login_label || 'Giriş Yap';
  const registerLabel = content.header?.register_label || 'Ücretsiz Görüşme';
  const phoneVisible = content.header?.phone_visible !== false;
  const phone = content.general?.phone;
  const brand = content.general || {};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,border] duration-300 ${
        scrolled
          ? 'bg-ink/85 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between">
        <Logo brandPrefix={brand.brand_prefix} brandSuffix={brand.brand_suffix} tagline={brand.brand_tagline} />

        <nav className="hidden lg:flex items-center gap-1">
          {menu.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="relative px-3.5 py-2 text-sm font-medium text-white/80 hover:text-gold transition-colors rounded-md"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {phoneVisible && phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          )}
          <a
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/15 hover:border-gold/40 hover:text-gold transition-colors"
          >
            {loginLabel}
          </a>
          <Button
            className="bg-gold hover:bg-gold-light text-ink font-semibold shadow-[0_10px_28px_-10px_rgba(201,169,97,0.7)]"
          >
            {registerLabel}
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Menü" className="lg:hidden p-2 rounded-md text-white hover:bg-white/5">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-ink border-l border-white/10 text-white w-[86%] sm:w-[380px]">
            <div className="flex items-center justify-between mb-8">
              <Logo brandPrefix={brand.brand_prefix} brandSuffix={brand.brand_suffix} tagline={brand.brand_tagline} />
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {menu.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-base font-medium text-white/85 hover:bg-white/5 hover:text-gold transition"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <Button className="mt-6 w-full bg-gold hover:bg-gold-light text-ink font-semibold">
              {registerLabel}
            </Button>
            <a href="/login" className="mt-3 block text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white border border-white/15 hover:border-gold/40 hover:text-gold transition-colors">
              {loginLabel}
            </a>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
