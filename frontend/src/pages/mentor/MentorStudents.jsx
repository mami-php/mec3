import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';
import api from '../../lib/api';
import { EmptyState } from '../../components/panel/parts';
import { secondsToHuman } from '../../lib/format';

const MentorStudents = ({ onMount }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { onMount && onMount(); }, [onMount]);
  useEffect(() => { (async () => {
    const { data } = await api.get('/mentor/students');
    setStudents(data);
    setLoading(false);
  })(); }, []);

  if (loading) return <div className="text-white/50">Yükleniyor…</div>;

  return (
    <div className="space-y-4">
      {students.length === 0 && (
        <EmptyState icon={Users} title="Sana atanan öğrenci yok" description="Admin sana öğrenci atadıkça burada görüneceksin." />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((s) => (
          <Link key={s.id} to={`/mentor/students/${s.id}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-gold/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/25 text-gold font-bold flex items-center justify-center">
                {s.full_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-white truncate">{s.full_name}</div>
                <div className="text-xs text-white/50">{s.grade || '—'} • {s.exam_type || '—'}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-gold" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/[0.03] border border-white/10 py-2">
                <div className="text-white font-display font-black text-sm">{secondsToHuman(s.total_study_seconds)}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Çalışma</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/10 py-2">
                <div className="text-white font-display font-black text-sm">{s.completed_tasks}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Tamam</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/10 py-2">
                <div className="text-gold font-display font-black text-sm">{s.pending_tasks}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Bekleyen</div>
              </div>
            </div>
            {s.target_dept && (
              <div className="mt-3 text-xs text-white/60">
                <span className="text-white/40">Hedef:</span> {s.target_dept}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MentorStudents;
