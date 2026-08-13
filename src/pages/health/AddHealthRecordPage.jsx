// KhamarCare — Add Vaccination Record Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useHealthStore from '../../stores/useHealthStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { todayStr } from '../../utils/dateUtils.js';

export default function AddHealthRecordPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const { animals } = useFarmStore();
  const { addVaccination } = useHealthStore();
  const showToast = useToastStore(s => s.show);

  const [date, setDate] = useState(todayStr());
  const [animalId, setAnimalId] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const VACCINES = [
    { id: 'FMD', nameBn: 'খুরা রোগ (FMD)', nameEn: 'FMD (Foot & Mouth)' },
    { id: 'Anthrax', nameBn: 'তড়কা (Anthrax)', nameEn: 'Anthrax' },
    { id: 'BQ', nameBn: 'বাদলা (Black Quarter)', nameEn: 'Black Quarter' },
    { id: 'HS', nameBn: 'গলাফুলা (HS)', nameEn: 'HS' }
  ];

  const handleSave = async () => {
    if (!animalId || !vaccineName || !nextDueDate) {
      showToast(t('common.error'), 'error');
      return;
    }
    setLoading(true);

    try {
      await addVaccination({
        farmId: farm.id,
        animalId: Number(animalId),
        vaccineName,
        date,
        nextDueDate,
        status: 'completed'
      });
      showToast(lang === 'bn' ? 'টিকা রেকর্ড করা হয়েছে' : 'Vaccine recorded', 'success');
      navigate(-1);
    } catch (e) {
      showToast(t('common.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <span className="app-header-title">{lang === 'bn' ? 'নতুন টিকা' : 'New Vaccine'}</span>
        <div style={{ width: 36 }} />
      </header>
      
      <div className="page-content">
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

        <div className="form-group">
          <label className="form-label">{lang === 'bn' ? 'টিকার নাম' : 'Vaccine Name'}</label>
          <select className="form-select" value={vaccineName} onChange={e => setVaccineName(e.target.value)}>
            <option value="">{t('common.select')}</option>
            {VACCINES.map(v => (
              <option key={v.id} value={v.id}>
                {lang === 'bn' ? v.nameBn : v.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{lang === 'bn' ? 'টিকা দেওয়ার তারিখ' : 'Date Administered'}</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">{lang === 'bn' ? 'পরবর্তী টিকার তারিখ' : 'Next Due Date'}</label>
          <input type="date" className="form-input" value={nextDueDate} onChange={e => setNextDueDate(e.target.value)} />
        </div>

        <button className="btn btn-primary btn-lg btn-full mt-4" onClick={handleSave} disabled={loading}>
          {loading ? t('common.loading') : `${t('common.save')} ✅`}
        </button>
      </div>
    </div>
  );
}
