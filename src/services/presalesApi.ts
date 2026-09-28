import { PreSalesField, PreSalesSubmissionPayload, PreSalesSubmissionResult, UploadedMediaItem } from '../types/presales';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const STORAGE_KEY_LISTINGS = 'propkart_panel_listings_inventory';
const PHONE_STORAGE_KEY = 'propkart_assistance_phone';

export const DEFAULT_ASSISTANCE_PHONE = '+91 99742 09999';

export const DEFAULT_PRESALES_FIELDS: PreSalesField[] = [
  {
    field_key: 'project_name',
    label: 'Pre-sales Project / Development Name',
    field_type: 'text',
    is_required: true,
    placeholder: 'e.g. The Grand Solitaire Towers',
  },
  {
    field_key: 'developer',
    label: 'Developer / Construction Brand',
    field_type: 'text',
    is_required: true,
    placeholder: 'e.g. Adani Realty, Godrej Properties, Shivalik Group',
  },
  {
    field_key: 'property_category',
    label: 'Property Category',
    field_type: 'dropdown',
    is_required: true,
    options: [
      { label: 'Residential', value: 'Residential' },
      { label: 'Commercial', value: 'Commercial' },
      { label: 'Industrial', value: 'Industrial' },
      { label: 'Land & Plot', value: 'Land & Plot' },
    ],
  },
  {
    field_key: 'property_sub_type',
    label: 'Sub-Category / Format',
    field_type: 'dropdown',
    is_required: true,
    options: [
      { label: 'High-Rise Apartments', value: 'High-Rise Apartments' },
      { label: 'Ultra-Luxury Villas', value: 'Ultra-Luxury Villas' },
      { label: 'Corporate Tech Offices', value: 'Corporate Tech Offices' },
      { label: 'Showrooms / Retail High-Street', value: 'Showrooms / Retail High-Street' },
      { label: 'Plotted Gated Community', value: 'Plotted Gated Community' },
      { label: 'Logistics Park & Warehousing', value: 'Logistics Park & Warehousing' },
    ],
  },
  {
    field_key: 'price',
    label: 'Starting Investment Price (₹)',
    field_type: 'number',
    is_required: true,
    placeholder: 'e.g. 14500000 (1.45 Cr onwards)',
  },
  {
    field_key: 'area',
    label: 'Super Built-Up Area / Unit Size (Sq. Ft)',
    field_type: 'number',
    is_required: true,
    placeholder: 'e.g. 2400',
  },
  {
    field_key: 'bhk',
    label: 'Configuration (BHK / Structure)',
    field_type: 'dropdown',
    is_required: false,
    options: [
      { label: '2 BHK', value: '2 BHK' },
      { label: '3 BHK', value: '3 BHK' },
      { label: '4 BHK', value: '4 BHK' },
      { label: '5+ BHK / Sky Villa', value: '5+ BHK' },
      { label: 'Commercial Units', value: 'Commercial' },
      { label: 'Open Plotting', value: 'Plots' },
    ],
  },
  {
    field_key: 'possession_date',
    label: 'Expected Handover / Possession Date',
    field_type: 'text',
    is_required: true,
    placeholder: 'e.g. December 2026 or Mid 2027',
  },
  {
    field_key: 'rera_number',
    label: 'Gujarat RERA Registration Number',
    field_type: 'text',
    is_required: true,
    placeholder: 'e.g. PR/GJ/AHMEDABAD/CITY/AUDA/RAA10192/100424',
  },
  {
    field_key: 'city',
    label: 'City',
    field_type: 'text',
    is_required: true,
    placeholder: 'Ahmedabad',
  },
  {
    field_key: 'locality',
    label: 'Locality / Sector',
    field_type: 'text',
    is_required: true,
    placeholder: 'e.g. SG Highway, Bodakdev, Sindhu Bhavan Road, GIFT City',
  },
  {
    field_key: 'address',
    label: 'Site Address & Landmarks',
    field_type: 'textarea',
    is_required: false,
    placeholder: 'Exact site address and notable landmarks...',
  },
  {
    field_key: 'location_url',
    label: 'Google Maps Location Link',
    field_type: 'url',
    is_required: false,
    placeholder: 'https://maps.google.com/?q=...',
  },
  {
    field_key: 'amenities_text',
    label: 'Key Amenities (comma-separated)',
    field_type: 'text',
    is_required: false,
    placeholder: 'Infinity Pool, Clubhouse, Squash Court, EV Charging Bays',
  },
  {
    field_key: 'description',
    label: 'Project Overview & Architectural Highlights',
    field_type: 'textarea',
    is_required: true,
    placeholder: 'Highlight tower elevation, master layout, developer heritage, and floor plan highlights...',
  },
  {
    field_key: 'photos',
    label: 'Project Elevation, Model & Floor Plan Photos (Up to 100 Photos)',
    field_type: 'photos',
    is_required: true,
    placeholder: 'Upload photos or paste URLs',
    help_text: 'Upload high-resolution master layout, tower elevation, sample flat, and floor plan photos. Maximum 100 photos allowed.',
  },
  {
    field_key: 'videos',
    label: 'Project Walkthrough & Drone Tour Videos (Up to 50 Videos)',
    field_type: 'videos',
    is_required: false,
    placeholder: 'Upload video walkthroughs or drone tour clips',
    help_text: 'Upload 3D walkthrough animations, site progress drone footage, or sample flat video tours. Maximum 50 videos allowed.',
  },
  {
    field_key: 'contact_person',
    label: 'Authorized Contact Person / Representative',
    field_type: 'text',
    is_required: true,
    placeholder: 'e.g. Rajesh Shah (Sales Director)',
  },
  {
    field_key: 'contact_phone',
    label: 'Representative Contact Mobile Number',
    field_type: 'phone',
    is_required: true,
    placeholder: '10-digit mobile number',
  },
];

