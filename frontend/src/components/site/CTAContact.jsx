import React, { useState } from 'react';
import { Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '../../hooks/use-toast';

const CTAContact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', role: 'ogrenci', kvkk: false });
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: 'Eksik bilgi', description: 'Adınız ve telefon numaranız gereklidir.' });
      return;
    }
    if (!form.kvkk) {
      toast({ title: 'KVKK Onayı', description: 'Lütfen KVKK metnini onaylayınız.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Çağrı talebiniz alındı ✓',
        description: `Merhaba ${form.name}, uzman ekibimiz sizi en kısa sürede arayacaktır.`,
      });
      setForm({ name: '', phone: '', role: 'ogrenci', kvkk: false });
    }, 900);
  };

  return (
    <section id="iletisim" className="relative py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-ink-2 via-ink to-ink p-8 sm:p-12 lg:p-16 grain">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Kararsız mısın?
              </div>
              <h2 className="mt-5 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
                Hedefine en uygun <span className="gold-text italic">yol haritasını</span> beraber çizelim.
              </h2>
              <p className="mt-5 text-white/70 text-lg max-w-lg">
                Sana uygun saatte ilettiğimiz ücretsiz görüşmede uzman eğitim danışmanlarımız sana özel çalışma planı hazırlar.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-gold">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  Bilgilerin gizlidir, 3. şahıslarla paylaşılmaz.
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-gold">
                    <Phone className="w-4 h-4" />
                  </span>
                  0 850 000 00 00 numaramızdan ulaşabilirsin.
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-gold">
                    <Mail className="w-4 h-4" />
                  </span>
                  destek@kocumsinav.com
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="relative bg-ink/60 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="font-display font-bold text-2xl text-white">Sizi Arayalım</div>
              <p className="text-sm text-white/60 mt-1">Formu doldur, uzman ekibimiz seni kısa sürede arasın.</p>

              <div className="mt-6">
                <Label className="text-white/80 text-sm">Kimsin?</Label>
                <RadioGroup
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v })}
                  className="mt-2 grid grid-cols-2 gap-3"
                >
                  {[
                    { v: 'ogrenci', l: 'Öğrenciyim' },
                    { v: 'veli', l: 'Veliyim' },
                  ].map((o) => (
                    <label
                      key={o.v}
                      htmlFor={`role-${o.v}`}
                      className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        form.role === o.v
                          ? 'bg-gold/15 border-gold text-white'
                          : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <RadioGroupItem value={o.v} id={`role-${o.v}`} className="border-gold text-gold" />
                      {o.l}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="mt-4">
                <Label htmlFor="name" className="text-white/80 text-sm">Ad Soyad</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Adınız"
                  className="mt-2 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50"
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="phone" className="text-white/80 text-sm">Telefon</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="5xx xxx xx xx"
                  className="mt-2 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50"
                />
                <p className="mt-1.5 text-[11px] text-white/40">Başında 0 olmadan 10 hane olacak şekilde girin.</p>
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-xs text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.kvkk}
                  onChange={(e) => setForm({ ...form, kvkk: e.target.checked })}
                  className="mt-0.5 accent-gold"
                />
                <span>
                  <a href="#" className="text-gold hover:underline">Kişisel Verilerin Korunması</a> metnini okudum ve kabul ediyorum.
                </span>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="mt-5 w-full h-12 bg-gold hover:bg-gold-light text-ink font-semibold shadow-[0_16px_40px_-14px_rgba(201,169,97,0.7)]"
              >
                {loading ? 'Gönderiliyor...' : 'Ücretsiz Görüşme Talep Et'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAContact;
