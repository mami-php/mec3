import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/908500000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan ulaş"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-30" />
      <span className="relative w-14 h-14 rounded-full bg-gold text-ink flex items-center justify-center shadow-[0_16px_40px_-10px_rgba(201,169,97,0.7)] group-hover:bg-gold-light transition-colors">
        <MessageCircle className="w-6 h-6" />
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
