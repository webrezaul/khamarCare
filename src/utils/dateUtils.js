// KhamarCare — Utility: Date Helpers
import { format, formatDistanceToNow, differenceInDays, differenceInMonths, differenceInYears, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, isAfter, isBefore, isToday, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy');
  } catch { return dateStr; }
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'dd MMM');
  } catch { return dateStr; }
};

export const formatDateLong = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy');
  } catch { return dateStr; }
};

export const todayStr = () => format(new Date(), 'yyyy-MM-dd');

export const getAge = (dobStr) => {
  if (!dobStr) return { years: 0, months: 0, days: 0 };
  const dob = new Date(dobStr);
  const now = new Date();
  return {
    years: differenceInYears(now, dob),
    months: differenceInMonths(now, dob) % 12,
    days: differenceInDays(now, dob) % 30,
  };
};

export const getAgeString = (dobStr, lang = 'bn') => {
  const { years, months } = getAge(dobStr);
  if (lang === 'bn') {
    if (years > 0) return `${years} বছর ${months} মাস`;
    return `${months} মাস`;
  }
  if (years > 0) return `${years}y ${months}m`;
  return `${months}m`;
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  return differenceInDays(new Date(dateStr), new Date());
};

export const daysAgo = (dateStr) => {
  if (!dateStr) return null;
  return differenceInDays(new Date(), new Date(dateStr));
};

export const getDateRange = (period) => {
  const now = new Date();
  switch (period) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 6 }), end: endOfDay(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfDay(now) };
    case 'last7':
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
    case 'last30':
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
    default:
      return { start: startOfMonth(now), end: endOfDay(now) };
  }
};

export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
};

export const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
};

export { isToday, isAfter, isBefore, format, parseISO };
