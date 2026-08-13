// KhamarCare — Health Dashboard Page
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, ShieldAlert } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useFarmStore from '../../stores/useFarmStore.js';
import useHealthStore from '../../stores/useHealthStore.js';
import { formatDate, todayStr } from '../../utils/dateUtils.js';

export default function HealthDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const { animals } = useFarmStore();
  const { vaccinations, loadHealthData, loading } = useHealthStore();

  useEffect(() => {
    if (farm) {
      loadHealthData(farm.id);
    }
  }, [farm, loadHealthData]);

  // Sort upcoming vaccinations
  const upcomingVax = [...vaccinations]
    .filter(v => new Date(v.nextDueDate) >= new Date())
    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'স্বাস্থ্য ও টিকা' : 'Health & Vaccines'}</span>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/health/add')}>
          <Plus size={18} />
        </button>
      </header>

      <div className="page-content stagger-children">
        {/* Summary */}
        <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #E53935, #C62828)', color: 'white', border: 'none' }}>
          <div className="flex justify-between items-center">
            <div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 4 }}>
                {lang === 'bn' ? 'টিকা ব্যবস্থাপনা' : 'Vaccine Management'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>
                {upcomingVax.length} {lang === 'bn' ? 'টি আসন্ন টিকা রয়েছে' : 'upcoming vaccines'}
              </div>
            </div>
            <ShieldAlert size={40} opacity={0.8} />
          </div>
        </div>

        {/* Upcoming List */}
        <div className="section-header">
          <h2 className="section-title">{lang === 'bn' ? 'আসন্ন টিকা' : 'Upcoming Vaccines'}</h2>
        </div>
        
        {loading ? (
          <div className="text-center p-4">{t('common.loading')}</div>
        ) : upcomingVax.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛡️</div>
            <div className="empty-state-title">{lang === 'bn' ? 'কোনো আসন্ন টিকা নেই' : 'No upcoming vaccines'}</div>
          </div>
        ) : (
          upcomingVax.map(v => {
            const animal = animals.find(a => a.id === v.animalId);
            const daysLeft = Math.ceil((new Date(v.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={v.id} className="card mb-3" style={{ borderLeft: daysLeft <= 7 ? '4px solid var(--color-danger)' : '4px solid var(--color-primary-400)' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{v.vaccineName}</div>
                    <div className="text-secondary text-sm">
                      {animal ? `${animal.earTag} — ${lang === 'bn' ? animal.name : (animal.nameEn || animal.name)}` : 'Unknown'}
                    </div>
                  </div>
                  <div className={`badge ${daysLeft <= 7 ? 'badge-danger' : 'badge-primary'}`}>
                    {daysLeft} {lang === 'bn' ? 'দিন বাকি' : 'days left'}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 4 }}>
                  <span className="text-secondary">{lang === 'bn' ? 'তারিখ' : 'Date'}:</span>
                  <span className="font-medium">{formatDate(v.nextDueDate)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
