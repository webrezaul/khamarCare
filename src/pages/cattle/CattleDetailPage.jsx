// KhamarCare — Cattle Detail Page
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { getAgeString, formatDate, daysUntil } from '../../utils/dateUtils.js';
import { getAnimalIcon, getStatusColor, formatCurrency, formatWeight } from '../../utils/formatters.js';
import { ANIMAL_TYPE_LABELS, ANIMAL_STATUS_LABELS, BREEDS } from '../../config/constants.js';

export default function CattleDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const animals = useFarmStore(s => s.animals);
  const milkRecords = useFarmStore(s => s.milkRecords);
  const pregnancyRecords = useFarmStore(s => s.pregnancyRecords);
  const deleteAnimal = useFarmStore(s => s.deleteAnimal);
  const showToast = useToastStore(s => s.show);

  const animal = animals.find(a => a.id === Number(id));
  if (!animal) {
    return (
      <div className="page">
        <header className="app-header">
          <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <span className="app-header-title">{t('cattle.cattleDetails')}</span>
          <div style={{ width: 36 }} />
        </header>
        <div className="empty-state">
          <div className="empty-state-icon">🐄</div>
          <div className="empty-state-title">{t('common.noData')}</div>
        </div>
      </div>
    );
  }

  const breed = BREEDS.find(b => b.id === animal.breedId);
  const mother = animals.find(a => a.id === animal.motherId);
  const father = animals.find(a => a.id === animal.fatherId);
  const pregnancy = pregnancyRecords.find(p => p.animalId === animal.id && p.status === 'confirmed');

  // Milk stats for this cow
  const cowMilk = milkRecords.filter(r => r.animalId === animal.id);
  const totalMilk = cowMilk.reduce((s, r) => s + (r.totalMilk || 0), 0);
  const avgDailyMilk = cowMilk.length > 0 ? (totalMilk / cowMilk.length).toFixed(1) : 0;

  const handleDelete = async () => {
    if (window.confirm(t('common.confirmDelete'))) {
      await deleteAnimal(animal.id);
      showToast(lang === 'bn' ? 'গবাদি পশু আর্কাইভ হয়েছে' : 'Cattle archived', 'success');
      navigate('/cattle');
    }
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <span className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  );

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{t('cattle.cattleDetails')}</span>
        <div className="app-header-actions">
          <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={handleDelete}>
            <Trash2 size={18} color="var(--color-danger)" />
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* Hero Card */}
        <div className="card mb-4 text-center" style={{ padding: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{getAnimalIcon(animal.animalType)}</div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
            {lang === 'bn' ? animal.name : (animal.nameEn || animal.name)}
          </h2>
          <div className="text-secondary mb-3">{animal.earTag}</div>
          <div className="flex justify-center gap-2">
            <span className={`badge badge-${animal.status === 'lactating' ? 'success' : animal.status === 'pregnant' ? 'warning' : animal.status === 'sick' ? 'danger' : 'neutral'}`}>
              {lang === 'bn' ? ANIMAL_STATUS_LABELS[animal.status]?.bn : ANIMAL_STATUS_LABELS[animal.status]?.en}
            </span>
            <span className="badge badge-primary">
              {lang === 'bn' ? ANIMAL_TYPE_LABELS[animal.animalType]?.bn : ANIMAL_TYPE_LABELS[animal.animalType]?.en}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        {animal.status === 'lactating' && (
          <div className="card mb-4">
            <h3 className="card-title mb-3">🥛 {t('cattle.milkHistory')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="stat-card">
                <div className="stat-card-value">{avgDailyMilk}</div>
                <div className="stat-card-label">{lang === 'bn' ? 'গড় দৈনিক (লি.)' : 'Avg Daily (L)'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">{totalMilk.toFixed(0)}</div>
                <div className="stat-card-label">{lang === 'bn' ? 'মোট দুধ (লি.)' : 'Total Milk (L)'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pregnancy Info */}
        {pregnancy && (
          <div className="card mb-4">
            <h3 className="card-title mb-3">🤰 {t('pregnancy.title')}</h3>
            <InfoRow label={t('pregnancy.expectedCalving')} value={formatDate(pregnancy.expectedCalvingDate)} />
            <InfoRow label={t('pregnancy.daysRemaining')} value={`${daysUntil(pregnancy.expectedCalvingDate)} ${lang === 'bn' ? 'দিন' : 'days'}`} />
            <div className="disclaimer mt-3">
              <span className="disclaimer-icon">⚠️</span>
              <span>{t('pregnancy.estimateDisclaimer')}</span>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? 'মৌলিক তথ্য' : 'Basic Information'}</h3>
          <InfoRow label={t('cattle.breed')} value={lang === 'bn' ? breed?.nameBn : breed?.name} />
          <InfoRow label={t('cattle.gender')} value={lang === 'bn' ? (animal.gender === 'female' ? 'মহিলা' : 'পুরুষ') : (animal.gender === 'female' ? 'Female' : 'Male')} />
          <InfoRow label={t('cattle.age')} value={getAgeString(animal.dob, lang)} />
          <InfoRow label={t('cattle.dob')} value={formatDate(animal.dob)} />
          <InfoRow label={t('cattle.currentWeight')} value={animal.currentWeight ? formatWeight(animal.currentWeight, lang) : '—'} />
          <InfoRow label={t('cattle.birthWeight')} value={animal.birthWeight ? formatWeight(animal.birthWeight, lang) : '—'} />
          <InfoRow label={t('cattle.lactationNumber')} value={animal.lactationNumber} />
        </div>

        {/* Purchase & Value */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? 'ক্রয় ও মূল্য' : 'Purchase & Value'}</h3>
          <InfoRow label={t('cattle.source')} value={
            animal.source === 'farm_born' ? t('cattle.farmBorn') :
            animal.source === 'market' ? t('cattle.market') : t('cattle.gift')
          } />
          <InfoRow label={t('cattle.purchaseDate')} value={formatDate(animal.purchaseDate)} />
          <InfoRow label={t('cattle.purchasePrice')} value={animal.purchasePrice ? formatCurrency(animal.purchasePrice) : '—'} />
          <InfoRow label={t('cattle.currentValue')} value={animal.currentValue ? formatCurrency(animal.currentValue) : '—'} />
        </div>

        {/* Parentage */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">{lang === 'bn' ? 'বংশ পরিচয়' : 'Parentage'}</h3>
          <InfoRow label={t('cattle.mother')} value={mother ? `${mother.earTag} — ${lang === 'bn' ? mother.name : (mother.nameEn || mother.name)}` : '—'} />
          <InfoRow label={t('cattle.father')} value={father ? `${father.earTag} — ${lang === 'bn' ? father.name : (father.nameEn || father.name)}` : '—'} />
        </div>

        {/* Notes */}
        {animal.notes && (
          <div className="card mb-4">
            <h3 className="card-title mb-3">{t('common.notes')}</h3>
            <p className="text-secondary">{animal.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
