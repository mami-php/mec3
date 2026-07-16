import React, { useEffect, useState, useCallback } from 'react';
import api from '../../lib/api';
import { PanelCard } from '../../components/panel/parts';
import { CheckCircle2, Circle, Plus, Trash2, User, Sparkles, CalendarDays } from 'lucide-react';
import { WEEK_DAYS_TR, trDate, secondsToHuman } from '../../lib/format';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';

const trMonth = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const trDay = (d) => `${d.getDate()} ${trMonth[d.getMonth()]}`;

const StudentPlan = ({ onMount }) => {
  const [weekStart, setWeekStart] = useState(null);
  const [days, setDays] = useState([]);
  const [today, setToday] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [openFor, setOpenFor] = useState(null);
  const [form, setForm] = useState({ subject: '', topic: '', target_qcount: '', task_type: 'ödev' });
  const { toast } = useToast();

  useEffect(() => { onMount && onMount(); }, [onMount]);

  const load = useCallback(async () => {
    const [plan, subs, tt] = await Promise.all([
      api.get('/student/plan'),
      api.get('/ref/subjects'),
      api.get('/ref/task-types'),
    ]);
    setWeekStart(plan.data.week_start);
    setDays(plan.data.days);
    setToday(plan.data.today);
    setSubjects(subs.data);
    setTaskTypes(tt.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (t) => {
    await api.post(`/student/tasks/${t.id}/toggle`);
    load();
  };

  const openAdd = (date) => {
    setOpenFor(date);
    setForm({ subject: subjects[0] || 'Matematik', topic: '', target_qcount: '', task_type: 'ödev' });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/tasks', {
        day_date: openFor,
        subject: form.subject,
        topic: form.topic || null,
        task_type: form.task_type,
        target_qcount: form.target_qcount ? Number(form.target_qcount) : null,
      });
      toast({ title: 'Ödev eklendi ✓' });
      setOpenFor(null);
      load();
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail });
    }
  };

  const removeTask = async (t) => {
    if (!window.confirm('Ödev silinsin mi?')) return;
    try {
      await api.delete(`/student/tasks/${t.id}`);
      load();
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail });
    }
  };

  if (!weekStart) return <div className="text-white/50">Yükleniyor…</div>;

  const wsDate = new Date(weekStart);
  const weekEndDate = new Date(+wsDate + 6 * 86400000);

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-black text-xl text-white">Bu Haftaki Planım</div>
            <div className="text-xs text-white/50 mt-0.5">
              {trDay(wsDate)} – {trDay(weekEndDate)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gold" />
            <span className="text-white/60">Mentörden gelen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-400" />
            <span className="text-white/60">Kişisel görevim</span>
          </div>
        </div>
      </div>

      {/* 7 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {days.map((d, i) => {
          const isToday = d.date === today;
          const dObj = new Date(d.date);
          const done = d.tasks.filter((t) => t.completed).length;
          const total = d.tasks.length;

          return (
            <div
              key={d.date}
              className={`rounded-2xl border p-4 min-h-[420px] flex flex-col transition-all ${
                isToday
                  ? 'border-gold/50 bg-gradient-to-b from-gold/[0.06] to-transparent shadow-[0_20px_60px_-30px_rgba(201,169,97,0.45)]'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className={`font-display font-bold text-lg ${isToday ? 'text-gold' : 'text-white'}`}>
                    {WEEK_DAYS_TR[i]}
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">{trDay(dObj)}</div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  d.study_seconds > 0
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.05] border-white/15 text-white/50'
                }`}>
                  {Math.round((d.study_seconds || 0) / 60)} dk
                </span>
              </div>

              {/* Progress */}
              {total > 0 && (
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${done === total ? 'bg-emerald-400' : 'bg-gold'}`}
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                </div>
              )}

              {/* Add task */}
              <button
                onClick={() => openAdd(d.date)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gold/40 text-gold hover:bg-gold/10 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Yeni Ödev Ekle
              </button>

              {/* Tasks */}
              <div className="mt-3 space-y-2 flex-1">
                {d.tasks.length === 0 && (
                  <div className="text-[11px] text-white/30 italic text-center pt-6">
                    Görev yok
                  </div>
                )}
                {d.tasks.map((t) => {
                  const isMine = t.created_by === 'student';
                  return (
                    <div
                      key={t.id}
                      className={`group px-2.5 py-2 rounded-lg border text-xs transition-all ${
                        t.completed
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : isMine
                            ? 'bg-sky-400/10 border-sky-400/40 hover:border-sky-400/60'
                            : 'bg-gold/10 border-gold/40 hover:border-gold/60'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button onClick={() => toggle(t)} className="mt-0.5 shrink-0" aria-label="tik">
                          {t.completed
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            : <Circle className={`w-4 h-4 ${isMine ? 'text-sky-300' : 'text-gold'}`} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className={`font-semibold text-white truncate ${t.completed ? 'line-through opacity-70' : ''}`}>
                              {t.subject}
                            </div>
                            {isMine
                              ? <User className="w-3 h-3 text-sky-300 shrink-0" />
                              : <Sparkles className="w-3 h-3 text-gold shrink-0" />}
                          </div>
                          {t.topic && (
                            <div className="text-[10px] text-white/60 truncate mt-0.5">{t.topic}</div>
                          )}
                          {t.target_qcount && (
                            <div className="text-[10px] text-white/50 mt-0.5">{t.target_qcount} soru</div>
                          )}
                        </div>
                        {isMine && !t.completed && (
                          <button
                            onClick={() => removeTask(t)}
                            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-300 transition-opacity"
                            aria-label="Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add task dialog */}
      <Dialog open={!!openFor} onOpenChange={(v) => !v && setOpenFor(null)}>
        <DialogContent className="bg-ink border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kişisel Ödev Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Ders</Label>
              <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-ink border-white/10 text-white max-h-[280px]">
                  {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Konu</Label>
              <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="input" placeholder="Örn: Türev" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Görev Türü</Label>
                <Select value={form.task_type} onValueChange={(v) => setForm({ ...form, task_type: v })}>
                  <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-ink border-white/10 text-white">
                    {taskTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-1.5 block">Soru Sayısı</Label>
                <Input type="number" value={form.target_qcount} onChange={(e) => setForm({ ...form, target_qcount: e.target.value })} className="input" placeholder="Opsiyonel" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenFor(null)} className="border-white/15 text-white hover:bg-white/5">Vazgeç</Button>
              <Button type="submit" className="bg-gold hover:bg-gold-light text-ink font-semibold">Ödev Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPlan;
