import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { PanelCard, EmptyState } from '../../components/panel/parts';
import { secondsToHuman, trDateTime } from '../../lib/format';
import { Clock } from 'lucide-react';

const SessionsPage = ({ onMount }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { onMount && onMount(); }, [onMount]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/sessions', { params: { limit: 300 } });
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <PanelCard title={`Toplam ${items.length} kayıt`}>
        {loading && <div className="text-white/50">Yükleniyor…</div>}
        {!loading && items.length === 0 && (
          <EmptyState icon={Clock} title="Henüz çalışma kaydı yok" description="Öğrenciler kronometreyi başlattıkça burada görüneceksin." />
        )}
        {!loading && items.length > 0 && (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left py-2">Öğrenci</th>
                  <th className="text-left py-2">Ders</th>
                  <th className="text-left py-2 hidden sm:table-cell">Konu</th>
                  <th className="text-left py-2 hidden md:table-cell">Başlangıç</th>
                  <th className="text-left py-2 hidden md:table-cell">Bitiş</th>
                  <th className="text-left py-2">Süre</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="py-2 pr-3"><span className="text-white font-semibold">{s.student_name}</span></td>
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
    </div>
  );
};

export default SessionsPage;
