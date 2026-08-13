// KhamarCare — Utility: Formatters
import { CURRENCY } from '../config/constants.js';

export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return `${CURRENCY.symbol}0`;
  const num = Number(amount);
  if (num >= 100000) {
    return `${CURRENCY.symbol}${(num / 100000).toFixed(1)} লাখ`;
  }
  return `${CURRENCY.symbol}${num.toLocaleString('en-IN')}`;
};

export const formatCurrencyShort = (amount) => {
  if (amount == null || isNaN(amount)) return `${CURRENCY.symbol}0`;
  const num = Number(amount);
  if (num >= 10000000) return `${CURRENCY.symbol}${(num / 10000000).toFixed(1)}কো`;
  if (num >= 100000) return `${CURRENCY.symbol}${(num / 100000).toFixed(1)}লা`;
  if (num >= 1000) return `${CURRENCY.symbol}${(num / 1000).toFixed(1)}হা`;
  return `${CURRENCY.symbol}${num}`;
};

export const formatNumber = (num, decimals = 1) => {
  if (num == null || isNaN(num)) return '0';
  return Number(num).toFixed(decimals);
};

export const formatLiter = (amount, lang = 'bn') => {
  if (amount == null) return '0';
  const unit = lang === 'bn' ? 'লি.' : 'L';
  return `${Number(amount).toFixed(1)} ${unit}`;
};

export const formatWeight = (amount, lang = 'bn') => {
  if (amount == null) return '0';
  const unit = lang === 'bn' ? 'কেজি' : 'kg';
  return `${Number(amount).toFixed(1)} ${unit}`;
};

export const formatPercent = (value) => {
  if (value == null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(1)}%`;
};

export const getStatusColor = (status) => {
  const colors = {
    lactating: '#43A047',
    pregnant: '#FF8F00',
    dry: '#9E9E9E',
    open: '#1E88E5',
    sick: '#E53935',
    sold: '#757575',
    dead: '#424242',
  };
  return colors[status] || '#9E9E9E';
};

export const getAnimalIcon = (type) => {
  const icons = {
    cow: '🐄',
    heifer: '🐄',
    calf: '🐮',
    bull: '🐂',
  };
  return icons[type] || '🐄';
};
