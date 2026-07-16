import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';
import api from '../../lib/api';
import { PanelCard, MiniBarChart, EmptyState } from '../../components/panel/parts';
import { secondsToHuman, trDate, trDateTime, WEEK_DAYS_TR } from '../../lib/format';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';

const startOfWeek = (d) => {
  const day = d.getDay();
  const diff = (day + 6) % 7; // Mon=0
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(d.getDate() - diff);
  return s;
};
const fmt = (d) => d.toISOString().split('T')[0];

const MentorStudentDetail = ({ sid }) => {
  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [openTaskFor, setOpenTaskFor] = useState(null);
  const [form, setForm] = useState({});
  const { toast } = useToast();

  const load = useCallback(async () => {
    const [s, t, ss, sub, tt] = await Promise.all([
      api.get(`/mentor/students/${sid}`),
      api.get(`/mentor/students/${sid}/tasks`, { params: { week_start: fmt(weekStart) } }),
      api.get(`/mentor/students/${sid}/sessions`, { params: { limit: 50 } }),
      api.get('/ref/subjects'),
      api.get('/ref/task-types'),
    ]);
    setStudent(s.data);
    setTasks(t.data);
    setSessions(ss.data);
    setSubjects(sub.data);
    setTaskTypes(tt.data);
  }, [sid, weekStart]);

  useEffect(() => { load(); }, [load]);

  const openTaskModal = (date) => {
    setOpenTaskFor(date);
    setForm({ subject: subjects[0] || 'Matematik', topic: '', description: '', task_type: 'test', target_qcount: '', target_duration_min: '' });
  };

  const submitTask = async (e) => {
    e.preventDefault();
    const payload = {
      student_id: sid, day_date: openTaskFor,
      subject: form.subject, topic: form.topic || null,
      description: form.description || null, task_type: form.task_type,
      target_qcount: form.target_qcount ? Number(form.target_qcount) : null,
      target_duration_min: form.target_duration_min ? Number(form.target_duration_min) : null,
    };
    try {
      await api.post('/mentor/tasks', payload);
      toast({ title: 'Görev eklendi ✓' });
      setOpenTaskFor(null);
      load();
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail });
    }
  };

  const removeTask = async (t) => {
    if (!window.confirm('Görev silinsin mi?')) return;
    await api.delete(`/mentor/tasks/${t.id}`);
    load();
  };

  if (!student) return <div className="text-white/50">Yükleniyor…</div>;
  const series = student.series_14d.map((r) => ({ ...r, label: r.date.slice(5) }));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(d.getDate() + i); return d;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/mentor/students" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm">
          <ArrowLeft className="w-4 h-4" /> Öğrencilerime dön
        </Link>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/25 text-gold font-bold text-xl flex items-center justify-center">
            {student.full_name?.[0]}
          </div>
          <div className="flex-1">
            <div className="font-display font-black text-2xl text-white">{student.full_name}</div>
            <div className="text-white/60 text-sm">
              {student.grade || '—'} • {student.exam_type || '—'} • {student.city || '—'}
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Info label="Hedef Okul" value={student.target_school} />
          <Info label="Hedef Bölüm" value={student.target_dept} />
          <Info label="Hedef Puan" value={student.target_score} />
          <Info label="Toplam Çalışma" value={secondsToHuman(student.total_study_seconds)} />
        </div>
      </div>

      {/* Chart & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Son 14 Gün Çalışma" className="lg:col-span-2">
          <MiniBarChart data={series} valueKey="seconds" formatter={secondsToHuman} />
        </PanelCard>
        <PanelCard title="Ders Dağılımı">
          {student.subject_breakdown.length === 0 && <div className="text-white/50 text-sm">Kayıt yok.</div>}
          <div className="space-y-2">
            {student.subject_breakdown.slice(0, 6).map((s) => {
              const max = student.subject_breakdown[0].seconds || 1;
              return (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{s.subject}</span>
                    <span className="text-gold font-semibold">{secondsToHuman(s.seconds)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${(s.seconds / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </PanelCard>
      </div>

      {/* Weekly plan editor */}
      <PanelCard title="Haftalık Plan" action={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }}
            className="border-white/15 text-white hover:bg-white/5 h-8 px-3 text-xs">‹ Önceki</Button>
          <div className="text-white/70 text-xs">{trDate(weekStart)} – {trDate(new Date(+weekStart + 6 * 86400000))}</div>
          <Button variant="outline" onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }}
            className="border-white/15 text-white hover:bg-white/5 h-8 px-3 text-xs">Sonraki ›</Button>
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
          {days.map((d, i) => {
            const ds = fmt(d);
            const dayTasks = tasks.filter((t) => t.day_date === ds);
            const isToday = ds === fmt(new Date());
            return (
              <div key={ds} className={`rounded-xl border p-3 ${isToday ? 'border-gold/40 bg-gold/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">{WEEK_DAYS_TR[i]}</div>
                    <div className={`font-display font-black ${isToday ? 'text-gold' : 'text-white'}`}>{d.getDate()}</div>
                  </div>
                  <button onClick={() => openTaskModal(ds)} className="w-7 h-7 rounded-md bg-gold/15 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-ink">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-1.5">
                  {dayTasks.length === 0 && <div className="text-[11px] text-white/40 italic">Görev yok</div>}
                  {dayTasks.map((t) => (
                    <div key={t.id} className={`group px-2 py-1.5 rounded-md text-xs border ${t.completed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-white/[0.04] border-white/10 text-white/85'}`}>
                      <div className="flex items-start gap-1.5">
                        {t.completed ? <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" /> : <Circle className="w-3 h-3 mt-0.5 shrink-0 text-white/40" />}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{t.subject}</div>
                          {t.topic && <div className="text-[10px] text-white/50 truncate">{t.topic}</div>}
                        </div>
                        <button onClick={() => removeTask(t)} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-300 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PanelCard>

      {/* Recent sessions */}
      <PanelCard title="Son Çalışma Oturumları">
        {sessions.length === 0 && <EmptyState icon={Clock} title="Kayıt yok" description="Öğrenci kronometre başlattığında burada görünecek." />}
        {sessions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left py-2">Ders</th>
                  <th className="text-left py-2 hidden sm:table-cell">Konu</th>
                  <th className="text-left py-2 hidden md:table-cell">Başlangıç</th>
                  <th className="text-left py-2 hidden md:table-cell">Bitiş</th>
                  <th className="text-left py-2">Süre</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="py-2 pr-3 text-gold">{s.subject}</td>
                    <td className="py-2 pr-3 hidden sm:table-cell text-white/70">{s.topic || '—'}</td>
                    <td className="py-2 pr-3 hidden md:table-cell text-white/60">{trDateTime(s.started_at)}</td>
                    <td className="py-2 pr-3 hidden md:table-cell text-white/60">{trDateTime(s.ended_at)}</td>
                    <td className="py-2 pr-3 font-semibold text-white">{secondsToHuman(s.duration_sec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>

      {/* Add task dialog */}
      <Dialog open={!!openTaskFor} onOpenChange={(v) => !v && setOpenTaskFor(null)}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-lg">
          <DialogHeader><DialogTitle>Yeni Görev — {openTaskFor && trDate(openTaskFor)}</DialogTitle></DialogHeader>
          <form onSubmit={submitTask} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Ders</Label>
                <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                  <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-10"><SelectValue placeholder="Ders" /></SelectTrigger>
                  <SelectContent className="bg-ink border-white/10 text-white">
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Görev Türü</Label>
                <Select value={form.task_type} onValueChange={(v) => setForm({ ...form, task_type: v })}>
                  <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-ink border-white/10 text-white">
                    {taskTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Konu</Label>
              <Input value={form.topic || ''} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="input" placeholder="Örn: Türev Uygulamaları" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Soru Sayısı</Label>
                <Input type="number" value={form.target_qcount || ''} onChange={(e) => setForm({ ...form, target_qcount: e.target.value })} className="input" />
              </div>
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Hedef Süre (dk)</Label>
                <Input type="number" value={form.target_duration_min || ''} onChange={(e) => setForm({ ...form, target_duration_min: e.target.value })} className="input" />
              </div>
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Açıklama</Label>
              <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenTaskFor(null)} className="border-white/15 text-white hover:bg-white/5">Vazgeç</Button>
              <Button type="submit" className="bg-gold hover:bg-gold-light text-ink font-semibold">Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2">
    <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">{label}</div>
    <div className="text-white text-sm mt-0.5 truncate">{value || '—'}</div>
  </div>
);

export default MentorStudentDetail;
