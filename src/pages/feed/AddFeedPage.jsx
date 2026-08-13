// KhamarCare — Add Feed Consumption Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { todayStr } from '../../utils/dateUtils.js';

export default function AddFeedPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const { animals, feedTypes, addFeedConsumption, addExpense } = useFarmStore();
  const showToast = useToastStore(s => s.show);

  const [date, setDate] = useState(todayStr());
  const [animalId, setAnimalId] = useState('all');
  const [feedTypeId, setFeedTypeId] = useState(feedTypes[0]?.id || '');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedFeed = feedTypes.find(f => f.id === Number(feedTypeId));

  const handleSave = async () => {
    if (!feedTypeId || !quantity || parseFloat(quantity) <= 0) {
      showToast(t('validation.negativeFeed'), 'error');
      return;
    }
    setLoading(true);

    const feedRecord = {
      farmId: farm.id,
      animalId: animalId === 'all' ? null : Number(animalId),
      feedTypeId: Number(feedTypeId),
      date,
      quantity: parseFloat(quantity),
      unit: selectedFeed?.unit || 'kg',
      cost: parseFloat(cost) || 0,
    };

    await addFeedConsumption(feedRecord);

    // Auto-add expense
    if (parseFloat(cost) > 0) {
      const feedName = lang === 'bn' ? selectedFeed?.nameBn : selectedFeed?.name;
      await addExpense({
        farmId: farm.id,
        date,
        category: 'feed',
        amount: parseFloat(cost),
        description: `${feedName} — ${quantity} ${selectedFeed?.unit || 'kg'}`,
      });
    }

    setLoading(false);
    showToast(t('feed.feedRecorded'), 'success');
    navigate('/feed');
  };

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('feed.addFeed')}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content">
        <div className="form-group">
          <label className="form-label">{t('common.date')}</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">{t('feed.selectAnimal')}</label>
          <select className="form-select" value={animalId} onChange={e => setAnimalId(e.target.value)}>
            <option value="all">{t('feed.allAnimals')}</option>
            {animals.map(a => (
              <option key={a.id} value={a.id}>
                {a.earTag} — {lang === 'bn' ? a.name : (a.nameEn || a.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('feed.feedType')}</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {feedTypes.map(ft => (
              <button
                key={ft.id}
                type="button"
                className={`card card-clickable text-center`}
                style={{
                  padding: 12,
                  border: Number(feedTypeId) === ft.id ? '2px solid var(--color-primary-500)' : '2px solid var(--border-color)',
                  background: Number(feedTypeId) === ft.id ? 'var(--color-primary-50)' : 'var(--bg-surface)',
                }}
                onClick={() => setFeedTypeId(ft.id)}
              >
                <div style={{ fontSize: 24 }}>{ft.icon}</div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, marginTop: 4 }}>
                  {lang === 'bn' ? ft.nameBn : ft.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">{t('common.quantity')} ({selectedFeed?.unit || 'kg'})</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              inputMode="decimal"
              step="0.1"
              min="0"
              style={{ fontSize: 'var(--text-xl)', textAlign: 'center' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.cost')} (৳)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={cost}
              onChange={e => setCost(e.target.value)}
              inputMode="numeric"
              min="0"
              style={{ fontSize: 'var(--text-xl)', textAlign: 'center' }}
            />
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg btn-full mt-4"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? t('common.loading') : `${t('common.save')} ✅`}
        </button>
      </div>
    </div>
  );
}
