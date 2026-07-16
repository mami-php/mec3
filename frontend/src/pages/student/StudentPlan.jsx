import React, { useEffect, useState, useCallback } from 'react';
import api from '../../lib/api';
import { PanelCard } from '../../components/panel/parts';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { WEEK_DAYS_TR, trDate, secondsToHuman } from '../../lib/format';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

const startOfWeek = (d) => {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(d.getDate() - diff);
  return s;
};
const fmt = (d) => d.toISOString().split('T')[0];

const StudentPlan = ({ onMount }) => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [days, setDays] = useState([]);
  const { toast } = useToast();

  useEffect(() => { onMount && onMount(); }, [onMount]);

  const load = useCallback(async () => {
    const { data } = await api.get('/student/plan', { params: { week: fmt(weekStart) } });
    setDays(data.days);
  }, [weekStart]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (t) => {
    await api.post(`/student/tasks/${t.id}/toggle`);
    toast({ title: t.completed ? 'Görev geri alındı' : 'Tebrikler! Tamamlandı ✓' });
    load();
  };

  const todayStr = fmt(new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gold" />
          <div className="text-white/80 font-semibold">{trDate(weekStart)} – {trDate(new Date(+weekStart + 6 * 86400000))}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }}
            className="border-white/15 text-white hover:bg-white/5 h-9 px-3"><ArrowLeft className="w-4 h-4" /></Button>
          <Button variant="outline" onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="border-white/15 text-white hover:bg-white/5 h-9 px-3 text-xs">Bu Hafta</Button>
          <Button variant="outline" onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }}
            className="border-white/15 text-white hover:bg-white/5 h-9 px-3"><ArrowRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
        {days.map((d, i) => {
          const isToday = d.date === todayStr;
          const done = d.tasks.filter((t) => t.completed).length;
          const total = d.tasks.length;
          const dObj = new Date(d.date);
          return (
            <div key={d.date} className={`rounded-2xl border p-4 ${isToday ? 'border-gold/50 bg-gold/[0.04] shadow-[0_20px_60px_-30px_rgba(201,169,97,0.4)]' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">{WEEK_DAYS_TR[i]}</div>
                  <div className={`font-display font-black text-2xl ${isToday ? 'text-gold' : 'text-white'}`}>{dObj.getDate()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Çalışma</div>
                  <div className="text-white font-bold text-sm">{secondsToHuman(d.study_seconds)}</div>
                </div>
              </div>

              {total > 0 && (
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${(done / total) * 100}%` }} />
                </div>
              )}

              <div className="mt-3 space-y-1.5 min-h-[100px]">
                {d.tasks.length === 0 && <div className="text-[11px] text-white/40 italic">Görev yok</div>}
                {d.tasks.map((t) => (
                  <button key={t.id} onClick={() => toggle(t)}
                    className={`w-full text-left px-2.5 py-2 rounded-md border text-xs transition-colors ${
                      t.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                        : 'bg-white/[0.03] border-white/10 text-white/85 hover:bg-white/[0.06] hover:border-gold/30'
                    }`}>
                    <div className="flex items-start gap-2">
                      {t.completed ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/40" />}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{t.subject}</div>
                        {t.topic && <div className="text-[10px] text-white/50 truncate">{t.topic}</div>}
                        {t.target_qcount && <div className="text-[10px] text-gold/80 mt-0.5">{t.target_qcount} soru</div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentPlan;
