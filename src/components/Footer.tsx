import React from 'react';
import { ShieldCheck, Phone, Mail, Building2, Sparkles } from 'lucide-react';

interface FooterProps {
  assistancePhone: string;
}

export const Footer: React.FC<FooterProps> = ({ assistancePhone }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-12 text-slate-500 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black overflow-hidden flex items-center justify-center shrink-0">
              <img src="/favicon.svg" alt="PropKart" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">
                PropKart Pre-Sales Portal
              </div>
              <p className="text-xs text-slate-400">
                Official Developer Project Registry & Verification Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href={`tel:${assistancePhone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-slate-600 hover:text-purple-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              <span>{assistancePhone}</span>
            </a>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Ahmedabad, Gujarat</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed Gujarat RERA Compliance and Developer Verification.</span>
          </div>

          <div>
            © {new Date().getFullYear()} NB Property Technology Pvt Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
