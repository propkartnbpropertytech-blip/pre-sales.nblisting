import React from 'react';
import { PreSalesField } from '../types/presales';
import { MediaUploader } from './MediaUploader';
import {
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  Image,
  DollarSign,
  Maximize2,
  Layers,
  Phone,
  User,
  Plus,
  Trash2,
} from 'lucide-react';

interface DynamicFieldInputProps {
  field: PreSalesField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicFieldInput: React.FC<DynamicFieldInputProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  // Parse dropdown options safely
  const options = Array.isArray(field.options)
    ? field.options
    : typeof field.options === 'string'
    ? field.options.split(',').map((o) => ({ label: o.trim(), value: o.trim() }))
    : [];

  // Currency helper formatting
  const formatCurrencyPreview = (num: number) => {
    if (!num || isNaN(num)) return null;
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(2)} Lakhs`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  if (field.field_type === 'photos' || field.field_type === 'videos') {
    return (
      <MediaUploader
        fieldKey={field.field_key}
        label={field.label}
        mediaType={field.field_type === 'videos' ? 'videos' : 'photos'}
        maxFiles={field.field_type === 'videos' ? 50 : 100}
        value={value}
        onChange={onChange}
        error={error}
        helpText={field.help_text}
        required={field.is_required}
      />
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {field.label}
          {field.is_required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
        {field.field_type === 'number' && field.field_key === 'price' && value && (
          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
            {formatCurrencyPreview(Number(value))}
          </span>
        )}
      </div>

      {field.help_text && (
        <p className="text-[11px] text-slate-400">{field.help_text}</p>
      )}

      {/* Field Input Variants */}
      {field.field_type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all ${
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-purple-500'
          }`}
        />
      )}

      {field.field_type === 'phone' && (
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 select-none">
            +91
          </span>
          <input
            type="tel"
            maxLength={10}
            value={value || ''}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, '');
              onChange(digits);
            }}
            placeholder={field.placeholder || '10-digit mobile number'}
            className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-mono font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all ${
              error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-purple-500'
            }`}
          />
        </div>
      )}

      {field.field_type === 'number' && (
        <input
          type="number"
          min="0"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={field.placeholder || `Enter number...`}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all ${
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-purple-500'
          }`}
        />
      )}

      {field.field_type === 'dropdown' && (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all cursor-pointer ${
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-purple-500'
          }`}
        >
          <option value="">Select {field.label}...</option>
          {options.map((opt: any, i: number) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={i} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      )}

      {field.field_type === 'textarea' && (
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all resize-y ${
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-purple-500'
          }`}
        />
      )}

      {(field.field_type === 'url' || field.field_type === 'google_location') && (
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || 'https://maps.google.com/?q=...'}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-hidden transition-all ${
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-purple-500'
          }`}
        />
      )}

      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
};
