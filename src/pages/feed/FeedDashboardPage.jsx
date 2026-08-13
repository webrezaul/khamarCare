// KhamarCare — Feed Dashboard Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Package } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import { formatCurrency } from '../../utils/formatters.js';

export default function FeedDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { feedTypes, feedConsumption, feedInventory, getTodayFeedCost, getMonthlyFeedCost, getLowStockItems, animals, milkRecords, settings } = useFarmStore();

  const todayFeedCost = getTodayFeedCost();
  const monthlyFeedCost = getMonthlyFeedCost();
  const lowStock = getLowStockItems();
  const lactatingCount = animals.filter(a => a.status === 'lactating').length;
  const totalMilk = milkRecords.reduce((s, r) => s + (r.totalMilk || 0), 0);
  const costPerCow = lactatingCount > 0 ? monthlyFeedCost / lactatingCount : 0;
  const costPerLiter = totalMilk > 0 ? monthlyFeedCost / totalMilk : 0;

  // Feed breakdown by type
  const feedBreakdown = {};
  feedConsumption.forEach(fc => {
    const ft = feedTypes.find(f => f.id === fc.feedTypeId);
    const name = ft ? (lang === 'bn' ? ft.nameBn : ft.name) : 'Other';
    feedBreakdown[name] = (feedBreakdown[name] || 0) + (fc.cost || 0);
  });

  return (
    <div className="page">
      <header className="app-header">
        <div>
          <div className="app-header-title">{t('feed.title')}</div>
        </div>
        <div className="app-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/feed/inventory')}>
            <Package size={16} /> {t('feed.feedInventory')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/feed/add')}>
            <Plus size={18} />
          </button>
        </div>
      </header>

      <div className="page-content stagger-children">
        {/* Cost Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#FFF3E0' }}>🌾</div>
            <div className="stat-card-value">{formatCurrency(todayFeedCost)}</div>
            <div className="stat-card-label">{t('feed.dailyCost')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#FFF3E0' }}>📊</div>
            <div className="stat-card-value">{formatCurrency(monthlyFeedCost)}</div>
            <div className="stat-card-label">{t('feed.monthlyCost')}</div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('feed.costPerCow')}</span>
            <span className="font-semibold">{formatCurrency(costPerCow)}/{lang === 'bn' ? 'মাস' : 'month'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">{t('feed.costPerLiter')}</span>
            <span className="font-semibold">{formatCurrency(costPerLiter)}/{lang === 'bn' ? 'লিটার' : 'liter'}</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStock.length > 0 && (
          <section className="mb-4">
            <div className="section-header">
              <h3 className="section-title">⚠️ {t('feed.lowStock')}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {lowStock.map((item, i) => (
                <div key={i} className="alert-card alert-card-warning">
                  <div className="alert-card-icon">{item.feedType?.icon || '📦'}</div>
                  <div className="alert-card-content">
                    <div className="alert-card-title">
                      {lang === 'bn' ? item.feedType?.nameBn : item.feedType?.name}
                    </div>
                    <div className="alert-card-message">
                      {lang === 'bn' ? 'বর্তমান স্টক' : 'Current stock'}: {item.currentStock} {item.unit} | {lang === 'bn' ? 'ন্যূনতম' : 'Min'}: {item.minStock} {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Feed Breakdown */}
        {Object.keys(feedBreakdown).length > 0 && (
          <section className="mb-4">
            <div className="section-header">
              <h3 className="section-title">{lang === 'bn' ? 'খাদ্য ভাঙ্গন' : 'Feed Breakdown'}</h3>
            </div>
            <div className="card">
              {Object.entries(feedBreakdown).sort((a, b) => b[1] - a[1]).map(([name, cost]) => (
                <div key={name} className="flex justify-between items-center mb-2">
                  <span className="text-secondary">{name}</span>
                  <span className="font-medium">{formatCurrency(cost)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Feed Calculator Disclaimer */}
        <div className="disclaimer mb-4">
          <span className="disclaimer-icon">⚠️</span>
          <span>{t('feed.calcDisclaimer')}</span>
        </div>

        {feedConsumption.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🌾</div>
            <div className="empty-state-title">{t('empty.noFeed')}</div>
            <div className="empty-state-desc">{t('empty.noFeedDesc')}</div>
            <button className="btn btn-primary" onClick={() => navigate('/feed/add')}>
              <Plus size={18} /> {t('feed.addFeed')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
