// KhamarCare — App Constants
export const APP_NAME = 'KhamarCare';
export const APP_NAME_BN = 'খামার কেয়ার';
export const APP_VERSION = '1.0.0';
export const DEFAULT_LANGUAGE = 'bn';

// Currency
export const CURRENCY = {
  code: 'BDT',
  symbol: '৳',
  name: 'Bangladeshi Taka',
  nameBn: 'বাংলাদেশী টাকা',
};

// Units
export const UNITS = {
  LITER: { en: 'L', bn: 'লি.' },
  KG: { en: 'kg', bn: 'কেজি' },
  GRAM: { en: 'g', bn: 'গ্রাম' },
  BIGHA: { en: 'bigha', bn: 'বিঘা' },
  PIECE: { en: 'pcs', bn: 'টি' },
};

// Animal Types
export const ANIMAL_TYPES = {
  COW: 'cow',
  HEIFER: 'heifer',
  CALF: 'calf',
  BULL: 'bull',
};

export const ANIMAL_TYPE_LABELS = {
  cow: { en: 'Cow', bn: 'গাভী' },
  heifer: { en: 'Heifer', bn: 'বকনা' },
  calf: { en: 'Calf', bn: 'বাছুর' },
  bull: { en: 'Bull', bn: 'ষাঁড়' },
};

// Animal Status
export const ANIMAL_STATUS = {
  LACTATING: 'lactating',
  PREGNANT: 'pregnant',
  DRY: 'dry',
  OPEN: 'open',
  SICK: 'sick',
  SOLD: 'sold',
  DEAD: 'dead',
};

export const ANIMAL_STATUS_LABELS = {
  lactating: { en: 'Lactating', bn: 'দুধ দিচ্ছে' },
  pregnant: { en: 'Pregnant', bn: 'গর্ভবতী' },
  dry: { en: 'Dry', bn: 'শুষ্ক' },
  open: { en: 'Open', bn: 'খোলা' },
  sick: { en: 'Sick', bn: 'অসুস্থ' },
  sold: { en: 'Sold', bn: 'বিক্রি' },
  dead: { en: 'Dead', bn: 'মৃত' },
};

export const ANIMAL_STATUS_COLORS = {
  lactating: '#43A047',
  pregnant: '#FF8F00',
  dry: '#9E9E9E',
  open: '#1E88E5',
  sick: '#E53935',
  sold: '#757575',
  dead: '#424242',
};

// Gender
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
};

export const GENDER_LABELS = {
  male: { en: 'Male', bn: 'পুরুষ' },
  female: { en: 'Female', bn: 'মহিলা' },
};

// Feed Categories
export const FEED_CATEGORIES = [
  { id: 'green_grass', en: 'Green Grass', bn: 'কাঁচা ঘাস', unit: 'kg', icon: '🌿' },
  { id: 'straw', en: 'Straw', bn: 'খড়', unit: 'kg', icon: '🌾' },
  { id: 'wheat_bran', en: 'Wheat Bran', bn: 'গমের ভুষি', unit: 'kg', icon: '🌾' },
  { id: 'rice_bran', en: 'Rice Bran', bn: 'কুঁড়া', unit: 'kg', icon: '🍚' },
  { id: 'dairy_feed', en: 'Dairy Feed', bn: 'ডেইরি ফিড', unit: 'kg', icon: '📦' },
  { id: 'maize', en: 'Maize', bn: 'ভুট্টা', unit: 'kg', icon: '🌽' },
  { id: 'silage', en: 'Silage', bn: 'সাইলেজ', unit: 'kg', icon: '🥬' },
  { id: 'oil_cake', en: 'Oil Cake', bn: 'খৈল', unit: 'kg', icon: '🫘' },
  { id: 'mineral_mix', en: 'Mineral Mix', bn: 'মিনারেল মিক্স', unit: 'gram', icon: '💊' },
  { id: 'salt', en: 'Salt', bn: 'লবণ', unit: 'gram', icon: '🧂' },
  { id: 'calcium', en: 'Calcium', bn: 'ক্যালসিয়াম', unit: 'gram', icon: '💎' },
  { id: 'other', en: 'Other', bn: 'অন্যান্য', unit: 'kg', icon: '📋' },
];

