import React from 'react';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useCMSSection, SectionCard, FormField, SaveBar, Input } from './cms-parts';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';

const CMSHeader = () => {
  const { content, setContent, saving, save } = useCMSSection('header');
  const menu = content.menu || [];

  const setMenu = (arr) => setContent({ ...content, menu: arr });
  const updateItem = (i, k, v) => setMenu(menu.map((m, idx) => idx === i ? { ...m, [k]: v } : m));
  const removeItem = (i) => setMenu(menu.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= menu.length) return;
    const copy = [...menu];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setMenu(copy);
  };
  const addItem = () => setMenu([...menu, { label: 'Yeni Bağlantı', href: '#' }]);

  return (
    <div className="space-y-5 pb-24">
      <SectionCard title="Menü" description="Header'da görünen navigasyon linkleri. Sıraya göre dizilir.">
        <div className="space-y-2">
          {menu.map((m, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/10">
              <GripVertical className="w-4 h-4 text-white/30" />
              <Input value={m.label} onChange={(e) => updateItem(i, 'label', e.target.value)} placeholder="Etiket" className="input flex-1" />
              <Input value={m.href} onChange={(e) => updateItem(i, 'href', e.target.value)} placeholder="#section veya /path" className="input flex-1" />
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} className="w-8 h-8 rounded-md hover:bg-white/5 text-white/60 flex items-center justify-center"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(i, +1)} className="w-8 h-8 rounded-md hover:bg-white/5 text-white/60 flex items-center justify-center"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => removeItem(i)} className="w-8 h-8 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          <Button onClick={addItem} variant="outline" className="border-white/15 text-white hover:bg-white/5 w-full">
            <Plus className="w-4 h-4 mr-1" /> Yeni Menü Kalemi
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Header Butonlar" description="Sağ taraftaki 'Giriş Yap' ve 'Kayıt Ol / Ücretsiz Görüşme' butonları">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Giriş Yap Yazısı"><Input value={content.login_label || ''} onChange={(e) => setContent({ ...content, login_label: e.target.value })} className="input" /></FormField>
          <FormField label="Kayıt / CTA Butonu Yazısı"><Input value={content.register_label || ''} onChange={(e) => setContent({ ...content, register_label: e.target.value })} className="input" /></FormField>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Switch checked={!!content.phone_visible} onCheckedChange={(v) => setContent({ ...content, phone_visible: v })} />
          <span className="text-white/80 text-sm">Header'da telefon numarası görünsün</span>
        </div>
      </SectionCard>

      <SaveBar onSave={() => save(content)} saving={saving} />
    </div>
  );
};

export default CMSHeader;
