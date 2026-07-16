import React, { useEffect, useState } from 'react';
import {
  Users, GraduationCap, Package, UserPlus, Clock, TrendingUp, Activity, AlertTriangle,
} from 'lucide-react';
import api from '../../lib/api';
import { StatCard, PanelCard, MiniBarChart } from '../../components/panel/parts';
import { secondsToHuman, trDateTime } from '../../lib/format';

const Dashboard = ({ onMount }) => {
  const [stats, setStats] = useState(null);
  useEffect(() => { onMount && onMount(); }, [onMount]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/dashboard/stats');
      setStats(data);
    })();
  }, []);

  if (!stats) return <div className="text-white/50">Yükleniyor…</div>;

  const series = stats.series_7d.map((r) => ({ ...r, label: r.date.slice(5) }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Toplam Öğrenci" value={stats.total_students} tone="gold" />
        <StatCard icon={Users} label="Toplam Mentör" value={stats.total_mentors} />
        <StatCard icon={Package} label="Aktif Paket" value={stats.active_packages} />
        <StatCard icon={UserPlus} label="Bugün Kayıt" value={stats.today_signups} />
        <StatCard icon={Clock} label="Bugün Çalışma" value={secondsToHuman(stats.today_study_seconds)} />
        <StatCard icon={TrendingUp} label="Toplam Çalışma" value={secondsToHuman(stats.total_study_seconds)} />
        <StatCard icon={Activity} label="Aktif Kullanıcı (7g)" value={stats.active_users_7d} />
        <StatCard icon={AlertTriangle} label="Yaklaşan Bitenler" value={stats.upcoming_expirations_7d} sub="7 gün içinde" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Son 7 Gün Çalışma" className="lg:col-span-2">
          <MiniBarChart data={series} valueKey="seconds" formatter={secondsToHuman} />
          <div className="mt-3 flex items-center justify-between text-xs text-white/50">
            <span>Toplam: {secondsToHuman(series.reduce((s, r) => s + r.seconds, 0))}</span>
            <span>Ortalama: {secondsToHuman(Math.round(series.reduce((s, r) => s + r.seconds, 0) / 7))}/gün</span>
          </div>
        </PanelCard>

        <PanelCard title="Son Aktiviteler">
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {stats.recent_sessions.length === 0 && (
              <div className="text-sm text-white/50">Henüz kayıt yok.</div>
            )}
            {stats.recent_sessions.map((s) => (
              <div key={s.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/25 flex items-center justify-center text-gold">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">
                    <span className="font-semibold">{s.student_name}</span>
                    <span className="text-white/60"> • {s.subject}</span>
                  </div>
                  <div className="text-[11px] text-white/40">
                    {trDateTime(s.started_at)} • {secondsToHuman(s.duration_sec)}
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

export default Dashboard;
