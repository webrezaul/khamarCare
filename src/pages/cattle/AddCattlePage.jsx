// KhamarCare — Add/Edit Cattle Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { BREEDS, ANIMAL_TYPE_LABELS, ANIMAL_STATUS_LABELS } from '../../config/constants.js';

export default function AddCattlePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const addAnimal = useFarmStore(s => s.addAnimal);
  const animals = useFarmStore(s => s.animals);
  const showToast = useToastStore(s => s.show);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    earTag: '', name: '', nameEn: '', gender: 'female', animalType: 'cow',
    breedId: 'local', dob: '', birthWeight: '', currentWeight: '',
    status: 'open', lactationNumber: '0', purchaseDate: '', purchasePrice: '',
    currentValue: '', source: 'farm_born', motherId: '', fatherId: '', notes: '',
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.earTag || !form.name) {
      showToast(t('validation.required'), 'error');
      return;
    }
    if (form.dob && new Date(form.dob) > new Date()) {
      showToast(t('validation.futureDob'), 'error');
      return;
    }
    setLoading(true);
    const result = await addAnimal({
      farmId: farm.id,
      ...form,
      birthWeight: parseFloat(form.birthWeight) || 0,
      currentWeight: parseFloat(form.currentWeight) || 0,
      purchasePrice: parseFloat(form.purchasePrice) || 0,
      currentValue: parseFloat(form.currentValue) || 0,
      lactationNumber: parseInt(form.lactationNumber) || 0,
    });
    setLoading(false);
    if (result) {
      showToast(lang === 'bn' ? 'গবাদি পশু যোগ হয়েছে! ✅' : 'Cattle added! ✅', 'success');
      navigate('/cattle');
    }
  };

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('cattle.addCattle')}</span>
        <div style={{ width: 36 }} />
      </header>

      <form className="page-content" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? 'মৌলিক তথ্য' : 'Basic Info'}</h3>
          <div className="form-group">
            <label className="form-label">{t('cattle.earTag')} *</label>
            <input className="form-input" placeholder="C011" value={form.earTag} onChange={e => update('earTag', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.name')} ({lang === 'bn' ? 'বাংলা' : 'Bangla'}) *</label>
            <input className="form-input" placeholder="নাম দিন" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.name')} (English)</label>
            <input className="form-input" placeholder="English name" value={form.nameEn} onChange={e => update('nameEn', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">{t('cattle.gender')}</label>
              <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="female">{t('cattle.female')}</option>
                <option value="male">{t('cattle.male')}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('cattle.animalType')}</label>
              <select className="form-select" value={form.animalType} onChange={e => update('animalType', e.target.value)}>
                {Object.entries(ANIMAL_TYPE_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>{lang === 'bn' ? val.bn : val.en}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.breed')}</label>
            <select className="form-select" value={form.breedId} onChange={e => update('breedId', e.target.value)}>
              {BREEDS.map(b => (
                <option key={b.id} value={b.id}>{lang === 'bn' ? b.nameBn : b.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.dob')}</label>
            <input type="date" className="form-input" value={form.dob} onChange={e => update('dob', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.status')}</label>
            <select className="form-select" value={form.status} onChange={e => update('status', e.target.value)}>
              {Object.entries(ANIMAL_STATUS_LABELS).map(([key, val]) => (
                <option key={key} value={key}>{lang === 'bn' ? val.bn : val.en}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight & Value */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? 'ওজন ও মূল্য' : 'Weight & Value'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">{t('cattle.birthWeight')} ({t('common.kg')})</label>
              <input type="number" className="form-input" inputMode="decimal" value={form.birthWeight} onChange={e => update('birthWeight', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('cattle.currentWeight')} ({t('common.kg')})</label>
              <input type="number" className="form-input" inputMode="decimal" value={form.currentWeight} onChange={e => update('currentWeight', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">{t('cattle.purchasePrice')} (৳)</label>
              <input type="number" className="form-input" inputMode="numeric" value={form.purchasePrice} onChange={e => update('purchasePrice', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('cattle.currentValue')} (৳)</label>
              <input type="number" className="form-input" inputMode="numeric" value={form.currentValue} onChange={e => update('currentValue', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.source')}</label>
            <select className="form-select" value={form.source} onChange={e => update('source', e.target.value)}>
              <option value="farm_born">{t('cattle.farmBorn')}</option>
              <option value="market">{t('cattle.market')}</option>
              <option value="gift">{t('cattle.gift')}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.purchaseDate')}</label>
            <input type="date" className="form-input" value={form.purchaseDate} onChange={e => update('purchaseDate', e.target.value)} />
          </div>
        </div>

        {/* Parentage */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? 'বংশ পরিচয়' : 'Parentage'}</h3>
          <div className="form-group">
            <label className="form-label">{t('cattle.mother')}</label>
            <select className="form-select" value={form.motherId} onChange={e => update('motherId', e.target.value)}>
              <option value="">{lang === 'bn' ? 'নির্বাচন করুন' : 'Select'}</option>
              {animals.filter(a => a.gender === 'female').map(a => (
                <option key={a.id} value={a.id}>{a.earTag} — {lang === 'bn' ? a.name : (a.nameEn || a.name)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.father')}</label>
            <select className="form-select" value={form.fatherId} onChange={e => update('fatherId', e.target.value)}>
              <option value="">{lang === 'bn' ? 'নির্বাচন করুন' : 'Select'}</option>
              {animals.filter(a => a.gender === 'male').map(a => (
                <option key={a.id} value={a.id}>{a.earTag} — {lang === 'bn' ? a.name : (a.nameEn || a.name)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('cattle.lactationNumber')}</label>
            <input type="number" className="form-input" inputMode="numeric" value={form.lactationNumber} onChange={e => update('lactationNumber', e.target.value)} />
          </div>
        </div>

        {/* Notes */}
        <div className="card mb-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('common.notes')}</label>
            <textarea className="form-input form-textarea" rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder={lang === 'bn' ? 'অতিরিক্ত তথ্য...' : 'Additional notes...'} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
          {loading ? t('common.loading') : t('common.save')}
        </button>
      </form>
    </div>
  );
}
