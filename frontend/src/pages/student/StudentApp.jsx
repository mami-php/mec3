import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Clock, ClipboardList } from 'lucide-react';
import Shell from '../../components/panel/Shell';
import { useAuth } from '../../lib/auth';
import StudentDashboard from './StudentDashboard';
import StudentPlan from './StudentPlan';
import StudentTimer from './StudentTimer';
import StudentSessions from './StudentSessions';
import PackageBlocker from './PackageBlocker';

const nav = [
  { to: '/student', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/plan', label: 'Haftalık Plan', icon: CalendarDays },
  { to: '/student/kronometre', label: 'Kronometre', icon: Clock },
  { to: '/student/sessions', label: 'Çalışma Kayıtlarım', icon: ClipboardList },
];

const titleFor = (path) => {
  if (path === '/student') return 'Öğrenci Paneli';
  if (path.endsWith('/plan')) return 'Haftalık Plan';
  if (path.endsWith('/kronometre')) return 'Kronometre';
  if (path.endsWith('/sessions')) return 'Çalışma Kayıtlarım';
  return 'Öğrenci Paneli';
};

const StudentApp = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('Öğrenci Paneli');
  useEffect(() => { setTitle(titleFor(window.location.pathname)); }, []);

  const packageStatus = user?.package_info?.status;
  const isBlocked = packageStatus === 'expired' || packageStatus === 'no_package';

  return (
    <Shell nav={nav} title={title}>
      <div className="relative">
        <div className={isBlocked ? 'pointer-events-none blur-sm opacity-50 select-none' : ''}>
          <Routes>
            <Route index element={<StudentDashboard onMount={() => setTitle('Öğrenci Paneli')} />} />
            <Route path="plan" element={<StudentPlan onMount={() => setTitle('Haftalık Plan')} />} />
            <Route path="kronometre" element={<StudentTimer onMount={() => setTitle('Kronometre')} />} />
            <Route path="sessions" element={<StudentSessions onMount={() => setTitle('Çalışma Kayıtlarım')} />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </div>
        {isBlocked && <PackageBlocker status={packageStatus} />}
      </div>
    </Shell>
  );
};

export default StudentApp;
