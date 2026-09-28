import React from 'react';
import { Phone, ExternalLink, MessageCircle, Sparkles, Building2 } from 'lucide-react';

interface HeaderProps {
  assistancePhone: string;
  listingUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  assistancePhone,
  listingUrl,
}) => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const defaultListingUrl = import.meta.env.VITE_LISTING_URL || (isLocal ? 'http://localhost:3004' : 'https://listing.nbpropertytech.com');
  const finalListingUrl = listingUrl || defaultListingUrl;

  const cleanPhone = assistancePhone.replace(/[^0-9+]/g, '');
  const rawDigits = assistancePhone.replace(/[^0-9]/g, '');

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Hello PropKart Pre-sales Desk, I need assistance registering an upcoming project on the Pre-sales portal.'
    );
    window.open(`https://wa.me/${rawDigits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-apple-sm px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand Logo with exact squircle monogram */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-black">
          <img
            src="/favicon.svg"
            alt="PropKart Official Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-2">
            <span>PropKart</span>
            <span className="text-purple-700 font-bold text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
              Pre-Sales
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Official Developer & Channel Partner Intake Portal
          </p>
        </div>
      </div>

      {/* Right Actions: Assistance Phone & View Showcase Link */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Dynamic Assistance Phone (Synchronized live from Panel Form Builder) */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all cursor-pointer border border-black/[0.04]"
          title="Direct Pre-sales Helpdesk"
        >
          <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="hidden md:inline text-slate-500 font-normal">Assistance:</span>
          <span className="hidden sm:inline font-bold text-slate-800">{assistancePhone}</span>
        </a>

        {/* WhatsApp Support Button */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer"
          title="WhatsApp Pre-sales Support"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Support</span>
        </button>

        {/* View Listing Showcase Link */}
        <a
          href={finalListingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-[#1d1d1f] hover:bg-black active:scale-95 transition-all shadow-apple-sm cursor-pointer shrink-0"
        >
          <span>Showcase</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
        </a>
      </div>
    </header>
  );
};
