import React from 'react';
import { PreSalesSubmissionResult } from '../types/presales';
import {
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Building2,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';

interface SuccessViewProps {
  result: PreSalesSubmissionResult;
  onReset: () => void;
  assistancePhone: string;
  listingUrl?: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  result,
  onReset,
  assistancePhone,
  listingUrl,
}) => {
  const [copied, setCopied] = React.useState(false);

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const defaultListingUrl = import.meta.env.VITE_LISTING_URL || (isLocal ? 'http://localhost:3004' : 'https://listing.nbpropertytech.com');
  const finalListingUrl = listingUrl || defaultListingUrl;

  const rawDigits = assistancePhone.replace(/[^0-9]/g, '');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(result.registration_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello PropKart Operations, I have registered our Pre-sales Project *${result.title}* under registration code *${result.registration_code}*. Please verify and activate featured showcase placement.`
    );
    window.open(`https://wa.me/${rawDigits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/90 shadow-apple-lg text-center space-y-6 animate-in fade-in duration-300">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Submitted for Verification & Approval</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {result.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Your pre-sales project has been successfully registered and routed to the <strong>PropKart Operations Desk</strong> for verification. Once approved by our team in the Panel, it will be published live on the public showcase.
        </p>
      </div>

      {/* Registration Code Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between">
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Registration Code
          </div>
          <div className="text-base font-mono font-black text-purple-700">
            {result.registration_code}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-200 transition-all cursor-pointer"
          title="Copy Code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={finalListingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold shadow-apple-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View on Listing Showcase</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-apple-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Connect via WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Register Another Project</span>
        </button>
      </div>
    </div>
  );
};
