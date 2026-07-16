import React from 'react';
import { useCMSSection, SectionCard, FormField, SaveBar, Input } from './cms-parts';

const CMSGeneral = () => {
  const { content, setContent, saving, save } = useCMSSection('general');
  const set = (k) => (e) => setContent({ ...content, [k]: e.target.value });
  const setSocial = (k) => (e) => setContent({ ...content, social: { ...(content.social || {}), [k]: e.target.value } });

  return (
    <div className="space-y-5 pb-24">
      <SectionCard title="Site Kimliği" description="Site adı, marka ismi ve slogan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Site Adı"><Input value={content.site_name || ''} onChange={set('site_name')} className="input" /></FormField>
          <FormField label="Logo Yazısı - ön ek" hint="Logo'nun beyaz kısmı (örn: Koçum)"><Input value={content.brand_prefix || ''} onChange={set('brand_prefix')} className="input" /></FormField>
          <FormField label="Logo Yazısı - altın kısım" hint="Altın renginde görünecek (örn: Sınav)"><Input value={content.brand_suffix || ''} onChange={set('brand_suffix')} className="input" /></FormField>
          <FormField label="Logo Altı Slogan"><Input value={content.brand_tagline || ''} onChange={set('brand_tagline')} className="input" /></FormField>
          <FormField label="Favicon URL (opsiyonel)"><Input value={content.favicon_url || ''} onChange={set('favicon_url')} className="input" placeholder="https://" /></FormField>
        </div>
      </SectionCard>

      <SectionCard title="İletişim Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Telefon"><Input value={content.phone || ''} onChange={set('phone')} className="input" /></FormField>
          <FormField label="E-posta"><Input type="email" value={content.email || ''} onChange={set('email')} className="input" /></FormField>
          <FormField label="Adres"><Input value={content.address || ''} onChange={set('address')} className="input" /></FormField>
        </div>
      </SectionCard>

      <SectionCard title="Sosyal Medya">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Instagram URL"><Input value={content.social?.instagram || ''} onChange={setSocial('instagram')} className="input" /></FormField>
          <FormField label="YouTube URL"><Input value={content.social?.youtube || ''} onChange={setSocial('youtube')} className="input" /></FormField>
          <FormField label="Facebook URL"><Input value={content.social?.facebook || ''} onChange={setSocial('facebook')} className="input" /></FormField>
          <FormField label="Twitter / X URL"><Input value={content.social?.twitter || ''} onChange={setSocial('twitter')} className="input" /></FormField>
        </div>
      </SectionCard>

      <SaveBar onSave={() => save(content)} saving={saving} />
    </div>
  );
};

export default CMSGeneral;
