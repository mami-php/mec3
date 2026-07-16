import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Plus, Search, MoreHorizontal, Trash2, Edit3, KeyRound, ShieldOff, UserCheck, UserMinus,
} from 'lucide-react';
import api from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { StatusBadge, EmptyState } from '../../components/panel/parts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { trDate, secondsToHuman } from '../../lib/format';
import { useToast } from '../../hooks/use-toast';

const emptyForm = {
  email: '', password: '', full_name: '', phone: '',
  birth_date: '', city: '', grade: '', exam_type: '', target_school: '', target_dept: '', target_score: '',
  mentor_id: '', package_id: '', specialty: '',
};

const UsersPage = ({ roleFilter, onMount }) => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [openAssign, setOpenAssign] = useState(null);
  const [openPkg, setOpenPkg] = useState(null);
  const [openPw, setOpenPw] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [mentors, setMentors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [refs, setRefs] = useState({ grades: [], exam_types: [] });
  const { toast } = useToast();

  useEffect(() => { onMount && onMount(); }, [onMount]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/admin/users', { params: { role: roleFilter, q: q || undefined } });
    setItems(data);
    setLoading(false);
  }, [roleFilter, q]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    (async () => {
      if (roleFilter === 'student') {
        const [m, p, g, e] = await Promise.all([
          api.get('/admin/users', { params: { role: 'mentor' } }),
          api.get('/admin/packages'),
          api.get('/ref/grades'),
          api.get('/ref/exam-types'),
        ]);
        setMentors(m.data);
        setPackages(p.data);
        setRefs({ grades: g.data, exam_types: e.data });
      }
    })();
  }, [roleFilter]);

  const openCreateModal = () => {
    setForm({ ...emptyForm });
    setOpenCreate(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) {
      toast({ title: 'Eksik bilgi', description: 'Ad, e-posta ve şifre zorunlu.' });
      return;
    }
    const payload = { ...form, role: roleFilter };
    // strip empties
    Object.keys(payload).forEach((k) => (payload[k] === '' || payload[k] == null) && delete payload[k]);
    try {
      await api.post('/admin/users', payload);
      toast({ title: 'Oluşturuldu ✓', description: `${roleFilter} eklendi.` });
      setOpenCreate(false);
      load();
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail || 'Bir sorun oluştu.' });
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const uid = openEdit.id;
    const payload = { ...form };
    delete payload.email;
    delete payload.password;
    Object.keys(payload).forEach((k) => (payload[k] === '' || payload[k] == null) && delete payload[k]);
    try {
      await api.patch(`/admin/users/${uid}`, payload);
      toast({ title: 'Güncellendi ✓' });
      setOpenEdit(null);
      load();
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail });
    }
  };

  const setStatus = async (u, s) => {
    await api.post(`/admin/users/${u.id}/status/${s}`);
    load();
  };

  const remove = async (u) => {
    if (!window.confirm(`${u.full_name} silinsin mi?`)) return;
    await api.delete(`/admin/users/${u.id}`);
    load();
  };

  const assignMentor = async (mid) => {
    await api.post(`/admin/users/${openAssign.id}/mentor`, { mentor_id: mid || null });
    toast({ title: 'Mentör atandı ✓' });
    setOpenAssign(null);
    load();
  };

  const assignPkg = async (pkgId, days) => {
    await api.post(`/admin/users/${openPkg.id}/package`, { package_id: pkgId, days });
    toast({ title: 'Paket atandı ✓' });
    setOpenPkg(null);
    load();
  };

  const extendPkg = async (days) => {
    await api.post(`/admin/users/${openPkg.id}/package/extend`, { days });
    toast({ title: `Paket ${days} gün uzatıldı ✓` });
    setOpenPkg(null);
    load();
  };

  const cancelPkg = async (u) => {
    if (!window.confirm('Paket iptal edilsin mi?')) return;
    await api.post(`/admin/users/${u.id}/package/cancel`);
    load();
  };

  const changePw = async (pw) => {
    if (!pw || pw.length < 6) return toast({ title: 'Şifre en az 6 karakter olmalı' });
    await api.post(`/admin/users/${openPw.id}/password`, { new_password: pw });
    toast({ title: 'Şifre değiştirildi ✓' });
    setOpenPw(null);
  };

  const RoleLabel = useMemo(() => ({ student: 'Öğrenci', mentor: 'Mentör', admin: 'Admin' })[roleFilter], [roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Ara: ad, e-posta, telefon"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Button onClick={openCreateModal} className="bg-gold hover:bg-gold-light text-ink font-semibold h-10">
          <Plus className="w-4 h-4 mr-1" /> Yeni {RoleLabel}
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-white/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Kullanıcı</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">E-posta / Telefon</th>
                {roleFilter === 'student' && <th className="text-left px-4 py-3 hidden lg:table-cell">Mentör / Paket</th>}
                {roleFilter === 'student' && <th className="text-left px-4 py-3 hidden xl:table-cell">Çalışma</th>}
                <th className="text-left px-4 py-3 hidden sm:table-cell">Kayıt</th>
                <th className="text-left px-4 py-3">Durum</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-white/50">Yükleniyor…</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10">
                  <EmptyState title="Kayıt yok" description={`Henüz ${RoleLabel} eklenmemiş.`} />
                </td></tr>
              )}
              {items.map((u) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/25 text-gold font-bold flex items-center justify-center">
                        {u.full_name?.[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{u.full_name}</div>
                        <div className="text-[11px] text-white/40 md:hidden">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-white/80">{u.email}</div>
                    <div className="text-white/40 text-xs">{u.phone || '—'}</div>
                  </td>
                  {roleFilter === 'student' && (
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-white/80">{u.mentor_name || '—'}</div>
                      <div className="text-white/40 text-xs">{u.package_name || 'Paket yok'}</div>
                    </td>
                  )}
                  {roleFilter === 'student' && (
                    <td className="px-4 py-3 hidden xl:table-cell text-white/80">
                      {u.package_end ? trDate(u.package_end) : '—'}
                    </td>
                  )}
                  <td className="px-4 py-3 hidden sm:table-cell text-white/60">{trDate(u.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/70">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-ink border-white/10 text-white">
                        <DropdownMenuItem onClick={() => { setForm({ ...emptyForm, ...u }); setOpenEdit(u); }}><Edit3 className="w-3.5 h-3.5 mr-2" /> Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenPw(u)}><KeyRound className="w-3.5 h-3.5 mr-2" /> Şifre Değiştir</DropdownMenuItem>
                        {roleFilter === 'student' && (<>
                          <DropdownMenuItem onClick={() => setOpenAssign(u)}><UserCheck className="w-3.5 h-3.5 mr-2" /> Mentör Ata</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setOpenPkg(u)}><UserMinus className="w-3.5 h-3.5 mr-2" /> Paket Yönet</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => cancelPkg(u)} className="text-red-300">Paketi İptal Et</DropdownMenuItem>
                        </>)}
                        <DropdownMenuSeparator />
                        {u.status !== 'blocked' && <DropdownMenuItem onClick={() => setStatus(u, 'blocked')}><ShieldOff className="w-3.5 h-3.5 mr-2" /> Engelle</DropdownMenuItem>}
                        {u.status === 'blocked' && <DropdownMenuItem onClick={() => setStatus(u, 'active')}>Engeli Kaldır</DropdownMenuItem>}
                        {u.status === 'active' && <DropdownMenuItem onClick={() => setStatus(u, 'inactive')}>Pasifleştir</DropdownMenuItem>}
                        {u.status === 'inactive' && <DropdownMenuItem onClick={() => setStatus(u, 'active')}>Aktifleştir</DropdownMenuItem>}
                        <DropdownMenuItem onClick={() => remove(u)} className="text-red-300"><Trash2 className="w-3.5 h-3.5 mr-2" /> Sil</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit dialog */}
      <UserFormDialog
        open={openCreate || !!openEdit}
        editing={openEdit}
        onClose={() => { setOpenCreate(false); setOpenEdit(null); }}
        form={form} setForm={setForm}
        onSubmit={openEdit ? submitEdit : submitCreate}
        role={roleFilter}
        mentors={mentors} packages={packages} refs={refs}
      />

      {/* Assign mentor */}
      <Dialog open={!!openAssign} onOpenChange={() => setOpenAssign(null)}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-md">
          <DialogHeader><DialogTitle>Mentör Ata</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]" onClick={() => assignMentor(null)}>
              <span className="text-white/70">Mentör kaldır</span>
            </button>
            {mentors.map((m) => (
              <button key={m.id} onClick={() => assignMentor(m.id)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]">
                <div className="font-semibold">{m.full_name}</div>
                <div className="text-xs text-white/50">{m.specialty || m.email}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Package manage */}
      <PackageManageDialog
        open={!!openPkg}
        onClose={() => setOpenPkg(null)}
        user={openPkg}
        packages={packages}
        onAssign={assignPkg}
        onExtend={extendPkg}
      />

      {/* Password */}
      <PasswordDialog open={!!openPw} onClose={() => setOpenPw(null)} onSubmit={changePw} user={openPw} />
    </div>
  );
};

const UserFormDialog = ({ open, editing, onClose, form, setForm, onSubmit, role, mentors, packages, refs }) => {
  const s = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Ad Soyad"><Input value={form.full_name || ''} onChange={(e) => s('full_name')(e.target.value)} className="input" /></Field>
            <Field label="Telefon"><Input value={form.phone || ''} onChange={(e) => s('phone')(e.target.value)} className="input" /></Field>
            {!editing && <>
              <Field label="E-posta"><Input type="email" value={form.email || ''} onChange={(e) => s('email')(e.target.value)} className="input" /></Field>
              <Field label="Şifre"><Input type="password" value={form.password || ''} onChange={(e) => s('password')(e.target.value)} className="input" /></Field>
            </>}
          </div>

          {role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Doğum Tarihi"><Input type="date" value={form.birth_date || ''} onChange={(e) => s('birth_date')(e.target.value)} className="input" /></Field>
              <Field label="Şehir"><Input value={form.city || ''} onChange={(e) => s('city')(e.target.value)} className="input" /></Field>
              <Field label="Sınıf">
                <SelectBox value={form.grade} onChange={s('grade')} options={refs.grades} placeholder="Sınıf seç" />
              </Field>
              <Field label="Sınav Türü">
                <SelectBox value={form.exam_type} onChange={s('exam_type')} options={refs.exam_types} placeholder="Sınav" />
              </Field>
              <Field label="Hedef Okul"><Input value={form.target_school || ''} onChange={(e) => s('target_school')(e.target.value)} className="input" /></Field>
              <Field label="Hedef Bölüm"><Input value={form.target_dept || ''} onChange={(e) => s('target_dept')(e.target.value)} className="input" /></Field>
              <Field label="Hedef Puan"><Input value={form.target_score || ''} onChange={(e) => s('target_score')(e.target.value)} className="input" /></Field>
              {!editing && (<>
                <Field label="Mentör">
                  <SelectBox value={form.mentor_id} onChange={s('mentor_id')} options={mentors.map((m) => ({ value: m.id, label: m.full_name }))} placeholder="Mentör seç" />
                </Field>
                <Field label="Paket">
                  <SelectBox value={form.package_id} onChange={s('package_id')} options={packages.map((p) => ({ value: p.id, label: `${p.name} • ${p.duration_days}g` }))} placeholder="Paket seç" />
                </Field>
              </>)}
            </div>
          )}

          {role === 'mentor' && (
            <Field label="Uzmanlık Alanı"><Input value={form.specialty || ''} onChange={(e) => s('specialty')(e.target.value)} className="input" /></Field>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-white/15 text-white hover:bg-white/5">Vazgeç</Button>
            <Button type="submit" className="bg-gold hover:bg-gold-light text-ink font-semibold">{editing ? 'Güncelle' : 'Oluştur'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }) => (
  <div>
    <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">{label}</Label>
    {children}
  </div>
);

const SelectBox = ({ value, onChange, options, placeholder }) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-10">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-ink border-white/10 text-white">
      {options.map((o) => (
        <SelectItem key={o.value || o} value={o.value || o}>{o.label || o}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const PackageManageDialog = ({ open, onClose, user, packages, onAssign, onExtend }) => {
  const [pid, setPid] = useState('');
  const [days, setDays] = useState('');
  const [extend, setExtend] = useState('30');
  useEffect(() => { if (user) { setPid(user.package_id || ''); setDays(''); setExtend('30'); } }, [user]);
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-md">
        <DialogHeader><DialogTitle>Paket Yönet — {user.full_name}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
            <div>Mevcut Paket: <b>{user.package_name || 'Yok'}</b></div>
            <div>Bitiş: <b>{user.package_end ? trDate(user.package_end) : '—'}</b></div>
          </div>
          <div className="space-y-2">
            <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold">Yeni paket ata</Label>
            <SelectBox value={pid} onChange={setPid} options={packages.map((p) => ({ value: p.id, label: `${p.name} • ${p.duration_days}g` }))} placeholder="Paket seç" />
            <div className="flex gap-2">
              <Input placeholder="Süre (gün) - isteğe bağlı" value={days} onChange={(e) => setDays(e.target.value)} className="input" />
              <Button onClick={() => onAssign(pid, days ? Number(days) : null)} disabled={!pid}
                className="bg-gold hover:bg-gold-light text-ink font-semibold">Ata</Button>
            </div>
          </div>
          <div className="h-px bg-white/10" />
          <div className="space-y-2">
            <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold">Mevcut paketi uzat</Label>
            <div className="flex gap-2">
              <Input value={extend} onChange={(e) => setExtend(e.target.value)} className="input" placeholder="Gün" />
              <Button variant="outline" onClick={() => onExtend(Number(extend))} className="border-white/15 text-white hover:bg-white/5">Uzat</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PasswordDialog = ({ open, onClose, onSubmit, user }) => {
  const [pw, setPw] = useState('');
  useEffect(() => { setPw(''); }, [user]);
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-sm">
        <DialogHeader><DialogTitle>Şifre Değiştir — {user?.full_name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input type="password" placeholder="Yeni şifre (min 6)" value={pw} onChange={(e) => setPw(e.target.value)} className="input" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="border-white/15 text-white hover:bg-white/5">Vazgeç</Button>
            <Button onClick={() => onSubmit(pw)} className="bg-gold hover:bg-gold-light text-ink font-semibold">Kaydet</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsersPage;
