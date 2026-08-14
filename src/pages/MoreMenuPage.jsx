// KhamarCare — More Menu Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFarmStore from '../stores/useFarmStore.js';
import useAuthStore from '../stores/useAuthStore.js';

const menuItems = [
  { path: '/chat', icon: '🤖', labelKey: 'nav.aiAssistant', color: '#E8F5E9', titleBn: 'এআই ভেট' },
  { path: '/notifications', icon: '🔔', labelKey: 'nav.notifications', color: '#E3F2FD' },
  { path: '/settings', icon: '⚙️', labelKey: 'nav.farmSettings', color: '#F3E5F5' },
  { path: '/health', icon: '❤️', labelKey: 'nav.health', color: '#FFEBEE' },
  { path: null, icon: '🔬', labelKey: 'nav.breeding', color: '#E8F5E9', soon: true },
  { path: null, icon: '🐄', labelKey: 'nav.pregnancy', color: '#FFF3E0', soon: true },
  { path: null, icon: '🐮', labelKey: 'nav.calves', color: '#E3F2FD', soon: true },
  { path: '/sales/dashboard', icon: '💰', labelKey: 'nav.milkSales', color: '#E8F5E9', titleBn: 'দুধ বিক্রি' },
  { path: '/hardware/weight', icon: '⚖️', labelKey: 'nav.weight', color: '#E3F2FD', titleBn: 'ওজন স্কেল' },
  { path: '/feed/inventory', icon: '📦', labelKey: 'nav.inventory', color: '#FFF8E1' },
  { path: '/hardware/rfid', icon: '📡', labelKey: 'nav.rfid', color: '#E8F5E9', titleBn: 'আরএফআইডি' },
  { path: '/hardware/milking-import', icon: '🥛', labelKey: 'nav.importMilk', color: '#FFF3E0', titleBn: 'মেশিন মিল্কিং' },
  { path: '/sync', icon: '☁️', labelKey: 'nav.cloudSync', color: '#E1F5FE', titleBn: 'ক্লাউড সিঙ্ক' },
  { path: '/reports', icon: '📊', labelKey: 'nav.reports', color: '#E8EAF6' },
  { path: '/profile', icon: '👤', labelKey: 'common.profile', color: '#EFEBE9' },
];

export default function MoreMenuPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const unread = useFarmStore(s => s.notifications.filter(n => !n.isRead).length);

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header-title">{t('nav.more')}</div>
      </header>

      <div className="page-content">
        <div className="more-menu-grid stagger-children">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="more-menu-item"
              onClick={() => item.path && navigate(item.path)}
              style={{ opacity: item.soon ? 0.6 : 1, position: 'relative' }}
            >
              <div className="more-menu-item-icon" style={{ background: item.color }}>
                {item.icon}
              </div>
              <div className="more-menu-item-label">{item.titleBn || t(item.labelKey)}</div>
              {item.soon && (
                <span className="badge badge-neutral" style={{ position: 'absolute', top: 4, right: 4, fontSize: 8 }}>
                  শীঘ্রই
                </span>
              )}
              {item.labelKey === 'nav.notifications' && unread > 0 && (
                <span className="notification-badge" style={{ position: 'absolute', top: 8, right: 8 }}>{unread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div style={{ marginTop: '24px', padding: '0 16px' }}>
          <button 
            className="btn btn-secondary btn-full" 
            onClick={() => {
              useAuthStore.getState().logout();
              navigate('/login');
            }}
            style={{ color: 'var(--color-danger)', border: '1px solid #fca5a5', background: '#fef2f2' }}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>🚪</span> {t('common.logout') || 'Logout'}
          </button>
        </div>

        {/* App Info */}
        <div className="text-center mt-6" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
          <p>খামার কেয়ার — সংস্করণ 1.0.0</p>
          <p style={{ marginTop: 4 }}>আসমাউল হুসনা এগ্রো ফার্ম</p>
        </div>
      </div>
    </div>
  );
}
