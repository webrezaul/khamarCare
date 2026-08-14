import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import useFarmStore from '../../stores/useFarmStore.js';
import { calcExpectedCalvingDate } from '../../utils/calculations.js';

export default function BreedingDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { breedingRecords, animals } = useFarmStore();

  const getAnimalName = (id) => {
    const a = animals.find(a => a.id === id);
    if (!a) return 'Unknown';
    return lang === 'bn' ? a.name : (a.nameEn || a.name);
  };

  const activePregnancies = useMemo(() => {
    return breedingRecords.filter(r => r.status === 'successful' || r.status === 'pregnant');
  }, [breedingRecords]);

  const pendingBreeds = useMemo(() => {
    return breedingRecords.filter(r => r.status === 'pending');
  }, [breedingRecords]);

  return (
    <div className="page pb-24">
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>←</button>
        <div className="app-header-title">{lang === 'bn' ? 'প্রজনন ম্যানেজমেন্ট' : 'Breeding Management'}</div>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="page-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card" style={{ padding: '16px', textAlign: 'center', background: '#E8F5E9' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2E7D32' }}>{activePregnancies.length}</div>
            <div style={{ fontSize: '14px', color: '#388E3C' }}>{lang === 'bn' ? 'বর্তমান গর্ভবতী' : 'Active Pregnancies'}</div>
          </div>
          <div className="card" style={{ padding: '16px', textAlign: 'center', background: '#FFF3E0' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#E65100' }}>{pendingBreeds.length}</div>
            <div style={{ fontSize: '14px', color: '#F57C00' }}>{lang === 'bn' ? 'অপেক্ষমাণ চেক' : 'Pending Checks'}</div>
          </div>
        </div>

        {/* Breeding Records */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔬 {lang === 'bn' ? 'প্রজনন রেকর্ড' : 'Breeding Records'}
            </h3>
          </div>

          {breedingRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🔬</div>
              <p>{lang === 'bn' ? 'কোনো প্রজনন রেকর্ড নেই' : 'No breeding records found'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {breedingRecords.map(record => {
                const edd = calcExpectedCalvingDate(record.date);
                
                return (
                  <div key={record.id} style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{getAnimalName(record.animalId)}</div>
                      <span className={`badge ${record.status === 'successful' || record.status === 'pregnant' ? 'badge-success' : record.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {lang === 'bn' ? 
                          (record.status === 'successful' || record.status === 'pregnant' ? 'গর্ভবতী' : record.status === 'pending' ? 'অপেক্ষমাণ' : 'ব্যর্থ') : 
                          (record.status === 'successful' || record.status === 'pregnant' ? 'Pregnant' : record.status === 'pending' ? 'Pending' : 'Failed')
                        }
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lang === 'bn' ? 'প্রজনন তারিখ' : 'Breeding Date'}</div>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{new Date(record.date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}</div>
                      </div>
                      
                      {edd && (
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lang === 'bn' ? 'সম্ভাব্য প্রসব' : 'Expected Calving'}</div>
                          <div style={{ fontWeight: '500', color: '#1976D2' }}>{new Date(edd).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}</div>
                        </div>
                      )}

                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lang === 'bn' ? 'পদ্ধতি' : 'Method'}</div>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{record.method === 'ai' ? 'AI' : (lang === 'bn' ? 'প্রাকৃতিক' : 'Natural')}</div>
                      </div>

                      {record.bullId && (
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lang === 'bn' ? 'বীজ/ষাঁড় আইডি' : 'Semen/Bull ID'}</div>
                          <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{record.bullId}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FAB */}
      <button 
        className="fab" 
        onClick={() => navigate('/breeding/add')}
      >
        <Plus size={24} color="white" />
      </button>
    </div>
  );
}
