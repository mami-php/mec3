import React, { useEffect, useState, useRef } from 'react';
import api from '../../lib/api';
import { Play, Square, BookOpen, Timer } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PanelCard } from '../../components/panel/parts';
import { secondsToHMS, secondsToHuman, trDateTime } from '../../lib/format';
import { useToast } from '../../hooks/use-toast';

const StudentTimer = ({ onMount }) => {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [active, setActive] = useState(null); // active session
  const [elapsed, setElapsed] = useState(0);
  const [recent, setRecent] = useState([]);
  const intervalRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => { onMount && onMount(); }, [onMount]);

  const loadState = async () => {
    const [subs, a, list] = await Promise.all([
      api.get('/ref/subjects'),
      api.get('/student/sessions/active'),
      api.get('/student/sessions', { params: { limit: 10 } }),
    ]);
    setSubjects(subs.data);
    if (!subject) setSubject(subs.data[0]);
    setActive(a.data);
    setRecent(list.data);
    if (a.data) {
      const s = Math.floor((new Date() - new Date(a.data.started_at)) / 1000);
      setElapsed(s);
    }
  };

  useEffect(() => { loadState(); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((new Date() - new Date(active.started_at)) / 1000));
      }, 1000);
      return () => clearInterval(intervalRef.current);
    } else {
      setElapsed(0);
    }
  }, [active]);

  const start = async () => {
    if (!subject) {
      toast({ title: 'Ders seçiniz' });
      return;
    }
    try {
      const { data } = await api.post('/student/sessions/start', { subject, topic: topic || null });
      setActive(data);
      toast({ title: `${subject} çalışması başladı`, description: 'Başarılar!' });
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail });
    }
  };

  const stop = async () => {
    if (!active) return;
    try {
      const { data } = await api.post('/student/sessions/stop', { session_id: active.id });
      toast({
        title: 'Oturum kaydedildi ✓',
        description: `${data.subject} • ${secondsToHuman(data.duration_sec)} çalıştın.`,
      });
      setActive(null);
      setTopic('');
      loadState();
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail });
    }
  };

  return (
    <div className="space-y-6">
      {/* Big timer */}
      <div className={`relative rounded-3xl overflow-hidden border p-8 sm:p-12 text-center transition-colors ${
        active ? 'border-gold/50 bg-gradient-to-br from-ink-2 to-ink shadow-[0_40px_100px_-40px_rgba(201,169,97,0.5)]' : 'border-white/10 bg-white/[0.02]'
      }`}>
        {active && <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/15 rounded-full blur-3xl animate-pulse" />}

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[11px] uppercase tracking-wider font-semibold">
            <Timer className="w-3.5 h-3.5" /> {active ? 'Oturum devam ediyor' : 'Kronometre hazır'}
          </div>

          {active && (
            <div className="mt-4 text-gold text-sm font-semibold">
              <BookOpen className="w-4 h-4 inline mr-1.5" />
              {active.subject}{active.topic && ` • ${active.topic}`}
            </div>
          )}

          <div className="mt-6 font-display font-black text-white tabular-nums text-6xl sm:text-8xl tracking-tight">
            {secondsToHMS(elapsed)}
          </div>

          {!active && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">Ders</div>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-11"><SelectValue placeholder="Ders seç" /></SelectTrigger>
                  <SelectContent className="bg-ink border-white/10 text-white max-h-[300px]">
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">Konu (isteğe bağlı)</div>
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Örn: Türev" className="h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
              </div>
            </div>
          )}

          <div className="mt-8">
            {active ? (
              <Button onClick={stop} size="lg" className="h-14 px-10 bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-[0_20px_50px_-15px_rgba(239,68,68,0.6)]">
                <Square className="w-5 h-5 mr-2" /> Dersi Bitir
              </Button>
            ) : (
              <Button onClick={start} size="lg" className="h-14 px-10 bg-gold hover:bg-gold-light text-ink font-bold text-lg shadow-[0_20px_50px_-15px_rgba(201,169,97,0.7)]">
                <Play className="w-5 h-5 mr-2" /> Dersi Başlat
              </Button>
            )}
          </div>
        </div>
      </div>

      <PanelCard title="Son Çalışma Oturumlarım">
        {recent.length === 0 && (
          <div className="text-sm text-white/50">Henüz kaydın yok. Yukarıdan bir ders başlat.</div>
        )}
        <div className="space-y-2">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/25 text-gold flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{r.subject}{r.topic && <span className="text-white/50 font-normal"> • {r.topic}</span>}</div>
                <div className="text-[11px] text-white/40">{trDateTime(r.started_at)}</div>
              </div>
              <div className="text-gold font-display font-black">{secondsToHuman(r.duration_sec)}</div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
};

export default StudentTimer;
