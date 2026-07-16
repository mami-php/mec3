import React, { useState } from 'react';
import { Phone, X, User, Smartphone, StickyNote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';

const SideCallButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', surname: '', phone: '', note: '' });
  const { toast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.phone) {
      toast({
        title: 'Eksik bilgi',
        description: 'Ad, soyad ve telefon zorunludur.',
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: 'Çağrı talebiniz alındı ✓',
        description: `Merhaba ${form.name}, uzman ekibimiz sizi en kısa sürede arayacaktır.`,
      });
      setForm({ name: '', surname: '', phone: '', note: '' });
    }, 900);
  };

  return (
    <>
      {/* Vertical sticky button - right center */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ücretsiz Görüşme"
        className="group fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none"
      >
        <span className="relative flex items-center gap-2 bg-gold hover:bg-gold-light active:bg-gold-dark text-ink font-bold px-3 py-6 rounded-l-2xl shadow-[-10px_16px_40px_-14px_rgba(201,169,97,0.6)] border-l border-t border-b border-white/10 transition-colors">
          <span className="absolute -left-1 inset-y-0 w-1 rounded-l-2xl bg-ink/20" />
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-ink text-gold">
            <Phone className="w-3.5 h-3.5" />
          </span>
          <span
            className="text-[13px] tracking-widest uppercase font-black"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Ücretsiz Görüşme
          </span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px] bg-ink border border-gold/25 text-white p-0 overflow-hidden">
          {/* Decorative header */}
          <div className="relative px-7 pt-8 pb-6 bg-gradient-to-br from-ink-2 to-ink border-b border-white/10">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
            <DialogHeader className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[11px] font-semibold uppercase tracking-wider w-fit">
                <Phone className="w-3 h-3" />
                Sizi Arayalım
              </div>
              <DialogTitle className="mt-3 font-display font-black text-2xl text-white">
                Ücretsiz görüşme talebi oluştur
              </DialogTitle>
              <DialogDescription className="text-white/60 mt-1 text-sm">
                Formu doldur, uzman eğitim danışmanlarımız sana kısa sürede ulaşsın.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={submit} className="px-7 py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scb-name" className="text-white/80 text-xs uppercase tracking-wider font-semibold">
                  İsim
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="scb-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Adınız"
                    className="pl-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50 h-11"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="scb-surname" className="text-white/80 text-xs uppercase tracking-wider font-semibold">
                  Soyisim
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="scb-surname"
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.target.value })}
                    placeholder="Soyadınız"
                    className="pl-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50 h-11"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="scb-phone" className="text-white/80 text-xs uppercase tracking-wider font-semibold">
                Telefon
              </Label>
              <div className="relative mt-2">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="scb-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="5xx xxx xx xx"
                  className="pl-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50 h-11"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/40">Başında 0 olmadan 10 hane olacak şekilde girin.</p>
            </div>

            <div>
              <Label htmlFor="scb-note" className="text-white/80 text-xs uppercase tracking-wider font-semibold">
                Not (opsiyonel)
              </Label>
              <div className="relative mt-2">
                <StickyNote className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <Textarea
                  id="scb-note"
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Hangi sınava hazırlanıyorsun, ne konuşmak istersin?"
                  className="pl-9 pt-2.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50 resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gold hover:bg-gold-light text-ink font-semibold shadow-[0_16px_40px_-14px_rgba(201,169,97,0.7)]"
            >
              {loading ? 'Gönderiliyor...' : 'Görüşme Talebi Oluştur'}
            </Button>

            <p className="text-center text-[11px] text-white/40">
              Bilgilerin gizlidir, üçüncü şahıslarla paylaşılmaz.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideCallButton;
