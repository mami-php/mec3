import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Plus, Trash2, Edit3, MessageCircle, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { useToast } from '../../../hooks/use-toast';
import { EmptyState } from '../../../components/panel/parts';

const empty = { name: '', role: '', text: '', rating: 5, sort_order: 100, is_active: true };

const CMSTestimonials = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await api.get('/admin/cms/testimonials');
    setItems(data);
  };
  useEffect(() => { load(); }, []);
  const refresh = () => window.postMessage({ type: 'cms:refresh' }, '*');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) return toast({ title: 'İsim ve yorum zorunlu' });
    const payload = { ...form, rating: Number(form.rating), sort_order: Number(form.sort_order) };
    if (editing) await api.patch(`/admin/cms/testimonials/${editing.id}`, payload);
    else await api.post('/admin/cms/testimonials', payload);
    toast({ title: 'Kaydedildi ✓' });
    setOpen(false); load(); refresh();
  };

  const remove = async (t) => {
    if (!window.confirm('Silinsin mi?')) return;
    await api.delete(`/admin/cms/testimonials/${t.id}`);
    load(); refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-sm">Landing sayfasının Referanslar bölümünde görünen yorumlar.</div>
        <Button onClick={() => { setForm({ ...empty }); setEditing(null); setOpen(true); }} className="bg-gold hover:bg-gold-light text-ink font-semibold"><Plus className="w-4 h-4 mr-1" /> Referans Ekle</Button>
      </div>

      {items.length === 0 && <EmptyState icon={MessageCircle} title="Yorum yok" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-1 text-gold mb-2">{Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="w-3.5 h-3.5 fill-current" />)}</div>
            <p className="text-sm text-white/85 line-clamp-3">“{t.text}”</p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-[11px] text-white/50">{t.role}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setForm({ ...t }); setEditing(t); setOpen(true); }} className="w-8 h-8 rounded-md bg-white/[0.05] hover:bg-white/10 text-white/70 flex items-center justify-center"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(t)} className="w-8 h-8 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            {!t.is_active && <div className="mt-2 text-[10px] text-red-300 font-bold uppercase tracking-wider">Pasif</div>}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Referans Düzenle' : 'Yeni Referans'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">İsim</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Rol</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" placeholder="Öğrenci / Veli" /></div>
            </div>
            <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Yorum</Label><Textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="input" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Puan (1-5)</Label><Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input" /></div>
              <div><Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Sıra</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input" /></div>
              <div className="flex items-center gap-2 pt-6"><Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><span className="text-white/80 text-sm">Aktif</span></div>
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

export default CMSTestimonials;
