// KhamarCare — Weight Tracker Page (Bluetooth)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Bluetooth, BluetoothConnected, Save } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { connectToBluetoothScale } from '../../services/bluetoothService.js';
import { todayStr } from '../../utils/dateUtils.js';
import db from '../../db/database.js';

export default function WeightTrackerPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const { animals } = useFarmStore();
  const showToast = useToastStore(s => s.show);

  const [device, setDevice] = useState(null);
  const [liveWeight, setLiveWeight] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [animalId, setAnimalId] = useState('');
  const [date, setDate] = useState(todayStr());
  const [saving, setSaving] = useState(false);

  // Simulation mode since Web Bluetooth requires HTTPS and physical hardware
  const [simMode, setSimMode] = useState(false);

  useEffect(() => {
    let interval;
    if (simMode) {
      // Simulate fluctuating scale weight
      interval = setInterval(() => {
        setLiveWeight(prev => {
          const target = 450; // 450kg cow
          const variance = (Math.random() - 0.5) * 5;
          return Number((target + variance).toFixed(1));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simMode]);

  const handleConnect = async () => {
    if (!navigator.bluetooth) {
      showToast(lang === 'bn' ? 'আপনার ব্রাউজার ব্লুটুথ সাপোর্ট করে না' : 'Web Bluetooth not supported on this browser', 'error');
      setSimMode(true); // Fallback to simulation
      return;
    }

    setIsConnecting(true);
    try {
      const { device } = await connectToBluetoothScale(
        (weight) => setLiveWeight(weight),
        () => {
          showToast(lang === 'bn' ? 'স্কেল ডিসকানেক্ট হয়েছে' : 'Scale disconnected', 'error');
          setDevice(null);
        }
      );
      setDevice(device);
      showToast(lang === 'bn' ? 'স্কেল সংযুক্ত হয়েছে' : 'Scale connected!', 'success');
    } catch (e) {
      showToast(lang === 'bn' ? 'সংযুক্ত হতে ব্যর্থ' : 'Connection failed', 'error');
      setSimMode(true); // Fallback to sim for demo purposes
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    }
    setDevice(null);
    setSimMode(false);
    setLiveWeight(0);
  };

  const handleSave = async () => {
    if (!animalId || liveWeight <= 0) {
      showToast(t('common.error'), 'error');
      return;
    }

    setSaving(true);
    try {
      await db.weight_records.add({
        farmId: farm.id,
        animalId: Number(animalId),
        date,
        weight: liveWeight
      });
      showToast(lang === 'bn' ? 'ওজন সংরক্ষণ করা হয়েছে' : 'Weight saved successfully', 'success');
      setAnimalId('');
    } catch (e) {
      console.error(e);
      showToast(t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const isConnected = device || simMode;

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'ওজন স্কেল (ব্লুটুথ)' : 'Weight Scale (BLE)'}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content">
        {/* Bluetooth Connection Card */}
        <div className="card mb-4 text-center" style={{ background: isConnected ? '#E8F5E9' : 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            {isConnected ? (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BluetoothConnected size={40} />
              </div>
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-background)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bluetooth size={40} />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-bold mb-2">
            {isConnected 
              ? (simMode ? (lang === 'bn' ? 'সিমুলেশন মোড সক্রিয়' : 'Simulation Mode Active') : (device?.name || 'Scale Connected')) 
              : (lang === 'bn' ? 'ডিজিটাল স্কেলের সাথে সংযোগ করুন' : 'Connect to Digital Scale')}
          </h3>
          
          <p className="text-secondary text-sm mb-4">
            {lang === 'bn' 
              ? 'আপনার স্মার্টফোনের ব্লুটুথ চালু করুন এবং ডিজিটাল স্কেল অন করুন।' 
              : 'Turn on your smartphone Bluetooth and turn on the digital scale.'}
          </p>

          {!isConnected ? (
            <button className="btn btn-primary btn-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? t('common.loading') : (lang === 'bn' ? 'সংযোগ করুন' : 'Connect Device')}
            </button>
          ) : (
            <button className="btn btn-ghost text-danger btn-full" onClick={handleDisconnect}>
              {lang === 'bn' ? 'বিচ্ছিন্ন করুন' : 'Disconnect'}
            </button>
          )}
        </div>

        {/* Live Weight Display */}
        <div className="card mb-4" style={{ textAlign: 'center', padding: '32px 16px' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {lang === 'bn' ? 'বর্তমান ওজন' : 'Live Weight'}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: liveWeight > 0 ? 'var(--color-primary-600)' : 'var(--text-tertiary)', fontFamily: 'monospace', lineHeight: 1 }}>
            {liveWeight.toFixed(1)}
            <span style={{ fontSize: 24, marginLeft: 8 }}>kg</span>
          </div>
        </div>

        {/* Manual Record Form */}
        <div className="card">
          <h3 className="font-bold mb-4">{lang === 'bn' ? 'রেকর্ড সংরক্ষণ করুন' : 'Save Record'}</h3>
          
          <div className="form-group">
            <label className="form-label">{lang === 'bn' ? 'তারিখ' : 'Date'}</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">{t('feed.selectAnimal')}</label>
            <select className="form-select" value={animalId} onChange={e => setAnimalId(e.target.value)}>
              <option value="">{t('common.select')}</option>
              {animals.map(a => (
                <option key={a.id} value={a.id}>
                  {a.earTag} — {lang === 'bn' ? a.name : (a.nameEn || a.name)}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-primary btn-lg btn-full flex items-center justify-center gap-2" 
            onClick={handleSave} 
            disabled={saving || !animalId || liveWeight <= 0}
          >
            <Save size={20} />
            {saving ? t('common.loading') : (lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Weight')}
          </button>
        </div>
      </div>
    </div>
  );
}
