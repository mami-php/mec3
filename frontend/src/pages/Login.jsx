import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import { useAuth } from '../lib/auth';
import Logo from '../components/site/Logo';

const DEMO = [
  { label: 'Admin', email: 'admin@kocumsinav.com', password: 'admin123' },
  { label: 'Mentör', email: 'mentor@kocumsinav.com', password: 'mentor123' },
  { label: 'Öğrenci', email: 'student@kocumsinav.com', password: 'student123' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const { toast } = useToast();

  const submit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      toast({ title: 'Eksik bilgi', description: 'E-posta ve şifre giriniz.' });
      return;
    }
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      const from = loc.state?.from;
      const target = from && from.startsWith('/' + u.role) ? from :
        u.role === 'admin' ? '/admin' : u.role === 'mentor' ? '/mentor' : '/student';
      nav(target, { replace: true });
    } catch (err) {
      toast({
        title: 'Giriş başarısız',
        description: err?.response?.data?.detail || 'Lütfen bilgilerinizi kontrol edin.',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyDemo = (d) => {
    setEmail(d.email);
    setPassword(d.password);
  };

  return (
    <div className="min-h-screen bg-ink relative overflow-hidden flex items-center justify-center px-5 py-10">
      <div className="absolute inset-0 hero-grid opacity-60 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-ink-3/50 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo /></div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[11px] uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel Girişi
          </div>
          <h1 className="mt-4 font-display font-black text-3xl text-white">Tekrar hoş geldin</h1>
          <p className="text-white/60 text-sm mt-1">Hesabınıza giriş yaparak devam et.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-white/80 text-xs uppercase tracking-wider font-semibold">E-posta</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="email" type="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@kocumsinav.com"
                  className="pl-9 h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pw" className="text-white/80 text-xs uppercase tracking-wider font-semibold">Şifre</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="pw" type="password" autoComplete="current-password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold focus-visible:border-gold/50"
                />
              </div>
            </div>
            <Button
              type="submit" disabled={loading}
              className="w-full h-12 bg-gold hover:bg-gold-light text-ink font-semibold shadow-[0_16px_40px_-14px_rgba(201,169,97,0.7)]"
            >
              {loading ? 'Giriş yapılıyor…' : (<>Giriş Yap <ArrowRight className="ml-1 w-4 h-4" /></>)}
            </Button>
          </form>

          <div className="mt-7 pt-5 border-t border-white/10">
            <div className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-2">Demo Hesaplar</div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => applyDemo(d)}
                  className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/80 hover:text-gold hover:border-gold/30 text-xs font-semibold transition-colors"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-white/40 text-center">Butona tıklayıp demo giriş yapabilirsin.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-white/60 hover:text-gold">← Ana sayfaya dön</a>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
