// KhamarCare — Cattle List Page
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import { getAgeString, formatDate } from '../../utils/dateUtils.js';
import { getAnimalIcon, getStatusColor, formatCurrency } from '../../utils/formatters.js';
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
    <div className="page">
      <header className="app-header">
        <div>
          <div className="app-header-title">{t('cattle.title')}</div>
          <div className="app-header-subtitle">{t('cattle.totalAnimals')}: {animals.length}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/cattle/add')}>
          <Plus size={18} /> {t('common.add')}
        </button>
      </header>

      <div className="page-content">
        {/* Search */}
        <div className="search-bar">
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder={t('common.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className="filter-chips">
          {types.map(type => (
            <button
              key={type}
              className={`filter-chip ${typeFilter === type ? 'active' : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? t('common.all') : (lang === 'bn' ? ANIMAL_TYPE_LABELS[type]?.bn : ANIMAL_TYPE_LABELS[type]?.en)}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="filter-chips">
          {statuses.map(status => (
            <button
              key={status}
              className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? t('common.all') : (lang === 'bn' ? ANIMAL_STATUS_LABELS[status]?.bn : ANIMAL_STATUS_LABELS[status]?.en)}
            </button>
          ))}
        </div>

        {/* Animal List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🐄</div>
            <div className="empty-state-title">{t('empty.noCattle')}</div>
            <div className="empty-state-desc">{t('empty.noCattleDesc')}</div>
            <button className="btn btn-primary" onClick={() => navigate('/cattle/add')}>
              <Plus size={18} /> {t('cattle.addCattle')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 stagger-children">
            {filtered.map(animal => (
              <div
                key={animal.id}
                className="animal-card"
                onClick={() => navigate(`/cattle/${animal.id}`)}
              >
                <div className="animal-card-avatar" style={{ background: `${getStatusColor(animal.status)}15` }}>
                  {getAnimalIcon(animal.animalType)}
                </div>
                <div className="animal-card-info">
                  <div className="animal-card-name">
                    {lang === 'bn' ? animal.name : (animal.nameEn || animal.name)}
                  </div>
                  <div className="animal-card-meta">
                    <span>{animal.earTag}</span>
                    <span>•</span>
                    <span>{lang === 'bn' ? ANIMAL_TYPE_LABELS[animal.animalType]?.bn : ANIMAL_TYPE_LABELS[animal.animalType]?.en}</span>
                    <span>•</span>
                    <span>{getAgeString(animal.dob, lang)}</span>
                  </div>
                </div>
                <div className="animal-card-right">
                  <span className={`badge badge-${animal.status === 'lactating' ? 'success' : animal.status === 'pregnant' ? 'warning' : animal.status === 'sick' ? 'danger' : 'neutral'}`}>
                    {lang === 'bn' ? ANIMAL_STATUS_LABELS[animal.status]?.bn : ANIMAL_STATUS_LABELS[animal.status]?.en}
                  </span>
                  {animal.currentWeight > 0 && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      {animal.currentWeight} {t('common.kg')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
