// KhamarCare — Notifications Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';
import useFarmStore from '../stores/useFarmStore.js';
import { formatDate } from '../utils/dateUtils.js';

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useFarmStore();

  const sortedNotifs = [...notifications].sort((a, b) => {
    // Unread first, then by date descending
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt || b.scheduledDate) - new Date(a.createdAt || a.scheduledDate);
  });

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('nav.notifications')}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content stagger-children">
        {sortedNotifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <div className="empty-state-title">{t('common.noData')}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedNotifs.map(n => (
              <div
                key={n.id}
                className={`card ${n.isRead ? 'card-flat' : 'card-elevated'}`}
                style={{
                  borderLeft: `4px solid ${
                    n.type === 'calving' ? 'var(--color-warning)' :
                    n.type === 'feed_stock' ? 'var(--color-danger)' :
                    'var(--color-primary-500)'
                  }`,
                  opacity: n.isRead ? 0.7 : 1,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 16
                }}
              >
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>
                  {n.type === 'calving' ? '🤰' : n.type === 'vaccination' ? '💉' : n.type === 'feed_stock' ? '⚠️' : '🔥'}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold" style={{ fontSize: 'var(--text-base)', marginBottom: 2 }}>
                    {lang === 'bn' ? n.title : (n.titleEn || n.title)}
                  </div>
                  <div className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 8, lineHeight: 1.4 }}>
                    {lang === 'bn' ? n.message : (n.messageEn || n.message)}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {formatDate(n.createdAt || n.scheduledDate)}
                  </div>
                </div>
                {!n.isRead && (
                  <button
                    className="btn btn-ghost btn-icon btn-icon-sm"
                    onClick={() => markNotificationRead(n.id)}
                    style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
