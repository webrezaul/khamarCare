// KhamarCare — Premium Cattle List Page
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import { getAgeString } from '../../utils/dateUtils.js';
import { getAnimalIcon, getStatusColor } from '../../utils/formatters.js';
import { ANIMAL_TYPE_LABELS, ANIMAL_STATUS_LABELS } from '../../config/constants.js';

export default function CattleListPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const animals = useFarmStore(s => s.animals);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...animals];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.nameEn?.toLowerCase().includes(q) ||
        a.earTag?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') list = list.filter(a => a.animalType === typeFilter);
    if (statusFilter !== 'all') list = list.filter(a => a.status === statusFilter);
    return list;
  }, [animals, search, typeFilter, statusFilter]);

  const types = ['all', 'cow', 'heifer', 'calf', 'bull'];
  const statuses = ['all', 'lactating', 'pregnant', 'dry', 'open', 'sick'];

  return (
    <div className="page" style={{ background: '#f4f6f8', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 11,
        background: 'rgba(244, 246, 248, 0.85)', 
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
        paddingBottom: '12px'
      }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="app-header-title text-gradient text-lg">{t('cattle.title')}</div>
            <div className="app-header-subtitle font-medium text-gray-500" style={{ color: 'var(--text-secondary)'}}>
              {t('cattle.totalAnimals')}: <span style={{ fontWeight: 700, color: 'var(--color-primary-600)' }}>{animals.length}</span>
            </div>
          </div>
          <button 
            className="btn shadow-sm" 
            onClick={() => navigate('/cattle/add')} 
            style={{ background: 'var(--color-primary-500)', color: 'white', borderRadius: '9999px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> {t('common.add')}
          </button>
        </div>
      </header>

      {/* Sticky Search & Filter Bar */}
      <div style={{ position: 'sticky', top: 'calc(56px + env(safe-area-inset-top))', zIndex: 10, background: 'rgba(244, 246, 248, 0.95)', backdropFilter: 'blur(8px)', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder={t('common.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '15px', background: 'white', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
            />
          </div>

          {/* Scrollable Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                    border: typeFilter === type ? '1px solid var(--color-primary-500)' : '1px solid #e5e7eb',
                    background: typeFilter === type ? 'var(--color-primary-500)' : 'white',
                    color: typeFilter === type ? 'white' : '#6b7280',
                    transition: 'all 0.2s'
                  }}
                >
                  {type === 'all' ? t('common.all') : (lang === 'bn' ? ANIMAL_TYPE_LABELS[type]?.bn : ANIMAL_TYPE_LABELS[type]?.en)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                    border: statusFilter === status ? `1px solid ${getStatusColor(status)}` : '1px solid #e5e7eb',
                    background: statusFilter === status ? getStatusColor(status) : 'white',
                    color: statusFilter === status ? 'white' : '#6b7280',
                    transition: 'all 0.2s'
                  }}
                >
                  {status === 'all' ? t('common.all') : (lang === 'bn' ? ANIMAL_STATUS_LABELS[status]?.bn : ANIMAL_STATUS_LABELS[status]?.en)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-content" style={{ padding: '16px', paddingBottom: '100px' }}>
        {/* Animal List */}
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '1px dashed #d1d5db', marginTop: '16px' }}>
            <div style={{ fontSize: '48px', opacity: 0.8, marginBottom: '16px', filter: 'grayscale(0.5)' }}>🐄</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>{t('empty.noCattle')}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', textAlign: 'center' }}>{t('empty.noCattleDesc')}</div>
            <button 
              onClick={() => navigate('/cattle/add')}
              style={{ background: 'var(--color-primary-500)', color: 'white', borderRadius: '9999px', padding: '10px 20px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}
            >
              <Plus size={18} /> {t('cattle.addCattle')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="stagger-children">
            {filtered.map(animal => (
              <div
                key={animal.id}
                onClick={() => navigate(`/cattle/${animal.id}`)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                  background: 'white', borderRadius: '20px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6',
                  cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Status Indicator Bar */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: getStatusColor(animal.status) }} />
                
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '16px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                  background: `${getStatusColor(animal.status)}15`,
                  flexShrink: 0
                }}>
                  {getAnimalIcon(animal.animalType)}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lang === 'bn' ? animal.name : (animal.nameEn || animal.name)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary-600)', background: 'var(--color-primary-50)', padding: '2px 6px', borderRadius: '4px' }}>{animal.earTag}</span>
                    <span>•</span>
                    <span>{lang === 'bn' ? ANIMAL_TYPE_LABELS[animal.animalType]?.bn : ANIMAL_TYPE_LABELS[animal.animalType]?.en}</span>
                    <span>•</span>
                    <span>{getAgeString(animal.dob, lang)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '9999px',
                    background: `${getStatusColor(animal.status)}15`,
                    color: getStatusColor(animal.status)
                  }}>
                    {lang === 'bn' ? ANIMAL_STATUS_LABELS[animal.status]?.bn : ANIMAL_STATUS_LABELS[animal.status]?.en}
                  </span>
                  {animal.currentWeight > 0 && (
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>
                      {animal.currentWeight} {t('common.kg')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
