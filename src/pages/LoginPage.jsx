// KhamarCare — Login Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/useAuthStore.js';
import useToastStore from '../stores/useToastStore.js';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const showToast = useToastStore(s => s.show);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !pin) {
      showToast(t('validation.required'), 'error');
      return;
    }
    setLoading(true);
    const success = await login(phone, pin);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      showToast('ফোন নম্বর বা পিন ভুল হয়েছে', 'error');
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    const success = await useAuthStore.getState().registerWithDemo();
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
        <h1 className="auth-title">{t('auth.welcomeBack')}</h1>
        <p className="auth-subtitle">{t('auth.loginTitle')}</p>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', marginTop: '4px' }}>
          <button 
            type="button" 
            onClick={() => showToast(i18n.language === 'bn' ? 'অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন' : 'Please contact the administrator', 'info')}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            {i18n.language === 'bn' ? 'পিন ভুলে গেছেন?' : 'Forgot PIN?'}
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? t('common.loading') : t('auth.login')}
        </button>
      </form>

      <div className="auth-footer" style={{ paddingBottom: 0 }}>
        <p className="auth-footer-text">
          {t('auth.noAccount')}{' '}
          <button className="auth-footer-link" onClick={() => navigate('/register')}>
            {t('auth.register')}
          </button>
        </p>
      </div>

    </div>
  );
}
