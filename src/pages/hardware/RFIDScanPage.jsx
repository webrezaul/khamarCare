// KhamarCare — RFID Rapid Scan Mode
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ScanLine, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import { formatDate } from '../../utils/dateUtils.js';

export default function RFIDScanPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { animals, getAlerts, milkRecords } = useFarmStore();

  const [scanBuffer, setScanBuffer] = useState('');
  const [scannedAnimal, setScannedAnimal] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const containerRef = useRef(null);

  // Global keyboard listener for HID scanners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input field (though we don't have any here)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        processScan(scanBuffer);
        setScanBuffer('');
      } else if (e.key.length === 1) {
        setScanBuffer(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scanBuffer]);

  const processScan = (tagId) => {
    const cleanTag = tagId.trim();
    if (!cleanTag) return;

    // In a real scenario, this matches a hidden `rfidTag` field.
    // For MVP, we will try to match `earTag` exactly.
    const animal = animals.find(a => 
      a.earTag.toLowerCase() === cleanTag.toLowerCase() || 
      (a.rfid && a.rfid.toLowerCase() === cleanTag.toLowerCase())
    );

    if (animal) {
      setScannedAnimal(animal);
      setErrorMsg('');
    } else {
      setScannedAnimal(null);
      setErrorMsg(lang === 'bn' ? `ট্যাগ "${cleanTag}" পাওয়া যায়নি!` : `Tag "${cleanTag}" not found!`);
      // Clear error after 3 seconds
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // Get data for scanned animal
  const getAnimalData = (animal) => {
    if (!animal) return null;
    const alerts = getAlerts().filter(a => a.animalId === animal.id);
    const milk = milkRecords.filter(m => m.animalId === animal.id);
    const avgMilk = milk.length > 0 ? (milk.reduce((s, m) => s + m.totalMilk, 0) / milk.length).toFixed(1) : 0;
    
    return { alerts, avgMilk, totalMilkRecords: milk.length };
  };

  const animalData = getAnimalData(scannedAnimal);

  return (
    <div className="page" ref={containerRef} style={{ background: 'var(--bg-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header" style={{ background: 'var(--color-primary-600)', color: 'white' }}>
        <button className="btn btn-ghost btn-icon btn-icon-sm" style={{ color: 'white' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'আরএফআইডি স্ক্যান (RFID)' : 'RFID Scan Mode'}</span>
        <div style={{ width: 36 }} />
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: scannedAnimal ? 'flex-start' : 'center', padding: 24 }}>
        
        {!scannedAnimal && !errorMsg && (
          <div className="text-center animate-pulse" style={{ color: 'var(--color-primary-400)' }}>
            <ScanLine size={120} style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
              {lang === 'bn' ? 'স্ক্যান করার জন্য প্রস্তুত...' : 'Ready to Scan...'}
            </h2>
            <p className="text-secondary mt-2">
              {lang === 'bn' ? 'আরএফআইডি স্ক্যানার ব্যবহার করে গরুর ট্যাগ স্ক্যান করুন।' : 'Scan a cow tag using your RFID reader.'}
            </p>
            
            {/* Developer help for MVP */}
            <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-left border">
              <strong>Dev Tip:</strong> Just type an Ear Tag (e.g. C001) anywhere on your keyboard and press Enter to simulate a scanner!
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="text-center animate-bounce-in" style={{ color: 'var(--color-danger)' }}>
            <XCircle size={100} style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>{errorMsg}</h2>
          </div>
        )}

        {scannedAnimal && (
          <div className="w-full max-w-md animate-fade-in-up">
            <div className="card mb-4 text-center relative overflow-hidden">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'var(--color-primary-100)', zIndex: 0 }} />
              
              <div style={{ position: 'relative', zIndex: 1, paddingTop: 20 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'white', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '4px solid white', fontSize: 48 }}>
                  {scannedAnimal.gender === 'female' ? '🐮' : '🐂'}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{scannedAnimal.earTag}</h2>
                <h3 style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 16 }}>{lang === 'bn' ? scannedAnimal.name : (scannedAnimal.nameEn || scannedAnimal.name)}</h3>
                
                <div className="flex justify-center gap-2 mb-4">
                  <span className={`badge ${scannedAnimal.status === 'lactating' ? 'badge-primary' : 'badge-neutral'}`}>
                    {t(`cattle.statusOptions.${scannedAnimal.status}`)}
                  </span>
                  <span className="badge badge-neutral">
                    {scannedAnimal.breed}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="card text-center py-4">
                <div className="text-secondary text-xs font-bold uppercase mb-1">{lang === 'bn' ? 'গড় দুধ' : 'Avg Milk'}</div>
                <div className="text-2xl font-bold text-primary">{animalData.avgMilk} <span className="text-sm font-normal">L</span></div>
              </div>
              <div className="card text-center py-4">
                <div className="text-secondary text-xs font-bold uppercase mb-1">{lang === 'bn' ? 'শেষ হিট' : 'Last Heat'}</div>
                <div className="font-bold">{scannedAnimal.lastHeatDate ? formatDate(scannedAnimal.lastHeatDate) : '-'}</div>
              </div>
            </div>

            {animalData.alerts.length > 0 && (
              <div className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} color="var(--color-danger)" /> 
                  {lang === 'bn' ? 'সতর্কতা' : 'Alerts'}
                </h3>
                <div className="flex flex-col gap-2">
                  {animalData.alerts.map((alert, i) => (
                    <div key={i} className="text-sm p-2 bg-red-50 text-red-900 rounded">
                      <strong>{lang === 'bn' ? alert.titleBn : alert.titleEn}</strong><br/>
                      {lang === 'bn' ? alert.messageBn : alert.messageEn}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button className="btn btn-outline btn-full mt-6" onClick={() => setScannedAnimal(null)}>
              {lang === 'bn' ? 'নতুন স্ক্যান করুন' : 'Scan Another'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
