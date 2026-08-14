import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/useAuthStore.js';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, farm, logout } = useAuthStore();
  const lang = i18n.language;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangeLanguage = () => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
    // Optionally save to local storage if not already handled by i18next
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <div className="page pb-24">
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="app-header-title">{t('common.profile') || (lang === 'bn' ? 'প্রোফাইল' : 'Profile')}</div>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="page-content" style={{ padding: '16px' }}>
        
        {/* User Info Card */}
        <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary-100)', 
            color: 'var(--color-primary-600)', fontSize: '32px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 16px'
          }}>
            👤
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            {lang === 'bn' ? user?.name : (user?.nameEn || user?.name)}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {user?.phone}
          </p>
        </div>

        {/* Farm Info Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏡 {lang === 'bn' ? 'খামারের তথ্য' : 'Farm Information'}
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{t('auth.name') || (lang === 'bn' ? 'খামারের নাম' : 'Farm Name')}</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{lang === 'bn' ? farm?.name : (farm?.nameEn || farm?.name)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{lang === 'bn' ? 'ঠিকানা' : 'Address'}</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{farm?.address || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{lang === 'bn' ? 'জমির পরিমাণ' : 'Land Area'}</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{farm?.landArea} {farm?.landUnit}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card" style={{ padding: '8px 0' }}>
          <button 
            className="menu-item" 
            onClick={handleChangeLanguage}
            style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
              🌐 <span>{lang === 'bn' ? 'ভাষা পরিবর্তন করুন (English)' : 'Change Language (বাংলা)'}</span>
            </div>
            <span style={{ color: 'var(--text-tertiary)' }}>→</span>
          </button>
          
          <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
          
          <button 
            className="menu-item" 
            onClick={() => alert(lang === 'bn' ? 'প্রোফাইল আপডেট ফিচার শীঘ্রই আসছে!' : 'Profile editing coming soon!')}
            style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
              ✏️ <span>{lang === 'bn' ? 'প্রোফাইল সম্পাদনা করুন' : 'Edit Profile'}</span>
            </div>
            <span style={{ color: 'var(--text-tertiary)' }}>→</span>
          </button>

          <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
          
          <button 
            className="menu-item" 
            onClick={handleLogout}
            style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
              🚪 <span>{t('common.logout') || (lang === 'bn' ? 'লগআউট' : 'Logout')}</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
