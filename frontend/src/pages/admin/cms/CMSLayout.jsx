import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutTemplate, Home, Menu as MenuIcon, Users, MessageCircle, HelpCircle, Palette, Eye, Settings2, PanelBottom } from 'lucide-react';

const tabs = [
  { to: '/admin/cms/general', label: 'Genel', icon: Settings2 },
  { to: '/admin/cms/header', label: 'Header & Menü', icon: MenuIcon },
  { to: '/admin/cms/hero', label: 'Hero', icon: Home },
  { to: '/admin/cms/footer', label: 'Footer', icon: PanelBottom },
  { to: '/admin/cms/mentors', label: 'Mentorlar', icon: Users },
  { to: '/admin/cms/testimonials', label: 'Referanslar', icon: MessageCircle },
  { to: '/admin/cms/faqs', label: 'S.S.S', icon: HelpCircle },
  { to: '/admin/cms/preview', label: 'Önizleme', icon: Eye },
];

const CMSLayout = () => {
  const loc = useLocation();
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((t) => {
            const active = loc.pathname.startsWith(t.to);
            return (
              <Link key={t.to} to={t.to}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? 'bg-gold/15 text-gold border border-gold/25' : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default CMSLayout;
