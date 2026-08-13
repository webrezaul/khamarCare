// KhamarCare — Feed Inventory Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import { formatCurrency } from '../../utils/formatters.js';

export default function FeedInventoryPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { feedTypes, feedInventory } = useFarmStore();

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('feed.feedInventory')}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content stagger-children">
        {feedInventory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">{t('common.noData')}</div>
          </div>
        ) : (
          feedInventory.map(inv => {
            const ft = feedTypes.find(f => f.id === inv.feedTypeId);
            const isLow = inv.currentStock <= inv.minStock;
            return (
              <div key={inv.id} className="card mb-3" style={{ borderLeft: isLow ? '4px solid var(--color-danger)' : '4px solid var(--color-primary-300)' }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 24 }}>{ft?.icon || '📦'}</span>
                    <span className="font-semibold">{lang === 'bn' ? ft?.nameBn : ft?.name}</span>
                  </div>
                  {isLow && <span className="badge badge-danger">{t('feed.lowStock')}</span>}
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-secondary text-sm">{t('feed.currentStock')}</span>
                  <span className="font-medium">{inv.currentStock} {inv.unit}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-secondary text-sm">{t('feed.minStock')}</span>
                  <span className="font-medium">{inv.minStock} {inv.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm">{t('feed.purchasePrice')}</span>
                  <span className="font-medium">{formatCurrency(inv.purchasePrice)}/{inv.unit}</span>
                </div>
                {/* Stock level bar */}
                <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: 'var(--color-neutral-200)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (inv.currentStock / Math.max(inv.minStock * 3, 1)) * 100)}%`,
                    borderRadius: 3,
                    background: isLow ? 'var(--color-danger)' : 'var(--color-primary-500)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
