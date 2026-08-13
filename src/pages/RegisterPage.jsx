// KhamarCare — Register Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/useAuthStore.js';
import useToastStore from '../stores/useToastStore.js';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, registerWithDemo } = useAuthStore();
  const showToast = useToastStore(s => s.show);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone || !pin) {
      showToast(t('validation.required'), 'error');
      return;
    }
    if (pin.length !== 4) {
      showToast(t('validation.invalidPin'), 'error');
      return;
    }
    setLoading(true);
    const success = await register({ name, phone, pin });
    setLoading(false);
    if (success) {
      navigate('/farm-setup');
    } else {
      showToast(t('common.error'), 'error');
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    const success = await registerWithDemo();
    setLoading(false);
    if (success) {
      showToast('ডেমো ডাটা লোড হয়েছে! 🎉', 'success');
      navigate('/');
    } else {
      showToast(t('common.error'), 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-logo">🐄</div>
        <h1 className="auth-title">{t('auth.registerTitle')}</h1>
        <p className="auth-subtitle">খামার কেয়ার — আপনার খামার, আপনার হাতে</p>
      </div>

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">{t('auth.name')}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t('auth.enterName')}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('auth.phone')}</label>
          <input
            type="tel"
            className="form-input"
            placeholder={t('auth.enterPhone')}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            maxLength={11}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('auth.pin')}</label>
          <input
            type="password"
            className="form-input"
            placeholder={t('auth.enterPin')}
            value={pin}
            onChange={e => setPin(e.target.value)}
            maxLength={4}
            inputMode="numeric"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={loading}
        >
          {loading ? t('common.loading') : t('auth.createAccount')}
        </button>

        <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-tertiary)' }}>অথবা</div>

        <button
          type="button"
          className="btn btn-secondary btn-lg btn-full"
          onClick={handleDemo}
          disabled={loading}
        >
          🐄 {t('farmSetup.loadDemo')}
        </button>
        <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 8 }}>
          ১০টি গবাদি পশু, দুধ ও আর্থিক রেকর্ড সহ ডেমো ডাটা লোড হবে
        </p>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          {t('auth.haveAccount')}{' '}
          <button className="auth-footer-link" onClick={() => navigate('/login')}>
            {t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
}
