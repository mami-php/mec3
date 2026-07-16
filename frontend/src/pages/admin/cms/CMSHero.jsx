import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCMSSection, SectionCard, FormField, SaveBar, Input, Textarea } from './cms-parts';
import { Button } from '../../../components/ui/button';

const CMSHero = () => {
  const { content, setContent, saving, save } = useCMSSection('hero');
  const stats = content.stats || [];
  const setStats = (arr) => setContent({ ...content, stats: arr });

  return (
    <div className="space-y-5 pb-24">
      <SectionCard title="Başlık & Açıklama" description="Landing sayfasının en üst kısmı">
        <FormField label="Küçük üst yazı (eyebrow)"><Input value={content.eyebrow || ''} onChange={(e) => setContent({ ...content, eyebrow: e.target.value })} className="input" /></FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Başlık - Altın Kısım" hint="Başlığın üst satırı (italik, altın)"><Input value={content.title_gold || ''} onChange={(e) => setContent({ ...content, title_gold: e.target.value })} className="input" /></FormField>
          <FormField label="Başlık - Beyaz Kısım" hint="Başlığın alt satırı (dalgalı alt çizgili)"><Input value={content.title_white || ''} onChange={(e) => setContent({ ...content, title_white: e.target.value })} className="input" /></FormField>
        </div>
        <FormField label="Açıklama"><Textarea rows={3} value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} className="input" /></FormField>
      </SectionCard>

      <SectionCard title="Butonlar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ana Buton Yazısı"><Input value={content.primary_cta || ''} onChange={(e) => setContent({ ...content, primary_cta: e.target.value })} className="input" /></FormField>
          <FormField label="İkincil Buton Yazısı"><Input value={content.secondary_cta || ''} onChange={(e) => setContent({ ...content, secondary_cta: e.target.value })} className="input" /></FormField>
        </div>
      </SectionCard>

      <SectionCard title="İstatistik Kartları" description="Hero altındaki 3 istatistik kartı">
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/10">
              <Input value={s.value || ''} onChange={(e) => setStats(stats.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} placeholder="1.500+" className="input w-40" />
              <Input value={s.label || ''} onChange={(e) => setStats(stats.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} placeholder="Başarı Hikayesi" className="input flex-1" />
              <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="w-8 h-8 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <Button onClick={() => setStats([...stats, { value: '', label: '' }])} variant="outline" className="border-white/15 text-white hover:bg-white/5 w-full">
            <Plus className="w-4 h-4 mr-1" /> Kart Ekle
          </Button>
        </div>
      </SectionCard>

      <SaveBar onSave={() => save(content)} saving={saving} />
    </div>
  );
};

export default CMSHero;
