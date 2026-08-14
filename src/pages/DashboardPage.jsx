// KhamarCare — Premium Dashboard Page (Main Screen)
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Bell, Wheat, Receipt, X, Droplets, TrendingUp, DollarSign, Target, Activity, CheckCircle2, AlertTriangle, Syringe, BellRing, LogOut } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../stores/useAuthStore.js';
import useFarmStore from '../stores/useFarmStore.js';
import { formatCurrency, formatLiter } from '../utils/formatters.js';
import { calcProfitabilityScore, calcCostPerLiter, calcProfitPerLiter } from '../utils/calculations.js';

// SVG Gauge Component (Refined)
const CircularGauge = ({ score, level, lang }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const colors = {
    excellent: '#4ade80', // Lighter green for better contrast on dark bg
    good: '#facc15',
    needsAttention: '#f87171'
  };
  const color = colors[level];

  return (
    <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="45" cy="45" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
        <circle 
          cx="45" cy="45" r={radius} 
          stroke={color} strokeWidth="8" fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{lang === 'bn' ? 'স্কোর' : 'Score'}</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const { user, farm } = useAuthStore();
  const {
    animals, milkRecords, settings,
    getTodayTotalMilk, getTodayIncome, getTodayExpense, getTodayFeedCost,
    getMonthlyIncome, getMonthlyExpense, getMonthlyFeedCost,
    getDailyMilkTrend, getIncomeVsExpenseTrend, getAlerts,
  } = useFarmStore();

  const [fabOpen, setFabOpen] = useState(false);
  const [activeChart, setActiveChart] = useState('milk'); // 'milk' or 'finance'

  // Counts
  const totalCattle = animals.length;
  const lactating = animals.filter(a => a.status === 'lactating').length;
  const pregnant = animals.filter(a => a.status === 'pregnant').length;
  const heifers = animals.filter(a => a.animalType === 'heifer').length;
  const calves = animals.filter(a => a.animalType === 'calf').length;

  // Today stats
  const todayMilk = getTodayTotalMilk();
  const todayIncome = getTodayIncome();
  const todayExpense = getTodayExpense();
  const todayFeedCost = getTodayFeedCost();
  const todayProfit = todayIncome - todayExpense;

  // Monthly stats
  const monthIncome = getMonthlyIncome();
  const monthExpense = getMonthlyExpense();
  const monthFeedCost = getMonthlyFeedCost();

  // Charts
  const milkTrend = getDailyMilkTrend(7);
  const incomeExpenseTrend = getIncomeVsExpenseTrend();

  // Alerts
  const alerts = getAlerts();

  // Profitability score
  const milkPrice = Number(settings.milkPricePerLiter) || 50;
  const monthlyMilk = milkRecords.reduce((s, r) => s + (r.totalMilk || 0), 0);
  const avgMilkPerCow = lactating > 0 ? monthlyMilk / (lactating * 30) : 0;
  const feedCostRatio = monthIncome > 0 ? (monthFeedCost / monthIncome) * 100 : 0;
  const profitMargin = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;
  const reproRate = totalCattle > 0 ? (lactating + pregnant) / animals.filter(a => a.gender === 'female' && a.animalType === 'cow').length || 0 : 0;
  const sickRate = totalCattle > 0 ? animals.filter(a => a.status === 'sick').length / totalCattle : 0;

  const profScore = useMemo(() => calcProfitabilityScore({
    avgMilkPerCow, feedCostRatio, profitMargin, reproductiveRate: reproRate, sickRate
  }), [avgMilkPerCow, feedCostRatio, profitMargin, reproRate, sickRate]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip-glass" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          <p className="font-semibold text-primary mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: 13, fontWeight: 700 }}>
              {entry.name}: {entry.name === 'Milk' || entry.name === 'দুধ' ? formatLiter(entry.value, lang) : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'calving': return <Target size={18} className="text-warning" />;
      case 'vaccination': return <Syringe size={18} className="text-info" />;
      case 'feed_stock': return <AlertTriangle size={18} className="text-danger" />;
      default: return <BellRing size={18} className="text-primary" />;
    }
  };

  const getAlertStyle = (type) => {
    switch(type) {
      case 'calving': return 'border-l-warning bg-warning-light';
      case 'vaccination': return 'border-l-info bg-info-light';
      case 'feed_stock': return 'border-l-danger bg-danger-light';
      default: return 'border-l-primary bg-primary-light';
    }
  };

  return (
    <div className="page" style={{ background: '#f4f6f8' }}>
      
      {/* App Header (Glassy) */}
      <header className="app-header" style={{ 
        background: 'rgba(244, 246, 248, 0.85)', 
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        paddingTop: 'calc(env(safe-area-inset-top) + 12px)'
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg text-white font-bold text-xl" style={{ backgroundColor: 'var(--color-primary-500)'}}>
            {farm?.name ? farm.name.charAt(0).toUpperCase() : 'K'}
          </div>
          <div>
            <div className="app-header-title text-gradient text-lg">{farm?.name || t('app.name')}</div>
            <div className="app-header-subtitle font-medium text-gray-500" style={{ color: 'var(--text-secondary)'}}>
              {t('common.greeting', { name: user?.name || '' })} 👋
            </div>
          </div>
        </div>
        <div className="app-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="lang-toggle shadow-sm bg-white rounded-full p-1 border border-gray-100" style={{ background: 'white', border: '1px solid var(--border-color)', display: 'flex', borderRadius: '9999px', padding: '2px'}}>
            <button className={`lang-toggle-btn px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'bn' ? 'active-lang text-white' : 'text-gray-500'}`} onClick={() => i18n.changeLanguage('bn')} style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', background: lang === 'bn' ? 'var(--color-primary-500)' : 'transparent', color: lang === 'bn' ? 'white' : 'var(--text-secondary)'}}>বাং</button>
            <button className={`lang-toggle-btn px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'active-lang text-white' : 'text-gray-500'}`} onClick={() => i18n.changeLanguage('en')} style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', background: lang === 'en' ? 'var(--color-primary-500)' : 'transparent', color: lang === 'en' ? 'white' : 'var(--text-secondary)'}}>EN</button>
          </div>
          <button 
            onClick={() => {
              useAuthStore.getState().logout();
              navigate('/login');
            }}
            className="flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100"
            style={{ width: '32px', height: '32px', color: 'var(--color-danger)', border: '1px solid #fee2e2', background: '#fef2f2' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="page-content stagger-children pb-24 px-4 pt-6">
        
        {/* Premium Farm Overview Hero */}
        <div className="glass-card shadow-2xl mb-8 animate-fade-in-up border-0 overflow-hidden relative" onClick={() => navigate('/cattle')} style={{ 
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #1e3c27 0%, #2D7D46 100%)',
          color: 'white',
          borderRadius: '24px',
          padding: '24px'
        }}>
          {/* Abstract background shapes */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(20px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(30px)' }}></div>
          
          {totalCattle === 0 ? (
            <div className="flex flex-col items-center text-center relative z-10 py-6">
              <div className="text-4xl mb-3">🐄</div>
              <h2 className="text-xl font-bold text-white mb-2">{lang === 'bn' ? 'আপনার খামারে স্বাগতম!' : 'Welcome to your farm!'}</h2>
              <p className="text-sm mb-6 px-4" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                {lang === 'bn' ? 'এখনও কোনো গবাদিপশু যোগ করা হয়নি। আপনার খামারের যাত্রা শুরু করতে প্রথম পশুটি যোগ করুন।' : 'No cattle added yet. Add your first animal to start your farming journey.'}
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/cattle/add'); }}
                className="rounded-full px-6 py-3 font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                style={{ background: 'white', color: 'var(--color-primary-600)', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={18} /> {lang === 'bn' ? 'গবাদিপশু যোগ করুন' : 'Add Cattle'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>{lang === 'bn' ? 'মোট গবাদিপশু' : 'Total Cattle'}</h2>
                  </div>
                  <div className="text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-2" style={{ fontSize: '3rem', fontWeight: 800 }}>
                    {totalCattle}
                    <span className="text-lg font-medium" style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)' }}>🐄</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20 w-fit" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px'}}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
                    <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                      {lang === 'bn' ? `আজকের লাভ: ${formatCurrency(todayProfit)}` : `Today's Profit: ${formatCurrency(todayProfit)}`}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <CircularGauge score={profScore.score} level={profScore.level} lang={lang} />
                </div>
              </div>
              
              <div className="grid grid-4 gap-2 mt-6 rounded-2xl p-3 backdrop-blur-sm relative z-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '24px', background: 'rgba(0,0,0,0.1)', borderRadius: '16px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-center">
                  <div className="font-bold uppercase mb-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{lang === 'bn' ? 'দুধেল' : 'Lactating'}</div>
                  <div className="font-bold text-lg text-white" style={{ fontSize: '1.125rem' }}>{lactating}</div>
                </div>
                <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="font-bold uppercase mb-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{lang === 'bn' ? 'গর্ভবতী' : 'Pregnant'}</div>
                  <div className="font-bold text-lg text-white" style={{ fontSize: '1.125rem' }}>{pregnant}</div>
                </div>
                <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="font-bold uppercase mb-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{lang === 'bn' ? 'বকনা' : 'Heifers'}</div>
                  <div className="font-bold text-lg text-white" style={{ fontSize: '1.125rem' }}>{heifers}</div>
                </div>
                <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="font-bold uppercase mb-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{lang === 'bn' ? 'বাছুর' : 'Calves'}</div>
                  <div className="font-bold text-lg text-white" style={{ fontSize: '1.125rem' }}>{calves}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Center - Alerts & Notifications */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2" style={{ fontSize: '15px', color: '#1f2937' }}>
              <Activity size={18} className="text-primary" style={{ color: 'var(--color-primary-500)' }} /> {lang === 'bn' ? 'অ্যাকশন সেন্টার' : 'Action Center'}
            </h2>
            <button className="text-xs font-bold rounded-full" onClick={() => navigate('/notifications')} style={{ color: 'var(--color-primary-500)', background: 'rgba(45, 125, 70, 0.1)', padding: '4px 12px' }}>
              {t('common.viewAll')}
            </button>
          </div>
          
          {alerts.length > 0 ? (
            <div className="flex gap-3 overflow-auto pb-2 px-1 hide-scrollbar" style={{ scrollbarWidth: 'none', margin: '0 -4px' }}>
              {alerts.slice(0, 4).map((n) => (
                <div key={n.id} className={`shrink-0 w-64 p-3 rounded-2xl border-l-4 ${getAlertStyle(n.type)} shadow-sm`} style={{ flexShrink: 0, width: '256px', padding: '12px', borderRadius: '16px', background: 'white', borderLeftWidth: '4px', borderLeftStyle: 'solid' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm shrink-0" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                      {getAlertIcon(n.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1" style={{ color: '#1f2937', fontSize: '14px' }}>{lang === 'bn' ? n.title : (n.titleEn || n.title)}</h4>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>{lang === 'bn' ? n.message : (n.messageEn || n.message)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-4 flex flex-col items-center justify-center gap-2" style={{ border: '1px dashed #d1d5db', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--color-success)', opacity: 0.5 }} />
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>{lang === 'bn' ? 'সবকিছু ঠিক আছে! কোনো নতুন অ্যালার্ট নেই।' : 'All caught up! No new alerts.'}</p>
            </div>
          )}
        </section>

        {/* Quick Stats Grid 2x2 */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2" style={{ fontSize: '15px', color: '#1f2937' }}>
              <Target size={18} style={{ color: 'var(--color-primary-500)' }} /> {t('dashboard.todayStats')}
            </h2>
          </div>
          <div className="grid grid-2 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group" style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10" style={{ position: 'absolute', top: 0, right: 0, width: '64px', height: '64px', borderBottomLeftRadius: '9999px', background: '#eff6ff', zIndex: 0 }}></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={16} />
                </div>
              </div>
              <div className="font-semibold uppercase tracking-wider relative z-10" style={{ fontSize: '12px', color: '#6b7280' }}>{t('dashboard.todayMilk')}</div>
              <div className="font-black mt-1 relative z-10" style={{ fontSize: '20px', color: '#1f2937' }}>{formatLiter(todayMilk, lang)}</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group" style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10" style={{ position: 'absolute', top: 0, right: 0, width: '64px', height: '64px', borderBottomLeftRadius: '9999px', background: '#dcfce7', zIndex: 0 }}></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#bbf7d0', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="font-semibold uppercase tracking-wider relative z-10" style={{ fontSize: '12px', color: '#6b7280' }}>{t('dashboard.todayIncome')}</div>
              <div className="font-black mt-1 relative z-10" style={{ fontSize: '20px', color: '#1f2937' }}>{formatCurrency(todayIncome)}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group" style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10" style={{ position: 'absolute', top: 0, right: 0, width: '64px', height: '64px', borderBottomLeftRadius: '9999px', background: '#ffedd5', zIndex: 0 }}></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fed7aa', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wheat size={16} />
                </div>
              </div>
              <div className="font-semibold uppercase tracking-wider relative z-10" style={{ fontSize: '12px', color: '#6b7280' }}>{t('dashboard.todayFeedCost')}</div>
              <div className="font-black mt-1 relative z-10" style={{ fontSize: '20px', color: '#1f2937' }}>{formatCurrency(todayFeedCost)}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group" style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden' }}>
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full -z-10`} style={{ position: 'absolute', top: 0, right: 0, width: '64px', height: '64px', borderBottomLeftRadius: '9999px', background: todayProfit >= 0 ? '#dcfce7' : '#fee2e2', zIndex: 0 }}></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: todayProfit >= 0 ? '#bbf7d0' : '#fecaca', color: todayProfit >= 0 ? '#16a34a' : '#dc2626' }}>
                  <Receipt size={16} />
                </div>
              </div>
              <div className="font-semibold uppercase tracking-wider relative z-10" style={{ fontSize: '12px', color: '#6b7280' }}>{t('dashboard.todayProfit')}</div>
              <div className="font-black mt-1 relative z-10" style={{ fontSize: '20px', color: todayProfit >= 0 ? '#16a34a' : '#dc2626' }}>
                {todayProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(todayProfit))}
              </div>
            </div>

          </div>
        </section>

        {/* Insights & Charts (Tabbed) */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2" style={{ fontSize: '15px', color: '#1f2937' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-primary-500)' }} /> {lang === 'bn' ? 'বিশ্লেষণ' : 'Insights'}
            </h2>
          </div>
          
          <div className="rounded-2xl shadow-sm p-4" style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '16px' }}>
            {/* Custom Tabs */}
            <div className="flex p-1 rounded-xl mb-6" style={{ background: '#f3f4f6', borderRadius: '12px', padding: '4px', display: 'flex', marginBottom: '24px' }}>
              <button 
                className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                style={{ flex: 1, padding: '8px 0', fontSize: '12px', fontWeight: 'bold', borderRadius: '8px', transition: 'all 0.2s', background: activeChart === 'milk' ? 'white' : 'transparent', color: activeChart === 'milk' ? 'var(--color-primary-500)' : '#6b7280', boxShadow: activeChart === 'milk' ? 'var(--shadow-sm)' : 'none' }}
                onClick={() => setActiveChart('milk')}
              >
                {t('dashboard.milkTrend')}
              </button>
              <button 
                className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                style={{ flex: 1, padding: '8px 0', fontSize: '12px', fontWeight: 'bold', borderRadius: '8px', transition: 'all 0.2s', background: activeChart === 'finance' ? 'white' : 'transparent', color: activeChart === 'finance' ? 'var(--color-primary-500)' : '#6b7280', boxShadow: activeChart === 'finance' ? 'var(--shadow-sm)' : 'none' }}
                onClick={() => setActiveChart('finance')}
              >
                {t('dashboard.incomeVsExpense')}
              </button>
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              {activeChart === 'milk' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={milkTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="milkGradPremium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2 }} />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      name={lang === 'bn' ? 'দুধ' : 'Milk'}
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fill="url(#milkGradPremium)"
                      activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpenseTrend} barGap={4} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="income" name={lang === 'bn' ? 'আয়' : 'Income'} fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="expense" name={lang === 'bn' ? 'খরচ' : 'Expense'} fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* FAB Quick Actions (Redesigned) */}
      <div className="fab-container">
        {fabOpen && (
          <div className="fab-menu">
            <button className="fab-menu-item bg-white" onClick={() => { setFabOpen(false); navigate('/milk/add'); }} style={{ background: 'white' }}>
              <span className="font-bold text-gray-700" style={{ color: '#374151', fontWeight: 'bold' }}>{t('dashboard.addMilk')}</span>
              <div className="fab-menu-item-icon shadow-sm" style={{ background: '#eff6ff', color: '#3b82f6' }}><Droplets size={16}/></div>
            </button>
            <button className="fab-menu-item bg-white" onClick={() => { setFabOpen(false); navigate('/feed/add'); }} style={{ background: 'white' }}>
              <span className="font-bold text-gray-700" style={{ color: '#374151', fontWeight: 'bold' }}>{t('dashboard.addFeed')}</span>
              <div className="fab-menu-item-icon shadow-sm" style={{ background: '#fff7ed', color: '#f97316' }}><Wheat size={16}/></div>
            </button>
            <button className="fab-menu-item bg-white" onClick={() => { setFabOpen(false); navigate('/finance/expense/add'); }} style={{ background: 'white' }}>
              <span className="font-bold text-gray-700" style={{ color: '#374151', fontWeight: 'bold' }}>{t('dashboard.addExpense')}</span>
              <div className="fab-menu-item-icon shadow-sm" style={{ background: '#fef2f2', color: '#ef4444' }}><Receipt size={16}/></div>
            </button>
            <button className="fab-menu-item bg-white" onClick={() => { setFabOpen(false); navigate('/cattle/add'); }} style={{ background: 'white' }}>
              <span className="font-bold text-gray-700" style={{ color: '#374151', fontWeight: 'bold' }}>{t('cattle.addCattle')}</span>
              <div className="fab-menu-item-icon shadow-sm" style={{ background: '#f0fdf4', color: '#22c55e' }}><Plus size={16}/></div>
            </button>
          </div>
        )}
        <button className="fab shadow-xl" onClick={() => setFabOpen(!fabOpen)} style={{ background: fabOpen ? '#4b5563' : 'linear-gradient(135deg, #2D7D46 0%, #1e3c27 100%)' }}>
          {fabOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
