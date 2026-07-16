import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList } from 'lucide-react';
import Shell from '../../components/panel/Shell';
import MentorDashboard from './MentorDashboard';
import MentorStudents from './MentorStudents';
import MentorStudentDetail from './MentorStudentDetail';

const nav = [
  { to: '/mentor', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mentor/students', label: 'Öğrencilerim', icon: Users },
  { to: '/mentor/sessions', label: 'Çalışma Kayıtları', icon: ClipboardList },
];

const titleFor = (path) => {
  if (path === '/mentor') return 'Mentör Paneli';
  if (path.includes('/students/')) return 'Öğrenci Detayı';
  if (path.endsWith('/students')) return 'Öğrencilerim';
  if (path.endsWith('/sessions')) return 'Çalışma Kayıtları';
  return 'Mentör Paneli';
};

const MentorApp = () => {
  const [title, setTitle] = useState('Mentör Paneli');
  useEffect(() => { setTitle(titleFor(window.location.pathname)); }, []);

  return (
    <Shell nav={nav} title={title}>
      <Routes>
        <Route index element={<MentorDashboard onMount={() => setTitle('Mentör Paneli')} />} />
        <Route path="students" element={<MentorStudents onMount={() => setTitle('Öğrencilerim')} />} />
        <Route path="students/:sid" element={<MentorStudentDetailWrap onSetTitle={setTitle} />} />
        <Route path="sessions" element={<MentorStudents onMount={() => setTitle('Çalışma Kayıtları')} showAllSessions />} />
        <Route path="*" element={<Navigate to="/mentor" replace />} />
      </Routes>
    </Shell>
  );
};

const MentorStudentDetailWrap = ({ onSetTitle }) => {
  const { sid } = useParams();
  useEffect(() => { onSetTitle('Öğrenci Detayı'); }, [onSetTitle]);
  return <MentorStudentDetail sid={sid} />;
};

export default MentorApp;
