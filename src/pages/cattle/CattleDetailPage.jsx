// KhamarCare — Premium Cattle Detail Page
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit2, Trash2, Droplets, Target, Calendar, Activity, Info, TrendingUp, Search } from 'lucide-react';
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
      <div className="page" style={{ background: '#f4f6f8', minHeight: '100vh' }}>
        <header className="app-header" style={{ background: 'rgba(244, 246, 248, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}>
          <button style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} color="#374151" />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{t('cattle.cattleDetails')}</span>
          <div style={{ width: 38 }} />
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', marginTop: '32px' }}>
          <div style={{ fontSize: '64px', opacity: 0.5, marginBottom: '16px' }}>🐄</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#374151' }}>{t('common.noData')}</div>
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

  const statusColor = getStatusColor(animal.status);

  const InfoCard = ({ icon: Icon, label, value, color = 'var(--color-primary-500)', bg = 'var(--color-primary-50)' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icon && <Icon size={20} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '—'}</div>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ background: '#f4f6f8', minHeight: '100vh', paddingBottom: '100px' }}>
      <header className="app-header" style={{ 
        background: 'rgba(244, 246, 248, 0.85)', 
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        paddingTop: 'calc(env(safe-area-inset-top) + 12px)'
      }}>
        <button style={{ padding: '8px', borderRadius: '50%', background: 'white', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#374151" />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{t('cattle.cattleDetails')}</span>
        <button style={{ padding: '8px', borderRadius: '50%', background: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleDelete}>
          <Trash2 size={18} color="#ef4444" />
        </button>
      </header>

      <div className="page-content" style={{ padding: '16px' }}>
        
        {/* Premium Hero Profile Card */}
        <div className="animate-fade-in-up" style={{ 
          background: 'white', borderRadius: '24px', padding: '24px', textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', marginBottom: '24px',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(to bottom, ${statusColor}15, white)` }} />
          
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '24px', margin: '0 auto 16px',
            background: 'white', border: `3px solid ${statusColor}`,
            boxShadow: `0 8px 24px ${statusColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '52px', position: 'relative', zIndex: 1
          }}>
            {getAnimalIcon(animal.animalType)}
          </div>
          
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1f2937', marginBottom: '4px', position: 'relative', zIndex: 1 }}>
            {lang === 'bn' ? animal.name : (animal.nameEn || animal.name)}
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', padding: '4px 12px', borderRadius: '9999px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#4b5563' }}>{animal.earTag}</span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#9ca3af' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>{getAgeString(animal.dob, lang)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
            <span style={{ 
              padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700,
              background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`
            }}>
              {lang === 'bn' ? ANIMAL_STATUS_LABELS[animal.status]?.bn : ANIMAL_STATUS_LABELS[animal.status]?.en}
            </span>
            <span style={{ 
              padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700,
              background: '#eff6ff', color: '#3b82f6', border: '1px solid #dbeafe'
            }}>
              {lang === 'bn' ? ANIMAL_TYPE_LABELS[animal.animalType]?.bn : ANIMAL_TYPE_LABELS[animal.animalType]?.en}
            </span>
          </div>
        </div>

        {/* Quick Stats (Performance) */}
        {animal.status === 'lactating' && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={18} color="#3b82f6" /> {t('cattle.milkHistory')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '16px', padding: '16px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>{lang === 'bn' ? 'গড় দৈনিক (লি.)' : 'Avg Daily (L)'}</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a' }}>{avgDailyMilk}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>{lang === 'bn' ? 'মোট দুধ (লি.)' : 'Total Milk (L)'}</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1f2937' }}>{totalMilk.toFixed(0)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pregnancy Info */}
        {pregnancy && (
          <div style={{ marginBottom: '24px', background: '#fffbeb', borderRadius: '16px', padding: '16px', border: '1px solid #fde68a' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#92400e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} /> {t('pregnancy.title')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed #fcd34d' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#b45309' }}>{t('pregnancy.expectedCalving')}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>{formatDate(pregnancy.expectedCalvingDate)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#b45309' }}>{t('pregnancy.daysRemaining')}</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '2px 10px', borderRadius: '9999px' }}>
                  {daysUntil(pregnancy.expectedCalvingDate)} {lang === 'bn' ? 'দিন' : 'days'}
                </span>
              </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#92400e', display: 'flex', gap: '6px', alignItems: 'flex-start', background: '#fef3c7', padding: '8px', borderRadius: '8px' }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{t('pregnancy.estimateDisclaimer')}</span>
            </div>
          </div>
        )}

        {/* Basic Information Grid */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--color-primary-500)" /> {lang === 'bn' ? 'মৌলিক তথ্য' : 'Basic Information'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <InfoCard icon={Target} label={t('cattle.breed')} value={lang === 'bn' ? breed?.nameBn : breed?.name} bg="#f3f4f6" color="#4b5563" />
            <InfoCard icon={Calendar} label={t('cattle.dob')} value={formatDate(animal.dob)} bg="#f3f4f6" color="#4b5563" />
            <InfoCard icon={TrendingUp} label={t('cattle.currentWeight')} value={animal.currentWeight ? formatWeight(animal.currentWeight, lang) : '—'} bg="#f3f4f6" color="#4b5563" />
            <InfoCard icon={Info} label={t('cattle.lactationNumber')} value={animal.lactationNumber} bg="#f3f4f6" color="#4b5563" />
          </div>
        </div>

        {/* Purchase & Value Grid */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--color-primary-500)" /> {lang === 'bn' ? 'ক্রয় ও মূল্য' : 'Purchase & Value'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <InfoCard icon={Info} label={t('cattle.source')} value={
              animal.source === 'farm_born' ? t('cattle.farmBorn') :
              animal.source === 'market' ? t('cattle.market') : t('cattle.gift')
            } bg="#f0fdf4" color="#16a34a" />
            <InfoCard icon={Calendar} label={t('cattle.purchaseDate')} value={formatDate(animal.purchaseDate)} bg="#f0fdf4" color="#16a34a" />
            <InfoCard icon={TrendingUp} label={t('cattle.purchasePrice')} value={animal.purchasePrice ? formatCurrency(animal.purchasePrice) : '—'} bg="#f0fdf4" color="#16a34a" />
            <InfoCard icon={TrendingUp} label={t('cattle.currentValue')} value={animal.currentValue ? formatCurrency(animal.currentValue) : '—'} bg="#f0fdf4" color="#16a34a" />
          </div>
        </div>

        {/* Parentage */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="var(--color-primary-500)" /> {lang === 'bn' ? 'বংশ পরিচয়' : 'Parentage'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🐄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{t('cattle.mother')}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>{mother ? `${mother.earTag} — ${lang === 'bn' ? mother.name : (mother.nameEn || mother.name)}` : '—'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🐂</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{t('cattle.father')}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>{father ? `${father.earTag} — ${lang === 'bn' ? father.name : (father.nameEn || father.name)}` : '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {animal.notes && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>{t('common.notes')}</h3>
            <div style={{ background: '#fffbeb', border: '1px dashed #fcd34d', borderRadius: '16px', padding: '16px', color: '#92400e', fontSize: '14px', lineHeight: 1.5 }}>
              {animal.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
