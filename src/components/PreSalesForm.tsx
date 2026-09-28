import React, { useState } from 'react';
import { PreSalesField, PreSalesSubmissionPayload, PreSalesSubmissionResult } from '../types/presales';
import { DynamicFieldInput } from './DynamicFieldInput';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface PreSalesFormProps {
  fields: PreSalesField[];
  onSubmit: (payload: PreSalesSubmissionPayload) => Promise<PreSalesSubmissionResult>;
}

export const PreSalesForm: React.FC<PreSalesFormProps> = ({
  fields,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    property_category: 'Residential',
    property_sub_type: 'High-Rise Apartments',
    city: 'Ahmedabad',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = formData[field.field_key];
      if (field.is_required) {
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          newErrors[field.field_key] = `${field.label} is required.`;
        }
      }

      // Specific validation: 10-digit phone number
      if (field.field_type === 'phone' && val) {
        const clean = String(val).replace(/[^0-9]/g, '');
        if (clean.length !== 10) {
          newErrors[field.field_key] = 'Mobile number must be exactly 10 digits.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      // Parse photos
      let photoList: string[] = [];
      if (typeof formData.photos === 'string' && formData.photos.trim()) {
        photoList = formData.photos.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(formData.photos)) {
        photoList = formData.photos;
      }

      // Parse videos
      let videoList: string[] = [];
      if (typeof formData.videos === 'string' && formData.videos.trim()) {
        videoList = formData.videos.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(formData.videos)) {
        videoList = formData.videos;
      }

      const payload: PreSalesSubmissionPayload = {
        project_name: formData.project_name || '',
        developer: formData.developer || '',
        property_category: formData.property_category || 'Residential',
        property_sub_type: formData.property_sub_type || 'High-Rise Apartments',
        price: Number(formData.price) || 0,
        area: Number(formData.area) || 1800,
        bhk: formData.bhk || '',
        city: formData.city || 'Ahmedabad',
        locality: formData.locality || '',
        address: formData.address || '',
        possession_date: formData.possession_date || '',
        rera_number: formData.rera_number || '',
        location_url: formData.location_url || '',
        amenities_text: formData.amenities_text || '',
        description: formData.description || '',
        photos: photoList,
        videos: videoList,
        contact_person: formData.contact_person || '',
        contact_phone: formData.contact_phone || '',
        raw_data: formData,
      };

      await onSubmit(payload);
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-apple-sm space-y-4">
        <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Gujarat RERA Compliant Builder Project Intake</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Register Pre-Sales Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
          Enter project details below. Fields are dynamically configured via the PropKart Operations Desk. Once registered, the project will automatically appear on <strong>listing.nbpropertytech.com</strong>.
        </p>

        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <span>
            Ensure RERA number and starting prices are accurate. Verified pre-sales properties receive premium placement on the PropKart showcase banner.
          </span>
        </div>
      </div>

      {/* Dynamic Fields Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-apple-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>Project Specifications & Intake Data</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field) => {
            const isFullWidth =
              field.field_type === 'textarea' ||
              field.field_type === 'photos' ||
              field.field_type === 'videos' ||
              field.field_key === 'description' ||
              field.field_key === 'project_name';

            return (
              <div
                key={field.field_key}
                id={`field-${field.field_key}`}
                className={isFullWidth ? 'md:col-span-2' : ''}
              >
                <DynamicFieldInput
                  field={field}
                  value={formData[field.field_key]}
                  onChange={(val) => handleFieldChange(field.field_key, val)}
                  error={errors[field.field_key]}
                />
              </div>
            );
          })}
        </div>

        {/* Declarations & Submit */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>I confirm that all project details & RERA info are authentic.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-bold shadow-apple-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Project...</span>
              </>
            ) : (
              <>
                <span>Submit & Publish Pre-sales Project</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
