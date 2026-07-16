import React from 'react';

export const StatCard = ({ icon: Icon, label, value, sub, tone = 'default' }) => {
  const toneRing = tone === 'gold' ? 'bg-gold/15 border-gold/25 text-gold' : 'bg-white/[0.05] border-white/10 text-white/80';
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${toneRing}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>
      <div className="mt-4">
        <div className="font-display font-black text-3xl text-white">{value}</div>
        <div className="text-xs text-white/60 mt-1 uppercase tracking-wider font-semibold">{label}</div>
        {sub && <div className="text-[11px] text-white/40 mt-1">{sub}</div>}
      </div>
    </div>
  );
};

export const PanelCard = ({ title, action, children, className = '' }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/[0.02] p-5 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="font-display font-bold text-white text-lg">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-12 px-6 text-center">
    {Icon && <div className="mx-auto w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/40"><Icon className="w-5 h-5" /></div>}
    <div className="mt-4 font-display font-bold text-white">{title}</div>
    {description && <div className="mt-1 text-white/50 text-sm">{description}</div>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const StatusBadge = ({ status }) => {
  const map = {
    active: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    inactive: 'bg-white/[0.06] border-white/20 text-white/60',
    blocked: 'bg-red-500/15 border-red-500/40 text-red-300',
    deleted: 'bg-red-500/15 border-red-500/40 text-red-300',
  };
  const label = { active: 'Aktif', inactive: 'Pasif', blocked: 'Engelli', deleted: 'Silinmiş' }[status] || status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || 'bg-white/[0.05] border-white/10 text-white/60'}`}>
      {label}
    </span>
  );
};

export const MiniBarChart = ({ data, valueKey = 'seconds', max = null, formatter }) => {
  const values = data.map((d) => d[valueKey] || 0);
  const m = max || Math.max(1, ...values);
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((d, i) => {
        const v = d[valueKey] || 0;
        const h = (v / m) * 100;
        return (
          <div key={i} className="group flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-gold-dark via-gold to-gold-light transition-all duration-500"
              style={{ height: `${h}%`, minHeight: v > 0 ? '4px' : '2px', opacity: v > 0 ? 1 : 0.15 }}
              title={formatter ? formatter(v) : v}
            />
            <div className="text-[9px] text-white/40">{d.label || d.date?.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
};
