export type Language = 'ka' | 'en' | 'ru';
export type Translated = Record<Language, string>;
export type Availability = 'available' | 'sold_out' | 'unavailable';
export interface PriceOption {
  id: string;
  label_translations: Translated;
  price_minor: number;
  quantity: number;
  unit: 'ml' | 'g' | 'pcs';
  sort_order: number;
  is_default: boolean;
  is_available: boolean;
}
export interface Category {
  id: string;
  slug: string;
  translations: Translated;
  sort_order: number;
  is_visible: boolean;
}
export interface Dish {
  id: string;
  category_id: string;
  slug: string;
  translations: {
    name: Translated;
    description: Translated;
    ingredients: Translated;
  };
  base_price_minor: number | null;
  price_options: PriceOption[];
  image_id: string | null;
  allergen_ids: string[];
  is_published: boolean;
  is_visible: boolean;
  availability: Availability;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
export interface MenuData {
  settings: {
    schema_version: '1.0';
    menu_id: string;
    restaurant_name: string;
    default_language: Language;
    supported_languages: Language[];
    currency: 'GEL';
    contact_phone: string | null;
    instagram_url: string | null;
    address: string | null;
    updated_at: string;
    published_at: string | null;
  };
  categories: Category[];
  dishes: Dish[];
  allergens: Array<{ id: string; translations: Translated }>;
  media: Array<{ id: string; path: string; alt_translations: Translated; width: number; height: number; format: string; size_bytes: number }>;
}