// KhamarCare — Add Income Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { INCOME_CATEGORIES } from '../../config/constants.js';
import { todayStr } from '../../utils/dateUtils.js';

export default function AddIncomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const addIncome = useFarmStore(s => s.addIncome);
  const showToast = useToastStore(s => s.show);

  const [date, setDate] = useState(todayStr());
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!category) { showToast(t('validation.selectCategory'), 'error'); return; }
    if (!amount || parseFloat(amount) <= 0) { showToast(t('validation.negativeAmount'), 'error'); return; }
    setLoading(true);
    await addIncome({ farmId: farm.id, date, category, amount: parseFloat(amount), description });
    setLoading(false);
    showToast(t('finance.incomeRecorded'), 'success');
    navigate('/finance');
  };

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <span className="app-header-title">{t('finance.addIncome')}</span>
        <div style={{ width: 36 }} />
      </header>
      <div className="page-content">
        <div className="form-group">
          <label className="form-label">{t('common.date')}</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('common.category')}</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {INCOME_CATEGORIES.map(cat => (
              <button key={cat.id} type="button" className="card card-clickable text-center" style={{
                padding: 12,
                border: category === cat.id ? '2px solid var(--color-primary-500)' : '2px solid var(--border-color)',
                background: category === cat.id ? 'var(--color-primary-50)' : 'var(--bg-surface)',
              }} onClick={() => setCategory(cat.id)}>
                <div style={{ fontSize: 28 }}>{cat.icon}</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginTop: 4 }}>{lang === 'bn' ? cat.bn : cat.en}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('common.amount')} (৳)</label>
          <input type="number" className="form-input" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} inputMode="numeric" min="0" style={{ fontSize: 'var(--text-2xl)', textAlign: 'center', fontWeight: 'var(--font-bold)' }} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('common.description')}</label>
          <textarea className="form-input form-textarea" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder={lang === 'bn' ? 'বিবরণ দিন...' : 'Description...'} />
        </div>
        <button className="btn btn-primary btn-lg btn-full" onClick={handleSave} disabled={loading}>
          {loading ? t('common.loading') : `${t('common.save')} ✅`}
        </button>
      </div>
    </div>
  );
}
