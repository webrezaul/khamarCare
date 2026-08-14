import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Syringe, Save, User } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import { todayStr } from '../../utils/dateUtils.js';

export default function AddBreedingPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { farm } = useAuthStore();
  const { animals, addBreedingRecord } = useFarmStore();

  const femaleAnimals = animals.filter(a => a.animalType === 'cow' || a.animalType === 'heifer');

  const [formData, setFormData] = useState({
    animalId: femaleAnimals.length > 0 ? femaleAnimals[0].id : '',
    date: todayStr(),
    method: 'ai', // ai or natural
    bullId: '',
    technician: '',
    cost: '',
    notes: '',
    status: 'pending' // Initial status
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.animalId || !formData.date || !formData.method) {
      setError(lang === 'bn' ? 'দয়া করে সমস্ত প্রয়োজনীয় ফিল্ড পূরণ করুন' : 'Please fill all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const record = {
        farmId: farm.id,
        animalId: parseInt(formData.animalId),
        date: formData.date,
        method: formData.method,
        bullId: formData.bullId,
        technician: formData.technician,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        notes: formData.notes,
        status: formData.status
      };
      
      const result = await addBreedingRecord(record);
      
      if (result) {
        navigate('/breeding', { replace: true });
      } else {
        setError(lang === 'bn' ? 'রেকর্ড সংরক্ষণ করতে ব্যর্থ হয়েছে' : 'Failed to save record');
      }
    } catch (err) {
      setError(lang === 'bn' ? 'একটি ত্রুটি ঘটেছে' : 'An error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page pb-24">
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>←</button>
        <div className="app-header-title">{lang === 'bn' ? 'নতুন প্রজনন রেকর্ড' : 'Add Breeding Record'}</div>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="page-content" style={{ padding: '16px' }}>
        <form onSubmit={handleSubmit} className="card" style={{ padding: '20px' }}>
          
          {error && (
            <div style={{ padding: '12px', background: '#FFEBEE', color: '#C62828', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">{lang === 'bn' ? 'গাভী / বকনা নির্বাচন করুন *' : 'Select Cow / Heifer *'}</label>
            <select
              name="animalId"
              className="form-input"
              value={formData.animalId}
              onChange={handleChange}
              required
            >
              {femaleAnimals.map(a => (
                <option key={a.id} value={a.id}>
                  {a.earTag ? `${a.earTag} - ` : ''}{lang === 'bn' ? a.name : (a.nameEn || a.name)}
                </option>
              ))}
              {femaleAnimals.length === 0 && (
                <option value="" disabled>{lang === 'bn' ? 'কোনো যোগ্য গবাদি পশু নেই' : 'No eligible cattle available'}</option>
              )}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">{lang === 'bn' ? 'প্রজননের তারিখ *' : 'Breeding Date *'}</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="date"
                name="date"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">{lang === 'bn' ? 'পদ্ধতি *' : 'Method *'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, method: 'ai' })}
                style={{
                  padding: '12px', borderRadius: '8px', border: '1px solid',
                  borderColor: formData.method === 'ai' ? 'var(--color-primary-500)' : '#E5E7EB',
                  background: formData.method === 'ai' ? 'var(--color-primary-50)' : 'white',
                  color: formData.method === 'ai' ? 'var(--color-primary-700)' : '#374151',
                  fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Syringe size={18} /> AI ({lang === 'bn' ? 'কৃত্রিম' : 'Artificial'})
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, method: 'natural' })}
                style={{
                  padding: '12px', borderRadius: '8px', border: '1px solid',
                  borderColor: formData.method === 'natural' ? 'var(--color-primary-500)' : '#E5E7EB',
                  background: formData.method === 'natural' ? 'var(--color-primary-50)' : 'white',
                  color: formData.method === 'natural' ? 'var(--color-primary-700)' : '#374151',
                  fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                🐄 {lang === 'bn' ? 'প্রাকৃতিক' : 'Natural'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">{formData.method === 'ai' ? (lang === 'bn' ? 'বীজ আইডি / ষাঁড়ের জাত' : 'Semen ID / Bull Breed') : (lang === 'bn' ? 'ষাঁড়ের আইডি/নাম' : 'Bull ID/Name')}</label>
            <input
              type="text"
              name="bullId"
              className="form-input"
              placeholder={lang === 'bn' ? 'যেমন: 100% Holstein' : 'e.g., 100% Holstein'}
              value={formData.bullId}
              onChange={handleChange}
            />
          </div>

          {formData.method === 'ai' && (
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">{lang === 'bn' ? 'কর্মকর্তা / টেকনিশিয়ান' : 'Technician'}</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  name="technician"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder={lang === 'bn' ? 'কর্মকর্তার নাম' : 'Technician name'}
                  value={formData.technician}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">{lang === 'bn' ? 'খরচ (৳)' : 'Cost (৳)'}</label>
            <input
              type="number"
              name="cost"
              className="form-input"
              placeholder="0"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="any"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={isSubmitting || femaleAnimals.length === 0}
          >
            <Save size={20} />
            {isSubmitting ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (lang === 'bn' ? 'রেকর্ড সংরক্ষণ করুন' : 'Save Record')}
          </button>
        </form>
      </div>
    </div>
  );
}
