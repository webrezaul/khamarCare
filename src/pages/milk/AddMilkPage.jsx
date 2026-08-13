// KhamarCare — Quick Add Milk Page (< 10 second workflow)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { todayStr } from '../../utils/dateUtils.js';
import { formatCurrency, getAnimalIcon } from '../../utils/formatters.js';

export default function AddMilkPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const animals = useFarmStore(s => s.animals);
  const settings = useFarmStore(s => s.settings);
  const addMilkRecord = useFarmStore(s => s.addMilkRecord);
  const addIncome = useFarmStore(s => s.addIncome);
  const showToast = useToastStore(s => s.show);

  const lactatingCows = animals.filter(a => a.status === 'lactating');
  const milkPrice = Number(settings.milkPricePerLiter) || 50;

  const [date, setDate] = useState(todayStr());
  const [selectedCow, setSelectedCow] = useState(lactatingCows[0]?.id || null);
  const [morning, setMorning] = useState('');
  const [evening, setEvening] = useState('');
  const [loading, setLoading] = useState(false);

  const totalMilk = (parseFloat(morning) || 0) + (parseFloat(evening) || 0);
  const totalRevenue = totalMilk * milkPrice;

  const handleSave = async () => {
    if (!selectedCow) {
      showToast(t('validation.selectAnimal'), 'error');
      return;
    }
    if (totalMilk <= 0) {
      showToast(t('validation.negativeMilk'), 'error');
      return;
    }
    setLoading(true);

    // Save milk record
    await addMilkRecord({
      farmId: farm.id,
      animalId: selectedCow,
      date,
      morningMilk: parseFloat(morning) || 0,
      eveningMilk: parseFloat(evening) || 0,
      totalMilk: +totalMilk.toFixed(1),
      pricePerLiter: milkPrice,
      totalRevenue: +totalRevenue.toFixed(0),
    });

    // Auto-add milk income
    const cow = animals.find(a => a.id === selectedCow);
    const cowName = lang === 'bn' ? cow?.name : (cow?.nameEn || cow?.name);
    await addIncome({
      farmId: farm.id,
      date,
      category: 'milk_sales',
      amount: +totalRevenue.toFixed(0),
      description: `${cowName} — ${totalMilk.toFixed(1)} ${lang === 'bn' ? 'লিটার' : 'L'}`,
      relatedAnimalId: selectedCow,
    });

    setLoading(false);
    showToast(t('milk.milkRecorded'), 'success');
    navigate('/milk');
  };

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('milk.addMilk')}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content">
        {/* Date */}
        <div className="form-group">
          <label className="form-label">{t('common.date')}</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        {/* Select Cow — Large tappable cards */}
        <div className="form-group">
          <label className="form-label">{t('milk.selectCow')}</label>
          {lactatingCows.length === 0 ? (
            <div className="card text-center p-4">
              <p className="text-secondary">{t('milk.noLactatingCows')}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {lactatingCows.map(cow => (
                <button
                  key={cow.id}
                  type="button"
                  className={`card card-clickable ${selectedCow === cow.id ? '' : 'card-flat'}`}
                  style={{
                    textAlign: 'center',
                    padding: 16,
                    border: selectedCow === cow.id ? '2px solid var(--color-primary-500)' : '2px solid var(--border-color)',
                    background: selectedCow === cow.id ? 'var(--color-primary-50)' : 'var(--bg-surface)',
                  }}
                  onClick={() => setSelectedCow(cow.id)}
                >
                  <div style={{ fontSize: 36 }}>{getAnimalIcon(cow.animalType)}</div>
                  <div className="font-semibold mt-1">{lang === 'bn' ? cow.name : (cow.nameEn || cow.name)}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{cow.earTag}</div>
                  {selectedCow === cow.id && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--color-primary-500)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Milk Entry — Large inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">🌅 {t('milk.morningMilk')} ({t('common.liter')})</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.0"
              value={morning}
              onChange={e => setMorning(e.target.value)}
              inputMode="decimal"
              step="0.1"
              min="0"
              style={{ fontSize: 'var(--text-2xl)', textAlign: 'center', fontWeight: 'var(--font-bold)' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">🌆 {t('milk.eveningMilk')} ({t('common.liter')})</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.0"
              value={evening}
              onChange={e => setEvening(e.target.value)}
              inputMode="decimal"
              step="0.1"
              min="0"
              style={{ fontSize: 'var(--text-2xl)', textAlign: 'center', fontWeight: 'var(--font-bold)' }}
            />
          </div>
        </div>

        {/* Summary Card */}
        <div className="card mb-4" style={{ background: totalMilk > 0 ? 'var(--color-primary-50)' : 'var(--bg-surface)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('milk.totalMilk')}</span>
            <span className="font-bold" style={{ fontSize: 'var(--text-xl)' }}>{totalMilk.toFixed(1)} {t('common.liter')}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('milk.pricePerLiter')}</span>
            <span className="font-medium">{formatCurrency(milkPrice)}</span>
          </div>
          <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8 }}>
            <span className="font-semibold">{t('milk.totalRevenue')}</span>
            <span className="font-bold text-success" style={{ fontSize: 'var(--text-xl)' }}>
              {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSave}
          disabled={loading || totalMilk <= 0}
        >
          {loading ? t('common.loading') : `${t('common.save')} ✅`}
        </button>
      </div>
    </div>
  );
}
