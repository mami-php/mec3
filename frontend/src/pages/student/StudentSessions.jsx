import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { PanelCard, EmptyState } from '../../components/panel/parts';
import { secondsToHuman, trDateTime } from '../../lib/format';
import { Clock } from 'lucide-react';

const StudentSessions = ({ onMount }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { onMount && onMount(); }, [onMount]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/student/sessions', { params: { limit: 200 } });
      setItems(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-white/50">Yükleniyor…</div>;

  const totalSec = items.reduce((s, r) => s + (r.duration_sec || 0), 0);

  return (
    <div className="space-y-4">
      <PanelCard title={`Toplam ${items.length} oturum • ${secondsToHuman(totalSec)}`}>
        {items.length === 0 && <EmptyState icon={Clock} title="Henüz kayıt yok" description="Kronometreyi başlatıp ders çalışmaya başla." />}
        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left py-2">Ders</th>
                  <th className="text-left py-2 hidden sm:table-cell">Konu</th>
                  <th className="text-left py-2 hidden md:table-cell">Başlangıç</th>
                  <th className="text-left py-2 hidden md:table-cell">Bitiş</th>
                  <th className="text-right py-2">Süre</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="py-2 pr-3 text-gold font-semibold">{s.subject}</td>
                    <td className="py-2 pr-3 hidden sm:table-cell text-white/70">{s.topic || '—'}</td>
                    <td className="py-2 pr-3 hidden md:table-cell text-white/60">{trDateTime(s.started_at)}</td>
                    <td className="py-2 pr-3 hidden md:table-cell text-white/60">{trDateTime(s.ended_at)}</td>
                    <td className="py-2 pl-3 text-right text-white font-semibold">{secondsToHuman(s.duration_sec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>
    </div>
  );
};

export default StudentSessions;
