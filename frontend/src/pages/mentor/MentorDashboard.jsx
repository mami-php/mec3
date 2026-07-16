import React, { useEffect, useState } from 'react';
import { Users, Clock, TrendingUp, CheckCircle2, ListChecks, UserCheck2 } from 'lucide-react';
import api from '../../lib/api';
import { StatCard, PanelCard, MiniBarChart } from '../../components/panel/parts';
import { secondsToHuman } from '../../lib/format';

const MentorDashboard = ({ onMount }) => {
  const [stats, setStats] = useState(null);
  useEffect(() => { onMount && onMount(); }, [onMount]);
  useEffect(() => { (async () => {
    const { data } = await api.get('/mentor/dashboard/stats');
    setStats(data);
  })(); }, []);

  if (!stats) return <div className="text-white/50">Yükleniyor…</div>;
  const series = stats.series_7d.map((r) => ({ ...r, label: r.date.slice(5) }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Öğrencim" value={stats.total_students} tone="gold" />
        <StatCard icon={UserCheck2} label="Bugün Aktif" value={stats.today_active} />
        <StatCard icon={Clock} label="Bugün Çalışma" value={secondsToHuman(stats.today_study_seconds)} />
        <StatCard icon={TrendingUp} label="Toplam Çalışma" value={secondsToHuman(stats.total_study_seconds)} />
        <StatCard icon={ListChecks} label="Bekleyen Görev" value={stats.pending_tasks} />
        <StatCard icon={CheckCircle2} label="Tamamlanan" value={stats.completed_tasks} />
      </div>

      <PanelCard title="Son 7 Gün Öğrenci Çalışmaları">
        <MiniBarChart data={series} valueKey="seconds" formatter={secondsToHuman} />
      </PanelCard>
    </div>
  );
};

export default MentorDashboard;
