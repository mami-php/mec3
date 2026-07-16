import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/api';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../hooks/use-toast';
import { Save } from 'lucide-react';

export const useCMSSection = (section) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/admin/cms/content');
    setContent(data[section] || {});
    setLoading(false);
  }, [section]);

  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    setSaving(true);
    try {
      await api.put(`/admin/cms/content/${section}`, data);
      toast({ title: 'Kaydedildi ✓', description: 'Değişiklikler siteye yansıdı.' });
      // notify preview iframe
      window.postMessage({ type: 'cms:refresh' }, '*');
      document.querySelectorAll('iframe').forEach((f) => f.contentWindow?.postMessage({ type: 'cms:refresh' }, '*'));
    } catch (e) {
      toast({ title: 'Hata', description: e?.response?.data?.detail || 'Kaydedilemedi' });
    } finally {
      setSaving(false);
    }
  };

  return { content, setContent, loading, saving, save };
};

export const SectionCard = ({ title, description, children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
    <div className="mb-5">
      <h3 className="font-display font-bold text-lg text-white">{title}</h3>
      {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export const FormField = ({ label, hint, children }) => (
  <div>
    <Label className="text-white/80 text-xs uppercase tracking-wider font-semibold mb-1.5 block">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-white/40 mt-1">{hint}</p>}
  </div>
);

export const SaveBar = ({ onSave, saving }) => (
  <div className="sticky bottom-0 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 bg-ink/90 backdrop-blur border-t border-white/10 flex justify-end z-20">
    <Button onClick={onSave} disabled={saving} className="bg-gold hover:bg-gold-light text-ink font-semibold h-11 px-6">
      <Save className="w-4 h-4 mr-2" />
      {saving ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet'}
    </Button>
  </div>
);

export { Input, Textarea, Label };
