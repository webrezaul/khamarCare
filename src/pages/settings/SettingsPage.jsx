// KhamarCare — Settings Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Upload, Trash2, Globe } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import db from '../../db/database.js';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { farm, clearAllData } = useAuthStore();
  const { settings, updateSetting } = useFarmStore();
  const showToast = useToastStore(s => s.show);

  const [milkPrice, setMilkPrice] = useState(settings.milkPricePerLiter || '50');
  const [gestationDays, setGestationDays] = useState(settings.gestationPeriodDays || '283');
  const [heatCycleDays, setHeatCycleDays] = useState(settings.heatCycleDays || '21');
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');

  const handleSave = async () => {
    if (farm) {
      await updateSetting(farm.id, 'milkPricePerLiter', milkPrice);
      await updateSetting(farm.id, 'gestationPeriodDays', gestationDays);
      await updateSetting(farm.id, 'heatCycleDays', heatCycleDays);
      await updateSetting(farm.id, 'geminiApiKey', geminiApiKey);
    }
    showToast(t('settings.saved'), 'success');
  };

  const handleExport = async () => {
    try {
      const data = {};
      const tables = ['users', 'farms', 'animals', 'milk_records', 'feed_types', 'feed_inventory', 'feed_consumption', 'income_records', 'expense_records', 'settings', 'pregnancy_records', 'notifications', 'land_records'];
      for (const table of tables) {
        data[table] = await db[table].toArray();
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `khamarcare-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(lang === 'bn' ? 'ডাটা এক্সপোর্ট হয়েছে!' : 'Data exported!', 'success');
    } catch (err) {
      showToast(t('common.error'), 'error');
    }
  };

  const handleClear = () => {
    if (window.confirm(t('settings.clearConfirm'))) {
      clearAllData();
    }
  };

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('settings.title')}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content">
        {/* Language */}
        <div className="card mb-4">
          <h3 className="card-title mb-3"><Globe size={18} style={{ display: 'inline', marginRight: 8 }} />{t('common.language')}</h3>
          <div className="tab-bar">
            <button className={`tab-item ${lang === 'bn' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('bn')}>
              🇧🇩 বাংলা
            </button>
            <button className={`tab-item ${lang === 'en' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('en')}>
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Farm Settings */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? '🐄 খামার সেটিংস' : '🐄 Farm Settings'}</h3>
          <div className="form-group">
            <label className="form-label">{t('settings.milkPrice')} (৳)</label>
            <input type="number" className="form-input" value={milkPrice} onChange={e => setMilkPrice(e.target.value)} inputMode="numeric" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.gestationPeriod')}</label>
            <input type="number" className="form-input" value={gestationDays} onChange={e => setGestationDays(e.target.value)} inputMode="numeric" />
            <span className="form-hint">{lang === 'bn' ? 'সাধারণত ২৮০-২৮৫ দিন' : 'Typically 280-285 days'}</span>
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.heatCycle')}</label>
            <input type="number" className="form-input" value={heatCycleDays} onChange={e => setHeatCycleDays(e.target.value)} inputMode="numeric" />
            <span className="form-hint">{lang === 'bn' ? 'সাধারণত ১৮-২৪ দিন' : 'Typically 18-24 days'}</span>
          </div>
          <div className="form-group">
            <label className="form-label">🤖 Gemini API Key</label>
            <input type="password" className="form-input" value={geminiApiKey} onChange={e => setGeminiApiKey(e.target.value)} placeholder="AI1zaSy..." />
            <span className="form-hint">{lang === 'bn' ? 'এআই ভেট অ্যাসিস্ট্যান্টের জন্য (স্থানীয়ভাবে সংরক্ষিত)' : 'For AI Vet Assistant (Stored locally)'}</span>
          </div>
          <button className="btn btn-primary btn-full" onClick={handleSave}>
            {t('common.save')}
          </button>
        </div>

        {/* Data Management */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{t('settings.dataManagement')}</h3>
          <button className="btn btn-secondary btn-full mb-3" onClick={handleExport}>
            <Download size={18} /> {t('settings.exportData')} (JSON)
          </button>
          <button className="btn btn-danger btn-full" onClick={handleClear} style={{ opacity: 0.8 }}>
            <Trash2 size={18} /> {t('settings.clearData')}
          </button>
        </div>

        {/* About */}
        <div className="card">
          <h3 className="card-title mb-3">{t('settings.about')}</h3>
          <p className="text-secondary mb-1">খামার কেয়ার (KhamarCare) v1.0.0</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {lang === 'bn'
              ? 'বাংলাদেশী কৃষকদের জন্য তৈরি ডেইরি ফার্ম ম্যানেজমেন্ট অ্যাপ।'
              : 'Dairy Farm Management App designed for Bangladeshi farmers.'}
          </p>
        </div>
      </div>
    </div>
  );
}
