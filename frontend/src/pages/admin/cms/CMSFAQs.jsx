import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Plus, Trash2, Edit3, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { useToast } from '../../../hooks/use-toast';
import { EmptyState } from '../../../components/panel/parts';

const emptyGroup = { title: '', items: [], sort_order: 100, is_active: true };

const CMSFAQs = () => {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyGroup);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await api.get('/admin/cms/faqs');
    setGroups(data);
  };
  useEffect(() => { load(); }, []);
  const refresh = () => window.postMessage({ type: 'cms:refresh' }, '*');

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, sort_order: Number(form.sort_order) };
    if (editing) await api.patch(`/admin/cms/faqs/${editing.id}`, payload);
    else await api.post('/admin/cms/faqs', payload);
    toast({ title: 'Kaydedildi ✓' });
    setOpen(false); load(); refresh();
  };

  const remove = async (g) => {
    if (!window.confirm(`"${g.title}" grubu silinsin mi?`)) return;
    await api.delete(`/admin/cms/faqs/${g.id}`);
    load(); refresh();
  };

  const addQA = () => setForm({ ...form, items: [...(form.items || []), { q: '', a: '' }] });
  const updQA = (i, k, v) => setForm({ ...form, items: form.items.map((x, idx) => idx === i ? { ...x, [k]: v } : x) });
  const rmQA = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-sm">S.S.S bölümündeki gruplar ve sorular</div>
        <Button onClick={() => { setForm({ ...emptyGroup, items: [] }); setEditing(null); setOpen(true); }} className="bg-gold hover:bg-gold-light text-ink font-semibold"><Plus className="w-4 h-4 mr-1" /> Grup Ekle</Button>
      </div>

      {groups.length === 0 && <EmptyState icon={HelpCircle} title="S.S.S grubu yok" />}

      <div className="space-y-3">
        {groups.map((g) => (
          <div key={g.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-white text-lg">{g.title}</div>
                <div className="text-xs text-white/50">{g.items?.length || 0} soru • Sıra: {g.sort_order} {!g.is_active && <span className="text-red-300 ml-2">(Pasif)</span>}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setForm({ ...g }); setEditing(g); setOpen(true); }} className="w-9 h-9 rounded-md bg-white/[0.05] hover:bg-white/10 text-white/80 flex items-center justify-center"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => remove(g)} className="w-9 h-9 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {(g.items || []).map((it, i) => (
                <li key={i} className="text-sm text-white/70 flex gap-2">
                  <span className="text-gold shrink-0">Q:</span>{it.q}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Grubu Düzenle' : 'Yeni S.S.S Grubu'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Grup Başlığı</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Örn: Koçluk Sistemi" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Sıra</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input" /></div>
              <div className="flex items-center gap-2 pt-6"><Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><span className="text-white/80 text-sm">Aktif</span></div>
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-2 block">Soru & Cevaplar</Label>
              <div className="space-y-3">
                {(form.items || []).map((it, i) => (
                  <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input value={it.q} onChange={(e) => updQA(i, 'q', e.target.value)} placeholder="Soru" className="input" />
                        <Textarea rows={3} value={it.a} onChange={(e) => updQA(i, 'a', e.target.value)} placeholder="Cevap" className="input" />
                      </div>
                      <button type="button" onClick={() => rmQA(i)} className="w-8 h-8 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" onClick={addQA} variant="outline" className="mt-2 border-white/15 text-white hover:bg-white/5"><Plus className="w-3.5 h-3.5 mr-1" /> Soru Ekle</Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-white/15 text-white hover:bg-white/5">Vazgeç</Button>
              <Button type="submit" className="bg-gold hover:bg-gold-light text-ink font-semibold">Kaydet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSFAQs;
