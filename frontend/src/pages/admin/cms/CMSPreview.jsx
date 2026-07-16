import React, { useRef, useState } from 'react';
import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const devices = [
  { key: 'desktop', label: 'Masaüstü', icon: Monitor, width: '100%' },
  { key: 'tablet', label: 'Tablet', icon: Tablet, width: '834px' },
  { key: 'mobile', label: 'Mobil', icon: Smartphone, width: '390px' },
];

const CMSPreview = () => {
  const iframeRef = useRef(null);
  const [device, setDevice] = useState('desktop');
  const [key, setKey] = useState(0);
  const src = '/?preview=1';

  const refresh = () => setKey((k) => k + 1);

  const active = devices.find((d) => d.key === device);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {devices.map((d) => (
            <button key={d.key} onClick={() => setDevice(d.key)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                device === d.key ? 'bg-gold/15 text-gold border border-gold/30' : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}>
              <d.icon className="w-4 h-4" /> {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refresh} variant="outline" className="border-white/15 text-white hover:bg-white/5 h-9"><RefreshCw className="w-4 h-4 mr-1" /> Yenile</Button>
          <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5 h-9">
            <a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Yeni sekmede aç</a>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-start justify-center overflow-auto" style={{ minHeight: '80vh' }}>
        <div
          className="rounded-xl overflow-hidden border border-white/10 bg-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] transition-all"
          style={{ width: active.width, maxWidth: '100%' }}
        >
          <iframe
            key={key}
            ref={iframeRef}
            src={src}
            title="Site Önizleme"
            style={{ width: '100%', height: '80vh', border: 0 }}
          />
        </div>
      </div>

      <p className="text-xs text-white/40 text-center">
        Not: CMS'te yapılan değişiklikler kaydedildiğinde bu önizleme otomatik yenilenmez; "Yenile" butonuna basınız.
      </p>
    </div>
  );
};

export default CMSPreview;
