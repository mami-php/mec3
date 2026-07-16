import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useCMSSection, SectionCard, FormField, SaveBar, Input, Textarea } from './cms-parts';
import { Button } from '../../../components/ui/button';

const CMSFooter = () => {
  const { content, setContent, saving, save } = useCMSSection('footer');
  const cols = content.columns || [];
  const setCols = (arr) => setContent({ ...content, columns: arr });

  const updateCol = (i, k, v) => setCols(cols.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const removeCol = (i) => setCols(cols.filter((_, idx) => idx !== i));
  const addCol = () => setCols([...cols, { title: 'Yeni Kolon', links: [] }]);

  const updLink = (ci, li, v) => {
    const col = cols[ci];
    const newLinks = col.links.map((l, idx) => idx === li ? v : l);
    updateCol(ci, 'links', newLinks);
  };
  const addLink = (ci) => updateCol(ci, 'links', [...(cols[ci].links || []), 'Yeni Link']);
  const removeLink = (ci, li) => updateCol(ci, 'links', cols[ci].links.filter((_, idx) => idx !== li));

  return (
    <div className="space-y-5 pb-24">
      <SectionCard title="Footer Slogan" description="Logo altında görünen kısa açıklama">
        <FormField label="Slogan / Tagline">
          <Textarea rows={3} value={content.tagline || ''} onChange={(e) => setContent({ ...content, tagline: e.target.value })} className="input" />
        </FormField>
        <FormField label="Copyright yazısı (boş bırakılırsa otomatik)">
          <Input value={content.copyright || ''} onChange={(e) => setContent({ ...content, copyright: e.target.value })} className="input" placeholder="© 2026 Koçum Sınav. Tüm hakları saklıdır." />
        </FormField>
      </SectionCard>

      <SectionCard title="Footer Kolonları" description="Footer'daki link kolonları (Ürünler, Kurumsal, Destek gibi)">
        <div className="space-y-4">
          {cols.map((c, ci) => (
            <div key={ci} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Input value={c.title || ''} onChange={(e) => updateCol(ci, 'title', e.target.value)} placeholder="Kolon Başlığı" className="input flex-1 font-semibold" />
                <button onClick={() => removeCol(ci)} className="w-9 h-9 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-1.5">
                {(c.links || []).map((l, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <Input value={l} onChange={(e) => updLink(ci, li, e.target.value)} className="input flex-1" />
                    <button onClick={() => removeLink(ci, li)} className="w-8 h-8 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <Button onClick={() => addLink(ci)} variant="outline" size="sm" className="border-white/15 text-white hover:bg-white/5 h-8 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Link Ekle
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addCol} variant="outline" className="border-white/15 text-white hover:bg-white/5 w-full">
            <Plus className="w-4 h-4 mr-1" /> Yeni Kolon Ekle
          </Button>
        </div>
      </SectionCard>

      <SaveBar onSave={() => save(content)} saving={saving} />
    </div>
  );
};

export default CMSFooter;
