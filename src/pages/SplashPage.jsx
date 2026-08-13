// KhamarCare — Splash Screen
import React from 'react';
import { APP_NAME_BN } from '../config/constants.js';

export default function SplashPage() {
  return (
    <div className="splash-screen">
      <div className="splash-logo">🐄</div>
      <div className="splash-title">{APP_NAME_BN}</div>
      <div className="splash-subtitle">আপনার খামার, আপনার হাতে</div>
      <div style={{ marginTop: 32 }}>
        <div className="loading-spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  );
}
