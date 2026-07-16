import React from 'react';
import { Lock, Phone, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';

const PackageBlocker = ({ status }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-5 pointer-events-none">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm pointer-events-auto" />
      <div className="relative pointer-events-auto max-w-lg w-full rounded-2xl border border-gold/40 bg-ink shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] p-8">
        <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="mt-5 text-center font-display font-black text-2xl text-white">
          Paket Süreniz Sona Ermiş
        </h2>
        <p className="mt-3 text-center text-white/70">
          Platformu kullanmaya devam edebilmek için lütfen yöneticinizle iletişime geçiniz.
          {status === 'no_package' && ' Henüz aktif bir paketiniz bulunmamaktadır.'}
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button asChild className="h-11 bg-gold hover:bg-gold-light text-ink font-semibold">
            <a href="tel:08500000000"><Phone className="w-4 h-4 mr-2" /> Ara: 0 850 000 00 00</a>
          </Button>
          <Button asChild variant="outline" className="h-11 border-white/15 text-white hover:bg-white/5">
            <a href="mailto:destek@kocumsinav.com"><Mail className="w-4 h-4 mr-2" /> Destek</a>
          </Button>
        </div>
        <p className="mt-4 text-center text-[11px] text-white/40">
          Geçmiş verileriniz sistemde kayıtlıdır ve paketiniz yenilendiğinde erişim tekrar açılacaktır.
        </p>
      </div>
    </div>
  );
};

export default PackageBlocker;
