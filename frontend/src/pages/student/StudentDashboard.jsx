import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Flame, Award, CheckCircle2, ListChecks, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { StatCard, PanelCard, MiniBarChart } from '../../components/panel/parts';
import { secondsToHuman } from '../../lib/format';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/button';

const StudentDashboard = ({ onMount }) => {
  const [stats, setStats] = useState(null);
  const [today, setToday] = useState(null);
  const { user } = useAuth();
  useEffect(() => { onMount && onMount(); }, [onMount]);

  useEffect(() => {
    (async () => {
      const [s, p] = await Promise.all([
        api.get('/student/stats'),
        api.get('/student/plan'),
      ]);
      setStats(s.data);
      // find today
      const todayStr = new Date().toISOString().split('T')[0];
      const todayDay = p.data.days.find((d) => d.date === todayStr);
      setToday(todayDay);
    })();
  }, []);

  if (!stats) return <div className="text-white/50">Yükleniyor…</div>;
  const series = stats.series_14d.map((r) => ({ ...r, label: r.date.slice(5) }));

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden border border-gold/25 bg-gradient-to-br from-ink-2 to-ink p-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-gold text-xs uppercase tracking-widest font-semibold">Bugün</div>
            <div className="mt-1 font-display font-black text-3xl text-white">
              Hedefe {user?.package_info?.end ? Math.ceil((new Date(user.package_info.end) - new Date()) / 86400000) : '—'} gün kaldı
            </div>
            <div className="text-white/60 text-sm mt-1">
              {user?.target_school && `${user.target_school}`}{user?.target_dept && ` • ${user.target_dept}`}
            </div>
          </div>
          <Link to="/student/kronometre">
            <Button size="lg" className="h-12 px-6 bg-gold hover:bg-gold-light text-ink font-semibold">
              <Clock className="w-4 h-4 mr-2" /> Kronometreyi Başlat
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Clock} label="Bugün" value={secondsToHuman(stats.today_seconds)} tone="gold" />
        <StatCard icon={Calendar} label="Bu Hafta" value={secondsToHuman(stats.week_seconds)} />
        <StatCard icon={Calendar} label="Bu Ay" value={secondsToHuman(stats.month_seconds)} />
        <StatCard icon={Award} label="Toplam" value={secondsToHuman(stats.total_seconds)} />
        <StatCard icon={Flame} label="Seri" value={`${stats.streak_days} gün`} sub="Kesintisiz" />
        <StatCard icon={ListChecks} label="Bekleyen Görev" value={stats.pending_tasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Son 14 Gün" className="lg:col-span-2">
          <MiniBarChart data={series} valueKey="seconds" formatter={secondsToHuman} />
          <div className="mt-3 text-xs text-white/50">
            En çok çalıştığın ders: <span className="text-gold font-semibold">{stats.top_subject || '—'}</span>
          </div>
        </PanelCard>

        <PanelCard title="Bugünkü Görevler" action={<Link to="/student/plan" className="text-xs text-gold flex items-center gap-1">Tüm plan <ChevronRight className="w-3 h-3" /></Link>}>
          {(!today || today.tasks.length === 0) && (
            <div className="text-sm text-white/50">Bugün için atanmış görev yok. İyi çalışmalar!</div>
          )}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {today?.tasks?.map((t) => (
              <div key={t.id} className={`px-3 py-2 rounded-lg border ${t.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.04] border-white/10'}`}>
                <div className="flex items-center gap-2">
                  {t.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-white/30" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{t.subject}</div>
                    {t.topic && <div className="text-xs text-white/60 truncate">{t.topic}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </div>
  );
};

export default StudentDashboard;
