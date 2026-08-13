// KhamarCare — Milk Dashboard Page
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, TrendingUp } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import useFarmStore from '../../stores/useFarmStore.js';
import { formatLiter, formatCurrency } from '../../utils/formatters.js';
import { todayStr, formatDateShort } from '../../utils/dateUtils.js';
import { CHART_COLORS } from '../../config/constants.js';

export default function MilkDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { getTodayTotalMilk, getDailyMilkTrend, getCowMilkComparison, milkRecords, settings } = useFarmStore();

  const todayMilk = getTodayTotalMilk();
  const milkPrice = Number(settings.milkPricePerLiter) || 50;
  const todayRevenue = todayMilk * milkPrice;
  const milkTrend = getDailyMilkTrend(7);
  const cowComparison = getCowMilkComparison();

  // Weekly & Monthly totals
  const last7 = milkTrend.reduce((s, d) => s + d.total, 0);
  const monthlyMilk = milkRecords.reduce((s, r) => s + (r.totalMilk || 0), 0);

  // Highest/lowest producer
  const highest = cowComparison[0];
  const lowest = cowComparison[cowComparison.length - 1];

  return (
    <div className="page">
      <header className="app-header">
        <div>
          <div className="app-header-title">{t('milk.title')}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/milk/add')}>
          <Plus size={18} /> {t('milk.addMilk')}
        </button>
      </header>

      <div className="page-content stagger-children">
        {/* Today Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#E3F2FD' }}>🥛</div>
            <div className="stat-card-value">{formatLiter(todayMilk, lang)}</div>
            <div className="stat-card-label">{t('milk.todayProduction')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#E8F5E9' }}>💰</div>
            <div className="stat-card-value">{formatCurrency(todayRevenue)}</div>
            <div className="stat-card-label">{t('milk.totalRevenue')}</div>
          </div>
        </div>

        {/* Period Stats */}
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('milk.weeklyProduction')}</span>
            <span className="font-semibold">{formatLiter(last7, lang)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('milk.monthlyProduction')}</span>
            <span className="font-semibold">{formatLiter(monthlyMilk, lang)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('milk.avgProduction')}</span>
            <span className="font-semibold">{formatLiter(milkTrend.length > 0 ? (last7 / 7) : 0, lang)}{lang === 'bn' ? '/দিন' : '/day'}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('milk.pricePerLiter')}</span>
            <span className="font-semibold">{formatCurrency(milkPrice)}</span>
          </div>
        </div>

        {/* Producer Highlights */}
        {highest && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="card" style={{ borderLeft: '4px solid #43A047' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('milk.highestProducer')}</div>
              <div className="font-semibold">{lang === 'bn' ? highest.name : (highest.nameEn || highest.name)}</div>
              <div style={{ color: '#43A047', fontWeight: 600 }}>{highest.avgMilk} {lang === 'bn' ? 'লি./দিন' : 'L/day'}</div>
            </div>
            {lowest && lowest.id !== highest.id && (
              <div className="card" style={{ borderLeft: '4px solid #FF8F00' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('milk.lowestProducer')}</div>
                <div className="font-semibold">{lang === 'bn' ? lowest.name : (lowest.nameEn || lowest.name)}</div>
                <div style={{ color: '#FF8F00', fontWeight: 600 }}>{lowest.avgMilk} {lang === 'bn' ? 'লি./দিন' : 'L/day'}</div>
              </div>
            )}
          </div>
        )}

        {/* Daily Trend Chart */}
        <div className="section-header">
          <h3 className="section-title">{t('milk.dailyTrend')}</h3>
        </div>
        <div className="chart-container mb-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={milkTrend}>
              <defs>
                <linearGradient id="milkGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E88E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} L`, lang === 'bn' ? 'দুধ' : 'Milk']} contentStyle={{ borderRadius: 8 }} />
              <Area type="monotone" dataKey="total" stroke="#1E88E5" strokeWidth={2} fill="url(#milkGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cow Comparison Chart */}
        {cowComparison.length > 0 && (
          <>
            <div className="section-header">
              <h3 className="section-title">{t('milk.cowComparison')}</h3>
            </div>
            <div className="chart-container mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cowComparison.map(c => ({ name: lang === 'bn' ? c.name : (c.nameEn || c.name), avg: c.avgMilk }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} L`, lang === 'bn' ? 'গড় দুধ' : 'Avg Milk']} contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                    {cowComparison.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Empty state */}
        {milkRecords.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🥛</div>
            <div className="empty-state-title">{t('empty.noMilk')}</div>
            <div className="empty-state-desc">{t('empty.noMilkDesc')}</div>
            <button className="btn btn-primary" onClick={() => navigate('/milk/add')}>
              <Plus size={18} /> {t('milk.addMilk')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
