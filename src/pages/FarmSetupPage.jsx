// KhamarCare — Farm Setup Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/useAuthStore.js';
import useToastStore from '../stores/useToastStore.js';

export default function FarmSetupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setupFarm = useAuthStore(s => s.setupFarm);
  const showToast = useToastStore(s => s.show);
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [landArea, setLandArea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e) => {
    e.preventDefault();
    if (!farmName) {
      showToast(t('validation.required'), 'error');
      return;
    }
    setLoading(true);
    const success = await setupFarm({
      name: farmName,
      address,
      landArea: parseFloat(landArea) || 0,
      landUnit: 'bigha',
    });
    setLoading(false);
    if (success) {
      showToast(t('farmSetup.setupComplete'), 'success');
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-logo">🏡</div>
        <h1 className="auth-title">{t('farmSetup.title')}</h1>
      </div>

      <form className="auth-form" onSubmit={handleSetup}>
        <div className="form-group">
          <label className="form-label">{t('farmSetup.farmName')} *</label>
          <input
            type="text"
            className="form-input"
            placeholder="যেমনঃ আসমাউল হুসনা এগ্রো ফার্ম"
            value={farmName}
            onChange={e => setFarmName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('farmSetup.address')}</label>
          <input
            type="text"
            className="form-input"
            placeholder="গ্রাম, উপজেলা, জেলা"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('farmSetup.landArea')} ({t('common.bigha')})</label>
          <input
            type="number"
            className="form-input"
            placeholder="যেমনঃ 2"
            value={landArea}
            onChange={e => setLandArea(e.target.value)}
            inputMode="decimal"
            step="0.1"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={loading}
          style={{ marginTop: 16 }}
        >
          {loading ? t('common.loading') : t('common.save')}
        </button>
      </form>
    </div>
  );
}
