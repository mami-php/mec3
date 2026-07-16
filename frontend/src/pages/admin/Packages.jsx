import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Package as PackageIcon } from 'lucide-react';
import api from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { EmptyState } from '../../components/panel/parts';
import { useToast } from '../../hooks/use-toast';

const emptyPkg = { name: '', duration_days: 30, price: 0, description: '', features: [], is_active: true };

const PackagesPage = ({ onMount }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPkg);
  const [featureInput, setFeatureInput] = useState('');
  const { toast } = useToast();

  useEffect(() => { onMount && onMount(); }, [onMount]);

  const load = async () => {
    const { data } = await api.get('/admin/packages');
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ ...emptyPkg, features: [] }); setEditing(null); setOpen(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p); setOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.duration_days) {
      toast({ title: 'Ad ve süre zorunlu' });
      return;
    }
    const payload = { ...form, duration_days: Number(form.duration_days), price: Number(form.price) };
    if (editing) await api.patch(`/admin/packages/${editing.id}`, payload);
    else await api.post('/admin/packages', payload);
    toast({ title: editing ? 'Güncellendi ✓' : 'Eklendi ✓' });
    setOpen(false);
    load();
  };

  const remove = async (p) => {
    if (!window.confirm(`${p.name} silinsin mi?`)) return;
    await api.delete(`/admin/packages/${p.id}`);
    load();
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((f) => ({ ...f, features: [...(f.features || []), featureInput.trim()] }));
    setFeatureInput('');
  };
  const removeFeature = (i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-white/60 text-sm">Sistemdeki tüm mentorluk paketleri</p>
        </div>
        <Button onClick={openCreate} className="bg-gold hover:bg-gold-light text-ink font-semibold h-10">
          <Plus className="w-4 h-4 mr-1" /> Yeni Paket
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={PackageIcon} title="Paket yok" description="İlk paketini oluştur." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className={`rounded-2xl border p-5 ${p.is_active ? 'border-gold/25 bg-gradient-to-b from-gold/5 to-transparent' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-black text-white text-lg">{p.name}</h3>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{p.duration_days} gün</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${p.is_active ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.06] border-white/20 text-white/60'}`}>
                  {p.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="mt-3 font-display font-black text-3xl text-gold">{p.price?.toLocaleString('tr-TR')} ₺</div>
              {p.description && <p className="text-sm text-white/60 mt-2">{p.description}</p>}
              {p.features?.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-xs text-white/70 flex gap-2"><span className="text-gold">•</span>{f}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                <Button variant="outline" onClick={() => openEdit(p)} className="flex-1 border-white/15 text-white hover:bg-white/5 h-9"><Edit3 className="w-3.5 h-3.5 mr-1" /> Düzenle</Button>
                <Button variant="outline" onClick={() => remove(p)} className="border-red-500/30 text-red-300 hover:bg-red-500/10 h-9"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Paketi Düzenle' : 'Yeni Paket'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Paket Adı</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Süre (Gün)</Label>
                <Input type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} className="input" />
              </div>
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Fiyat (₺)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
              </div>
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Açıklama</Label>
              <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={3} />
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Özellikler</Label>
              <div className="flex gap-2">
                <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Özellik ekle" className="input" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                <Button type="button" onClick={addFeature} variant="outline" className="border-white/15 text-white hover:bg-white/5">Ekle</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(form.features || []).map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-white/50 hover:text-red-300">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <span className="text-white/80 text-sm">Aktif</span>
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

export default PackagesPage;
