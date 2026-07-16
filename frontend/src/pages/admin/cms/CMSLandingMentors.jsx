import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Plus, Trash2, Edit3, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { useToast } from '../../../hooks/use-toast';
import { EmptyState } from '../../../components/panel/parts';

const emptyMentor = { name: '', role: '', img: '', sort_order: 100, is_active: true };

const CMSLandingMentors = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMentor);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await api.get('/admin/cms/mentors');
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const refresh = () => window.postMessage({ type: 'cms:refresh' }, '*');

  const openCreate = () => { setForm({ ...emptyMentor }); setEditing(null); setOpen(true); };
  const openEdit = (m) => { setForm({ ...m }); setEditing(m); setOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) return toast({ title: 'Ad ve ünvan zorunlu' });
    const payload = { ...form, sort_order: Number(form.sort_order) || 100 };
    if (editing) await api.patch(`/admin/cms/mentors/${editing.id}`, payload);
    else await api.post('/admin/cms/mentors', payload);
    toast({ title: editing ? 'Güncellendi ✓' : 'Eklendi ✓' });
    setOpen(false); load(); refresh();
  };

  const remove = async (m) => {
    if (!window.confirm(`${m.name} silinsin mi?`)) return;
    await api.delete(`/admin/cms/mentors/${m.id}`);
    load(); refresh();
  };

  const toggleActive = async (m) => {
    await api.patch(`/admin/cms/mentors/${m.id}`, { is_active: !m.is_active });
    load(); refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-sm">Landing sayfasının mentorlar carousel'inde görünen kişiler.</div>
        <Button onClick={openCreate} className="bg-gold hover:bg-gold-light text-ink font-semibold"><Plus className="w-4 h-4 mr-1" /> Mentor Ekle</Button>
      </div>

      {items.length === 0 && <EmptyState icon={User} title="Mentor yok" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-ink-3 relative">
              {m.img ? <img src={m.img} alt={m.name} className="w-full h-full object-cover" /> : (
                <div className="flex items-center justify-center h-full text-white/30"><User className="w-8 h-8" /></div>
              )}
              {!m.is_active && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-300 font-bold text-xs">Pasif</div>}
            </div>
            <div className="mt-3 px-1">
              <div className="text-white font-semibold text-sm truncate">{m.name}</div>
              <div className="text-xs text-white/50 truncate">{m.role}</div>
              <div className="text-[10px] text-white/40 mt-1">Sıra: {m.sort_order}</div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <button onClick={() => openEdit(m)} className="flex-1 h-8 rounded-md bg-white/[0.05] hover:bg-white/10 text-white/80 text-xs flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Düzenle</button>
              <button onClick={() => toggleActive(m)} className="w-8 h-8 rounded-md bg-white/[0.05] hover:bg-white/10 text-white/70 flex items-center justify-center">
                <Switch checked={!!m.is_active} className="pointer-events-none" />
              </button>
              <button onClick={() => remove(m)} className="w-8 h-8 rounded-md hover:bg-red-500/10 text-red-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Mentoru Düzenle' : 'Yeni Mentor'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">İsim</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Rol / Ünvan</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" placeholder="YKS Koçu • Boğaziçi" />
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Fotoğraf URL</Label>
              <Input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} className="input" placeholder="https://" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Sıra No</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <span className="text-white/80 text-sm">Aktif</span>
              </div>
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

export default CMSLandingMentors;
