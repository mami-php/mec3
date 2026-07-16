import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Package, ClipboardList, LayoutTemplate } from 'lucide-react';
import Shell from '../../components/panel/Shell';
import Dashboard from './Dashboard';
import UsersPage from './Users';
import PackagesPage from './Packages';
import SessionsPage from './Sessions';
import CMSLayout from './cms/CMSLayout';
import CMSGeneral from './cms/CMSGeneral';
import CMSHeader from './cms/CMSHeader';
import CMSHero from './cms/CMSHero';
import CMSFooter from './cms/CMSFooter';
import CMSLandingMentors from './cms/CMSLandingMentors';
import CMSTestimonials from './cms/CMSTestimonials';
import CMSFAQs from './cms/CMSFAQs';
import CMSPreview from './cms/CMSPreview';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Öğrenciler', icon: GraduationCap },
  { to: '/admin/mentors', label: 'Mentörler', icon: Users },
  { to: '/admin/admins', label: 'Adminler', icon: Users },
  { to: '/admin/packages', label: 'Paketler', icon: Package },
  { to: '/admin/sessions', label: 'Çalışma Kayıtları', icon: ClipboardList },
  { to: '/admin/cms/general', label: 'Site İçeriği (CMS)', icon: LayoutTemplate },
];

const titleFor = (path) => {
  if (path === '/admin') return 'Yönetici Paneli';
  if (path.endsWith('/students')) return 'Öğrenciler';
  if (path.endsWith('/mentors')) return 'Mentörler';
  if (path.endsWith('/admins')) return 'Adminler';
  if (path.endsWith('/packages')) return 'Paketler';
  if (path.endsWith('/sessions')) return 'Çalışma Kayıtları';
  if (path.includes('/cms/')) return 'Site İçeriği (CMS)';
  return 'Yönetici Paneli';
};

const AdminApp = () => {
  const [title, setTitle] = useState('Yönetici Paneli');
  useEffect(() => {
    setTitle(titleFor(window.location.pathname));
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
        <Route path="cms" element={<CMSLayout />}>
          <Route index element={<Navigate to="/admin/cms/general" replace />} />
          <Route path="general" element={<CMSGeneral />} />
          <Route path="header" element={<CMSHeader />} />
          <Route path="hero" element={<CMSHero />} />
          <Route path="footer" element={<CMSFooter />} />
          <Route path="mentors" element={<CMSLandingMentors />} />
          <Route path="testimonials" element={<CMSTestimonials />} />
          <Route path="faqs" element={<CMSFAQs />} />
          <Route path="preview" element={<CMSPreview />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  );
};

export default AdminApp;
