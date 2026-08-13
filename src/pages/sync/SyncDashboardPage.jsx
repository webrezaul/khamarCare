// KhamarCare — Sync Dashboard Page
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Cloud, CloudOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSyncStore, triggerSync } from '../../services/syncService.js';
import { formatDate } from '../../utils/dateUtils.js';

export default function SyncDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  
  const { isSyncing, lastSync, syncErrors } = useSyncStore();

  // Determine connection status (simplified check)
  const isOnline = navigator.onLine;

  const handleManualSync = () => {
    if (isOnline) {
      triggerSync();
    }
  };

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'ক্লাউড সিঙ্ক' : 'Cloud Sync'}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content stagger-children">
        
        {/* Status Card */}
        <div className="card mb-4 text-center" style={{ background: isOnline ? '#E8F5E9' : '#FFEBEE' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', 
              background: isOnline ? 'var(--color-success)' : 'var(--color-danger)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: isSyncing ? 'pulse 1.5s infinite' : 'none'
            }}>
              {isOnline ? <Cloud size={40} /> : <CloudOff size={40} />}
            </div>
          </div>
          
          <h2 className="font-bold text-xl mb-1">
            {isOnline 
              ? (lang === 'bn' ? 'অনলাইন (Supabase)' : 'Online (Supabase)') 
              : (lang === 'bn' ? 'অফলাইন' : 'Offline')}
          </h2>
          
          <p className="text-secondary text-sm mb-4">
            {isOnline 
              ? (lang === 'bn' ? 'আপনার ডিভাইস ক্লাউডের সাথে সংযুক্ত আছে।' : 'Your device is connected to the cloud.')
              : (lang === 'bn' ? 'ইন্টারনেট সংযোগ নেই। ডাটা লোকালি সেভ হচ্ছে।' : 'No internet connection. Data is saved locally.')}
          </p>
          
          <div className="text-sm font-medium p-3 bg-white rounded border mb-4">
            <div className="text-secondary mb-1">{lang === 'bn' ? 'শেষ সিঙ্ক' : 'Last Synced'}</div>
            <div className="text-lg">{lastSync ? formatDate(lastSync) + ' ' + new Date(lastSync).toLocaleTimeString() : (lang === 'bn' ? 'কখনো সিঙ্ক হয়নি' : 'Never synced')}</div>
          </div>

          <button 
            className="btn btn-primary btn-full flex items-center justify-center gap-2" 
            onClick={handleManualSync} 
            disabled={!isOnline || isSyncing}
          >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? (lang === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (lang === 'bn' ? 'এখন সিঙ্ক করুন' : 'Sync Now')}
          </button>
        </div>

        {/* Sync Logs / Errors */}
        <div className="card">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            {syncErrors.length > 0 ? <AlertTriangle size={18} color="var(--color-danger)" /> : <CheckCircle size={18} color="var(--color-success)" />}
            {lang === 'bn' ? 'সিস্টেম স্ট্যাটাস' : 'System Status'}
          </h3>
          
          {syncErrors.length === 0 ? (
            <div className="text-sm text-secondary">
              {lang === 'bn' ? 'সব ডাটা সফলভাবে ক্লাউডের সাথে সিঙ্ক হয়েছে। কোনো এরর নেই।' : 'All local data is perfectly synced with the Supabase cloud. No errors reported.'}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {syncErrors.map((err, i) => (
                <div key={i} className="text-sm p-2 bg-red-50 text-red-900 rounded border border-red-200">
                  {err}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
