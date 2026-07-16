import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Bell, Search } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import Logo from '../site/Logo';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const Shell = ({ nav, title, children }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const RoleBadge = () => (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
      {user?.role === 'admin' ? 'Admin' : user?.role === 'mentor' ? 'Mentör' : 'Öğrenci'}
    </span>
  );

  const NavItems = ({ onNav }) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNav}
          className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-gold/15 text-gold border border-gold/25'
              : 'text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  const SidebarInner = ({ onNav }) => (
    <div className="h-full flex flex-col bg-ink border-r border-white/10">
      <div className="px-5 py-4 border-b border-white/10">
        <Logo />
      </div>
      <NavItems onNav={onNav} />
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
            {user?.full_name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.full_name}</div>
            <div className="flex items-center gap-2 mt-0.5"><RoleBadge /></div>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="fixed left-0 top-0 bottom-0 w-[260px]">
          <SidebarInner />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-ink/85 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-md text-white hover:bg-white/5" aria-label="Menü">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-ink border-r border-white/10 text-white p-0 w-[280px]">
                <SidebarInner onNav={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="font-display font-black text-lg sm:text-xl text-white truncate">{title}</h1>
              <div className="text-[11px] text-white/50 mt-0.5">Hoş geldin, {user?.full_name?.split(' ')[0]}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/60 hover:text-gold text-xs">
              <Search className="w-4 h-4" /> Ara
            </button>
            <button className="relative w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 text-white/70 hover:text-gold flex items-center justify-center" aria-label="Bildirimler">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
