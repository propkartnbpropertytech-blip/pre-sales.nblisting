export interface PreSalesField {
  id?: string;
  field_key: string;
  label: string;
  field_type:
    | 'text'
    | 'number'
    | 'dropdown'
    | 'textarea'
    | 'date'
    | 'photos'
    | 'videos'
    | 'url'
    | 'google_location'
    | 'phone';
  is_required: boolean;
  options?: { label: string; value: string }[] | string;
  placeholder?: string;
  help_text?: string;
}

export interface PreSalesSubmissionPayload {
  project_name: string;
  developer: string;
  property_category: string;
  property_sub_type?: string;
  price: number;
  price_display?: string;
  area: number;
  bhk?: string;
  city: string;
  locality: string;
  address?: string;
  possession_date: string;
  rera_number: string;
  location_url?: string;
  amenities_text?: string;
  description: string;
  photos: string[];
  videos?: string[];
  contact_person?: string;
  contact_phone?: string;
  raw_data?: Record<string, any>;
}

export interface UploadedMediaItem {
  id?: string;
  field_key?: string;
  media_type: 'photo' | 'video';
  storage_path?: string;
  public_url: string;
  original_name?: string;
  file_size?: number;
  mime_type?: string;
}

export interface PreSalesSubmissionResult {
  success: boolean;
  registration_code: string;
  id?: string;
  title: string;
  message?: string;
}