// Income Categories
export const INCOME_CATEGORIES = [
  { id: 'milk_sales', en: 'Milk Sales', bn: 'দুধ বিক্রি', icon: '🥛' },
  { id: 'cattle_sales', en: 'Cattle Sales', bn: 'গরু বিক্রি', icon: '🐄' },
  { id: 'calf_sales', en: 'Calf Sales', bn: 'বাছুর বিক্রি', icon: '🐮' },
  { id: 'manure_sales', en: 'Manure Sales', bn: 'গোবর বিক্রি', icon: '💩' },
  { id: 'other_income', en: 'Other Income', bn: 'অন্যান্য আয়', icon: '💰' },
];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  { id: 'feed', en: 'Feed', bn: 'খাদ্য', icon: '🌾' },
  { id: 'grass', en: 'Grass', bn: 'ঘাস', icon: '🌿' },
  { id: 'straw', en: 'Straw', bn: 'খড়', icon: '🌾' },
  { id: 'medicine', en: 'Medicine', bn: 'ওষুধ', icon: '💊' },
  { id: 'vaccination', en: 'Vaccination', bn: 'টিকা', icon: '💉' },
  { id: 'ai_breeding', en: 'AI/Breeding', bn: 'কৃত্রিম প্রজনন', icon: '🔬' },
  { id: 'labor', en: 'Labor', bn: 'শ্রমিক', icon: '👷' },
  { id: 'electricity', en: 'Electricity', bn: 'বিদ্যুৎ', icon: '⚡' },
  { id: 'water', en: 'Water', bn: 'পানি', icon: '💧' },
  { id: 'transport', en: 'Transport', bn: 'পরিবহন', icon: '🚛' },
  { id: 'equipment', en: 'Equipment', bn: 'যন্ত্রপাতি', icon: '🔧' },
  { id: 'veterinary', en: 'Veterinary', bn: 'পশু চিকিৎসা', icon: '🏥' },
  { id: 'other_expense', en: 'Other', bn: 'অন্যান্য', icon: '📋' },
];

// Grass Types
export const GRASS_TYPES = [
  { id: 'napier', en: 'Napier', bn: 'নেপিয়ার' },
  { id: 'pakchong', en: 'Pakchong', bn: 'পাকচং' },
  { id: 'maize_grass', en: 'Maize', bn: 'ভুট্টা' },
  { id: 'german', en: 'German Grass', bn: 'জার্মান ঘাস' },
  { id: 'other_grass', en: 'Other', bn: 'অন্যান্য' },
];

// Default Settings
export const DEFAULT_SETTINGS = {
  milkPricePerLiter: 50,
  gestationPeriodDays: 283,
  heatCycleDays: 21,
  language: 'bn',
  weightUnit: 'kg',
  volumeUnit: 'liter',
  areaUnit: 'bigha',
  currency: 'BDT',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  VACCINATION: 'vaccination',
  DEWORMING: 'deworming',
  HEAT: 'heat',
  BREEDING: 'breeding',
  PREGNANCY_CHECK: 'pregnancy_check',
  CALVING: 'calving',
  MEDICINE: 'medicine',
  FEED_STOCK: 'feed_stock',
  PAYMENT: 'payment',
  CUSTOM: 'custom',
};

// Chart Colors
export const CHART_COLORS = [
  '#2D7D46', '#FF8F00', '#1E88E5', '#E53935', '#8E24AA',
  '#00ACC1', '#43A047', '#FFB300', '#5C6BC0', '#F4511E',
];

// Profitability Score Thresholds
export const PROFITABILITY_SCORES = {
  EXCELLENT: { min: 80, label: { en: 'Excellent', bn: 'চমৎকার' }, color: '#43A047' },
  GOOD: { min: 60, label: { en: 'Good', bn: 'ভালো' }, color: '#FF8F00' },
  NEEDS_ATTENTION: { min: 0, label: { en: 'Needs Attention', bn: 'মনোযোগ দরকার' }, color: '#E53935' },
};

// Common Breeds in Bangladesh
export const BREEDS = [
  { id: 'local', name: 'Local/Deshi', nameBn: 'দেশি', origin: 'Bangladesh' },
  { id: 'friesian', name: 'Friesian Cross', nameBn: 'ফ্রিজিয়ান ক্রস', origin: 'Netherlands' },
  { id: 'shahiwal', name: 'Shahiwal', nameBn: 'শাহীওয়াল', origin: 'Pakistan' },
  { id: 'red_chittagong', name: 'Red Chittagong', nameBn: 'লাল চট্টগ্রামী', origin: 'Bangladesh' },
  { id: 'jersey_cross', name: 'Jersey Cross', nameBn: 'জার্সি ক্রস', origin: 'Jersey' },
  { id: 'sindhi', name: 'Sindhi', nameBn: 'সিন্ধি', origin: 'Pakistan' },
  { id: 'holstein', name: 'Holstein Cross', nameBn: 'হলস্টেইন ক্রস', origin: 'Netherlands' },
  { id: 'mixed', name: 'Mixed', nameBn: 'মিশ্র', origin: 'Mixed' },
];
