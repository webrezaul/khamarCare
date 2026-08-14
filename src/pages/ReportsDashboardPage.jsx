import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFarmStore from '../stores/useFarmStore.js';

export default function ReportsDashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const { animals, milkRecords, incomeRecords, expenseRecords } = useFarmStore();

  // 1. Cattle Stats
  const cattleStats = useMemo(() => {
    return {
      total: animals.length,
      milking: animals.filter(c => c.status === 'lactating').length,
      pregnant: animals.filter(c => c.status === 'pregnant').length,
      calf: animals.filter(c => c.animalType === 'calf').length,
      dry: animals.filter(c => c.status === 'dry').length,
    };
  }, [animals]);

  // 2. Milk Production (Last 7 Days)
  const milkChartData = useMemo(() => {
    const today = new Date();
    const data = [];
    let maxAmount = 0;
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
      
      const dayRecords = milkRecords.filter(r => r.date === dateStr);
      const totalLiters = dayRecords.reduce((sum, r) => sum + (r.totalMilk || 0), 0);
      
      if (totalLiters > maxAmount) maxAmount = totalLiters;
      
      data.push({ date: displayDate, amount: totalLiters });
    }
    
    return { data, maxAmount: maxAmount || 10 }; // Default max to 10 to avoid div by zero
  }, [milkRecords]);

  // 3. Finance Summary (All Time)
  const financeStats = useMemo(() => {
    const income = incomeRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    const expense = expenseRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    return { income, expense, net: income - expense };
  }, [incomeRecords, expenseRecords]);

  // Formatter for BDT
  const formatMoney = (amount) => {
    return (lang === 'bn' ? '৳ ' : '৳') + amount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');
  };

  return (
    <div className="page pb-24">
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="app-header-title">{lang === 'bn' ? 'রিপোর্ট ও অ্যানালিটিক্স' : 'Reports & Analytics'}</div>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="page-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Cattle Summary Card */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🐄 {lang === 'bn' ? 'গবাদি পশুর সারাংশ' : 'Cattle Summary'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--color-primary-50)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary-600)' }}>{cattleStats.total}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lang === 'bn' ? 'মোট গবাদি পশু' : 'Total Cattle'}</div>
            </div>
            <div style={{ background: '#FFF3E0', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F57C00' }}>{cattleStats.milking}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lang === 'bn' ? 'দুধালো' : 'Milking'}</div>
            </div>
            <div style={{ background: '#E8F5E9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388E3C' }}>{cattleStats.pregnant}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lang === 'bn' ? 'গর্ভবতী' : 'Pregnant'}</div>
            </div>
            <div style={{ background: '#E3F2FD', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976D2' }}>{cattleStats.calf}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lang === 'bn' ? 'বাছুর' : 'Calves'}</div>
            </div>
          </div>
        </div>

        {/* Milk Production Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🥛 {lang === 'bn' ? 'দুধ উৎপাদন (গত ৭ দিন)' : 'Milk Production (7 Days)'}
          </h3>
          
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '24px', paddingBottom: '24px', position: 'relative', borderBottom: '1px solid var(--border-light)' }}>
            {milkChartData.data.map((day, i) => {
              const heightPercent = Math.max((day.amount / milkChartData.maxAmount) * 100, 2); // min height 2%
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                    {day.amount > 0 ? day.amount : ''}
                  </div>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '30px', 
                    height: `${heightPercent}%`, 
                    background: 'var(--color-primary-400)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }}></div>
                  <div style={{ position: 'absolute', bottom: 0, fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'center', width: '30px', left: `${(i * (100 / 7)) + (100 / 14)}%`, transform: 'translateX(-50%)', padding: '4px 0' }}>
                    {day.date.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Finance Summary */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💰 {lang === 'bn' ? 'আর্থিক সারাংশ' : 'Financial Summary'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#E8F5E9', borderRadius: '8px' }}>
              <span style={{ color: '#2E7D32', fontWeight: '500' }}>{lang === 'bn' ? 'মোট আয়' : 'Total Income'}</span>
              <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>{formatMoney(financeStats.income)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FFEBEE', borderRadius: '8px' }}>
              <span style={{ color: '#C62828', fontWeight: '500' }}>{lang === 'bn' ? 'মোট ব্যয়' : 'Total Expense'}</span>
              <span style={{ color: '#C62828', fontWeight: 'bold' }}>{formatMoney(financeStats.expense)}</span>
            </div>
            
            <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{lang === 'bn' ? 'নিট লাভ / (ক্ষতি)' : 'Net Profit / (Loss)'}</span>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '18px',
                color: financeStats.net >= 0 ? '#2E7D32' : '#C62828' 
              }}>
                {formatMoney(financeStats.net)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