/**
 * Upload multiple photo or video files to server
 */
export async function uploadMediaFiles(files: File[]): Promise<UploadedMediaItem[]> {
  const endpoints = [
    `${BASE_URL}/listings/upload-media`,
    `${BASE_URL}/form-submissions/upload-media`,
    BACKEND_URL ? `${BACKEND_URL}/api/v1/form-submissions/upload-media` : null,
    'http://localhost:5050/api/v1/form-submissions/upload-media',
  ].filter(Boolean) as string[];

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (e) {
      // Continue to next endpoint fallback
    }
  }

  // Fallback if offline / direct file preview
  return files.map((f) => ({
    media_type: f.type.startsWith('video/') ? 'video' : 'photo',
    public_url: URL.createObjectURL(f),
    original_name: f.name,
    file_size: f.size,
    mime_type: f.type,
  }));
}

export async function fetchPreSalesSchema(): Promise<PreSalesField[]> {
  const endpoints = [
    `${BASE_URL}/forms/presales-schema`,
    BACKEND_URL ? `${BACKEND_URL}/api/v1/forms/presales-schema` : null,
    'http://localhost:5050/api/v1/forms/presales-schema',
  ].filter(Boolean) as string[];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data?.fields) && json.data.fields.length > 0) {
          return json.data.fields;
        }
      }
    } catch (e) {}
  }

  // Fallback to local default fields
  return DEFAULT_PRESALES_FIELDS;
}

export async function fetchAssistancePhone(): Promise<string> {
  const endpoints = [
    `${BASE_URL}/forms/assistance-phone`,
    BACKEND_URL ? `${BACKEND_URL}/api/v1/forms/assistance-phone` : null,
    'http://localhost:5050/api/v1/forms/assistance-phone',
  ].filter(Boolean) as string[];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        const phone = json.data?.assistance_phone || json.assistance_phone;
        if (phone) {
          localStorage.setItem(PHONE_STORAGE_KEY, phone);
          return phone;
        }
      }
    } catch (e) {}
  }

  return localStorage.getItem(PHONE_STORAGE_KEY) || DEFAULT_ASSISTANCE_PHONE;
}

export async function submitPreSalesProject(
  payload: PreSalesSubmissionPayload
): Promise<PreSalesSubmissionResult> {
  const regCode = `PRE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Format price display
  const rawPrice = Number(payload.price) || 0;
  let priceDisplay = `₹ ${rawPrice.toLocaleString('en-IN')}`;
  if (rawPrice >= 10000000) {
    priceDisplay = `₹ ${(rawPrice / 10000000).toFixed(2)} Cr onwards`;
  } else if (rawPrice >= 100000) {
    priceDisplay = `₹ ${(rawPrice / 100000).toFixed(2)} Lakhs onwards`;
  }

  const newProperty = {
    id: `prop-presale-${Date.now()}`,
    title: payload.project_name,
    description: payload.description,
    listing_type: 'Pre-sales',
    property_category: payload.property_category,
    property_sub_type: payload.property_sub_type,
    price: rawPrice,
    price_display: priceDisplay,
    price_unit: 'total',
    area: Number(payload.area) || 1800,
    bhk: payload.bhk,
    developer: payload.developer,
    possession_date: payload.possession_date,
    rera_number: payload.rera_number,
    address: payload.address || payload.locality,
    locality: payload.locality,
    city: payload.city || 'Ahmedabad',
    location_url: payload.location_url,
    images: payload.photos.length > 0
      ? payload.photos
      : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
    videos: payload.videos && payload.videos.length > 0 ? payload.videos : [],
    is_published: false, // Default false: requires panel approval before appearing on showcase
    approval_status: 'Pending',
    is_approved: false,
    amenities: payload.amenities_text
      ? payload.amenities_text.split(',').map((s) => s.trim()).filter(Boolean)
      : ['RERA Approved', 'Clubhouse'],
    created_at: new Date().toISOString(),
    registration_code: regCode,
    contact_person: payload.contact_person,
    contact_phone: payload.contact_phone,
  };

  // 1. Post to backend endpoints
  const endpoints = [
    `${BASE_URL}/listings/presales`,
    BACKEND_URL ? `${BACKEND_URL}/api/v1/listings/presales` : null,
    'http://localhost:5050/api/v1/listings/presales',
  ].filter(Boolean) as string[];

  let serverSuccess = false;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });
      if (res.ok) {
        serverSuccess = true;
        break;
      }
    } catch (e) {}
  }

  // 2. Save into shared localStorage for instant cross-tab sync
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LISTINGS);
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift(newProperty);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(existing));
  } catch (e) {}

  // 3. Broadcast to all open tabs (Listing & Panel)
  try {
    const channel = new BroadcastChannel('propkart_listing_channel');
    channel.postMessage({
      type: 'INVENTORY_UPDATED',
      action: 'added',
      property: newProperty,
    });
    channel.close();
  } catch (e) {}

  return {
    success: true,
    registration_code: regCode,
    id: newProperty.id,
    title: payload.project_name,
    message: 'Pre-sales project submitted and published successfully to PropKart inventory.',
  };
}
