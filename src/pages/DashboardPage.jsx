// KhamarCare — Premium Dashboard Page (Main Screen)
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Bell, Milk, Wheat, Receipt, Heart, Flame, X, ChevronRight, Droplets, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import useAuthStore from '../stores/useAuthStore.js';
import useFarmStore from '../stores/useFarmStore.js';
import { formatCurrency, formatLiter } from '../utils/formatters.js';
import { calcProfitabilityScore, calcCostPerLiter, calcProfitPerLiter } from '../utils/calculations.js';

// SVG Gauge Component
const CircularGauge = ({ score, level, lang }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const colors = {
    excellent: '#43A047',
    good: '#FF8F00',
    needsAttention: '#E53935'
  };
  const color = colors[level];

  return (
    <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={radius} stroke="#e0e0e0" strokeWidth="8" fill="none" />
        <circle 
          cx="60" cy="60" r={radius} 
          stroke={color} strokeWidth="8" fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: '#666' }}>{lang === 'bn' ? 'স্কোর' : 'Score'}</span>
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
  const monthProfit = monthIncome - monthExpense;

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

  const costPerLiter = calcCostPerLiter(monthExpense, monthlyMilk);
  const profitPerLiter = calcProfitPerLiter(milkPrice, costPerLiter);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip-glass">
          <p className="font-semibold text-primary mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: 13, fontWeight: 600 }}>
              {entry.name}: {entry.name === 'Milk' || entry.name === 'দুধ' ? formatLiter(entry.value, lang) : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page" style={{ background: '#f8faf9' }}>
      
      {/* App Header (Glassy) */}
      <header className="app-header" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
        <div>
          <div className="app-header-title text-gradient">{farm?.name || t('app.name')}</div>
          <div className="app-header-subtitle font-medium">
            {t('common.greeting', { name: user?.name || '' })} 👋
          </div>
        </div>
        <div className="app-header-actions">
          <div className="lang-toggle shadow-sm">
            <button className={`lang-toggle-btn ${lang === 'bn' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('bn')}>বাং</button>
            <button className={`lang-toggle-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('en')}>EN</button>
          </div>
          <button className="btn btn-icon btn-ghost btn-icon-sm" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
            <Bell size={20} />
            {alerts.length > 0 && <span className="notification-badge shadow-md">{alerts.length}</span>}
          </button>
        </div>
      </header>

      <div className="page-content stagger-children pb-24">
        
        {/* Premium Hero Banner */}
        <div className="card hero-gradient shadow-lg mb-6 animate-fade-in-up" onClick={() => navigate('/cattle')} style={{ cursor: 'pointer' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-white/80 text-sm font-medium">{lang === 'bn' ? 'মোট গবাদিপশু' : 'Total Cattle'}</h2>
              <div className="text-5xl font-extrabold text-white tracking-tight">{totalCattle}</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <span className="text-3xl">🐄</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xs text-white/70 mb-1">{lang === 'bn' ? 'দুধেল' : 'Lactating'}</div>
              <div className="font-bold text-lg text-white">{lactating}</div>
            </div>
            <div className="text-center border-l border-white/20">
              <div className="text-xs text-white/70 mb-1">{lang === 'bn' ? 'গর্ভবতী' : 'Pregnant'}</div>
              <div className="font-bold text-lg text-white">{pregnant}</div>
            </div>
            <div className="text-center border-l border-white/20">
              <div className="text-xs text-white/70 mb-1">{lang === 'bn' ? 'বকনা' : 'Heifers'}</div>
              <div className="font-bold text-lg text-white">{heifers}</div>
            </div>
            <div className="text-center border-l border-white/20">
              <div className="text-xs text-white/70 mb-1">{lang === 'bn' ? 'বাছুর' : 'Calves'}</div>
              <div className="font-bold text-lg text-white">{calves}</div>
            </div>
          </div>
        </div>

        {/* Glassmorphic Today's Stats */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <TrendingUp size={20} /> {t('dashboard.todayStats')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            
            <div className="glass-card glow-primary flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <Droplets size={16} fill="currentColor" opacity={0.8} />
                <span className="text-xs font-semibold">{t('dashboard.todayMilk')}</span>
              </div>
              <div className="text-2xl font-black mt-1 text-primary">{formatLiter(todayMilk, lang)}</div>
            </div>
            
            <div className="glass-card glow-success flex flex-col gap-1">
              <div className="flex items-center gap-2 text-success">
                <DollarSign size={16} />
                <span className="text-xs font-semibold">{t('dashboard.todayIncome')}</span>
              </div>
              <div className="text-2xl font-black mt-1 text-success">{formatCurrency(todayIncome)}</div>
            </div>

            <div className="glass-card glow-warning flex flex-col gap-1">
              <div className="flex items-center gap-2 text-warning">
                <Wheat size={16} />
                <span className="text-xs font-semibold">{t('dashboard.todayFeedCost')}</span>
              </div>
              <div className="text-2xl font-black mt-1 text-warning">{formatCurrency(todayFeedCost)}</div>
            </div>

            <div className={`glass-card ${todayProfit >= 0 ? 'glow-success' : 'glow-danger'} flex flex-col gap-1`}>
              <div className={`flex items-center gap-2 ${todayProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                <Receipt size={16} />
                <span className="text-xs font-semibold">{t('dashboard.todayProfit')}</span>
              </div>
              <div className={`text-2xl font-black mt-1 ${todayProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                {todayProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(todayProfit))}
              </div>
            </div>

          </div>
        </section>

        {/* Profitability Gauge */}
        <section className="mb-8">
          <div className="glass-card glow-primary p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-primary mb-1">{t('dashboard.profitability')}</h2>
              <p className="text-xs text-secondary mb-3 leading-relaxed max-w-[160px]">
                {profScore.explanation[lang]}
              </p>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm`} 
                   style={{ background: profScore.level === 'excellent' ? '#43A047' : profScore.level === 'good' ? '#FF8F00' : '#E53935' }}>
                {t(`dashboard.${profScore.level}`)}
              </div>
            </div>
            
            <CircularGauge score={profScore.score} level={profScore.level} lang={lang} />
          </div>
        </section>

        {/* Premium Charts */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Droplets size={20} /> {t('dashboard.milkTrend')}
          </h2>
          <div className="glass-card p-4 pt-6 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={milkTrend}>
                <defs>
                  <linearGradient id="milkGradPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#43A047" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#43A047" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(67, 160, 71, 0.2)', strokeWidth: 2 }} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name={lang === 'bn' ? 'দুধ' : 'Milk'}
                  stroke="#43A047" 
                  strokeWidth={4} 
                  fill="url(#milkGradPremium)"
                  activeDot={{ r: 6, fill: '#43A047', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <DollarSign size={20} /> {t('dashboard.incomeVsExpense')}
          </h2>
          <div className="glass-card p-4 pt-6 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseTrend} barGap={4}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="income" name={lang === 'bn' ? 'আয়' : 'Income'} fill="#43A047" radius={[6, 6, 0, 0]} maxBarSize={30} />
                <Bar dataKey="expense" name={lang === 'bn' ? 'খরচ' : 'Expense'} fill="#E53935" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Alerts Section (Glassmorphic) */}
        {alerts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <Bell size={20} /> {t('dashboard.alerts')}
              </h2>
              <button className="text-primary text-sm font-semibold" onClick={() => navigate('/notifications')}>
                {t('common.viewAll')}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.slice(0, 3).map((n) => (
                <div key={n.id} className={`glass-card p-4 flex gap-4 items-center border-l-4 ${n.type === 'calving' ? 'border-l-warning' : n.type === 'feed_stock' ? 'border-l-danger' : 'border-l-info'}`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-100/50 shadow-sm shrink-0">
                    {n.type === 'calving' ? '🤰' : n.type === 'vaccination' ? '💉' : n.type === 'feed_stock' ? '⚠️' : '🔔'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary">{lang === 'bn' ? n.title : (n.titleEn || n.title)}</h4>
                    <p className="text-xs text-secondary mt-1">{lang === 'bn' ? n.message : (n.messageEn || n.message)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* FAB Quick Actions */}
      <div className="fab-container">
        {fabOpen && (
          <div className="fab-menu">
            <button className="fab-menu-item" onClick={() => { setFabOpen(false); navigate('/milk/add'); }}>
              <span>{t('dashboard.addMilk')}</span>
              <div className="fab-menu-item-icon" style={{ background: '#E3F2FD' }}>🥛</div>
            </button>
            <button className="fab-menu-item" onClick={() => { setFabOpen(false); navigate('/feed/add'); }}>
              <span>{t('dashboard.addFeed')}</span>
              <div className="fab-menu-item-icon" style={{ background: '#FFF3E0' }}>🌾</div>
            </button>
            <button className="fab-menu-item" onClick={() => { setFabOpen(false); navigate('/finance/expense/add'); }}>
              <span>{t('dashboard.addExpense')}</span>
              <div className="fab-menu-item-icon" style={{ background: '#FFEBEE' }}>💸</div>
            </button>
            <button className="fab-menu-item" onClick={() => { setFabOpen(false); navigate('/cattle/add'); }}>
              <span>{t('cattle.addCattle')}</span>
              <div className="fab-menu-item-icon" style={{ background: '#E8F5E9' }}>🐄</div>
            </button>
          </div>
        )}
        <button className="fab shadow-xl" onClick={() => setFabOpen(!fabOpen)}>
          {fabOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>
    </div>
  );
}
