import { useEffect, useState } from 'react';
import api from './api';

// Fallback defaults if backend not reachable
const FALLBACK = {
  general: {
    site_name: 'Koçum Sınav',
    brand_prefix: 'Koçum', brand_suffix: 'Sınav',
    brand_tagline: 'MENTORLUK & REHBERLİK',
    phone: '0 850 000 00 00', email: 'destek@kocumsinav.com',
    address: 'İstanbul, Türkiye',
    social: {},
  },
  header: {
    menu: [
      { label: 'Ana Sayfa', href: '#home' },
      { label: 'Koçluk', href: '#kocluk' },
    ],
    login_label: 'Giriş Yap',
    register_label: 'Ücretsiz Görüşme',
    phone_visible: true,
  },
  hero: {
    eyebrow: 'YKS • LGS • KPSS',
    title_gold: 'Koçum Sınav', title_white: 'İçerikleri!',
    subtitle: '', primary_cta: 'Ücretsiz Görüşme', secondary_cta: 'Paketler',
    stats: [],
  },
  footer: { tagline: '', columns: [], copyright: null },
};

export const useSiteContent = () => {
  const [content, setContent] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/site/content');
      setContent({ ...FALLBACK, ...data });
    } catch {
      // keep fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Listen to postMessage for live preview refresh from admin
    const onMsg = (e) => {
      if (e?.data?.type === 'cms:refresh') load();
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return { content, loading, reload: load };
};

export const useSiteCollection = (endpoint) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onMsg = (e) => {
      if (e?.data?.type === 'cms:refresh') load();
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
    // eslint-disable-next-line
  }, [endpoint]);

  return { items, loading, reload: load };
};
