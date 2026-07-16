import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Package, ClipboardList } from 'lucide-react';
import Shell from '../../components/panel/Shell';
import Dashboard from './Dashboard';
import UsersPage from './Users';
import PackagesPage from './Packages';
import SessionsPage from './Sessions';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Öğrenciler', icon: GraduationCap, roleFilter: 'student' },
  { to: '/admin/mentors', label: 'Mentörler', icon: Users, roleFilter: 'mentor' },
  { to: '/admin/admins', label: 'Adminler', icon: Users, roleFilter: 'admin' },
  { to: '/admin/packages', label: 'Paketler', icon: Package },
  { to: '/admin/sessions', label: 'Çalışma Kayıtları', icon: ClipboardList },
];

const titleFor = (path) => {
  if (path === '/admin') return 'Yönetici Paneli';
  if (path.endsWith('/students')) return 'Öğrenciler';
  if (path.endsWith('/mentors')) return 'Mentörler';
  if (path.endsWith('/admins')) return 'Adminler';
  if (path.endsWith('/packages')) return 'Paketler';
  if (path.endsWith('/sessions')) return 'Çalışma Kayıtları';
  return 'Yönetici Paneli';
};

const AdminApp = () => {
  const [title, setTitle] = useState('Yönetici Paneli');
  useEffect(() => {
    const update = () => setTitle(titleFor(window.location.pathname));
    update();
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  return (
    <Shell nav={nav} title={title}>
      <Routes>
        <Route index element={<Dashboard onMount={() => setTitle('Yönetici Paneli')} />} />
        <Route path="students" element={<UsersPage roleFilter="student" onMount={() => setTitle('Öğrenciler')} />} />
        <Route path="mentors" element={<UsersPage roleFilter="mentor" onMount={() => setTitle('Mentörler')} />} />
        <Route path="admins" element={<UsersPage roleFilter="admin" onMount={() => setTitle('Adminler')} />} />
        <Route path="packages" element={<PackagesPage onMount={() => setTitle('Paketler')} />} />
        <Route path="sessions" element={<SessionsPage onMount={() => setTitle('Çalışma Kayıtları')} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  );
};

export default AdminApp;
