// KhamarCare — Onboarding Page (3 slides)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const slides = [
  { icon: '🐄', titleKey: 'onboarding.slide1Title', descKey: 'onboarding.slide1Desc' },
  { icon: '🥛', titleKey: 'onboarding.slide2Title', descKey: 'onboarding.slide2Desc' },
  { icon: '📊', titleKey: 'onboarding.slide3Title', descKey: 'onboarding.slide3Desc' },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const goNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="onboarding">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="onboarding-slide animate-fade-in" key={current}>
          <div className="onboarding-icon">{slides[current].icon}</div>
          <div className="onboarding-title">{t(slides[current].titleKey)}</div>
          <div className="onboarding-desc">{t(slides[current].descKey)}</div>
        </div>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === current ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="onboarding-footer">
        <button className="btn btn-primary btn-lg btn-full" onClick={goNext}>
          {current === slides.length - 1 ? t('onboarding.getStarted') : t('common.next')}
        </button>
        {current < slides.length - 1 && (
          <button className="btn btn-ghost btn-full" onClick={() => navigate('/register')}>
            {t('onboarding.skip')}
          </button>
        )}
        <button 
          className="btn btn-ghost btn-full" 
          onClick={() => navigate('/manual')}
          style={{ marginTop: '8px', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          📖 {i18n.language === 'bn' ? 'ব্যবহার নির্দেশিকা পড়ুন' : 'Read User Manual'}
        </button>
      </div>
    </div>
  );
}
