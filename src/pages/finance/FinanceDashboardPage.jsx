// KhamarCare — Finance Dashboard Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useFarmStore from '../../stores/useFarmStore.js';
import { formatCurrency } from '../../utils/formatters.js';
import { calcCostPerLiter, calcProfitPerLiter, calcProfitMargin } from '../../utils/calculations.js';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CHART_COLORS } from '../../config/constants.js';

export default function FinanceDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const {
    getMonthlyIncome, getMonthlyExpense, getMonthlyExpenseByCategory,
    getTodayIncome, getTodayExpense, milkRecords, settings,
    incomeRecords, expenseRecords,
  } = useFarmStore();

  const monthIncome = getMonthlyIncome();
  const monthExpense = getMonthlyExpense();
  const monthProfit = monthIncome - monthExpense;
  const todayIncome = getTodayIncome();
  const todayExpense = getTodayExpense();
  const milkPrice = Number(settings.milkPricePerLiter) || 50;
  const totalMilk = milkRecords.reduce((s, r) => s + (r.totalMilk || 0), 0);
  const costPerLiter = calcCostPerLiter(monthExpense, totalMilk);
  const profitPerLiter = calcProfitPerLiter(milkPrice, costPerLiter);
  const profitMargin = calcProfitMargin(monthIncome, monthExpense);

  // Expense by category for pie chart
  const expByCategory = getMonthlyExpenseByCategory();
  const pieData = Object.entries(expByCategory)
    .map(([cat, amount]) => {
      const catInfo = EXPENSE_CATEGORIES.find(c => c.id === cat);
      return {
        name: catInfo ? (lang === 'bn' ? catInfo.bn : catInfo.en) : cat,
        value: amount,
        icon: catInfo?.icon || '📋',
      };
    })
    .sort((a, b) => b.value - a.value);

  // Income by category
  const incByCategory = {};
  incomeRecords.forEach(r => {
    incByCategory[r.category] = (incByCategory[r.category] || 0) + r.amount;
  });

  return (
    <div className="page">
      <header className="app-header">
        <div><div className="app-header-title">{t('finance.title')}</div></div>
        <div className="app-header-actions">
          <button className="btn btn-sm" style={{ background: '#E8F5E9', color: '#43A047' }} onClick={() => navigate('/finance/income/add')}>
            <Plus size={16} /> {lang === 'bn' ? 'আয়' : 'Income'}
          </button>
          <button className="btn btn-sm" style={{ background: '#FFEBEE', color: '#E53935' }} onClick={() => navigate('/finance/expense/add')}>
            <Plus size={16} /> {lang === 'bn' ? 'খরচ' : 'Expense'}
          </button>
        </div>
      </header>

      <div className="page-content stagger-children">
        {/* Summary Cards */}
        <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #1B5E20, #2D7D46)', color: 'white', border: 'none' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 4 }}>{t('finance.totalIncome')}</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{formatCurrency(monthIncome)}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 4 }}>{t('finance.totalExpense')}</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{formatCurrency(monthExpense)}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 4 }}>{monthProfit >= 0 ? t('finance.netProfit') : t('finance.netLoss')}</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: monthProfit >= 0 ? '#81C784' : '#EF9A9A' }}>
                {monthProfit >= 0 ? '+' : ''}{formatCurrency(monthProfit)}
              </div>
            </div>
          </div>
        </div>

        {/* Cost per Liter */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">📊 {lang === 'bn' ? 'প্রতি লিটার বিশ্লেষণ' : 'Per Liter Analysis'}</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('finance.sellingPrice')}</span>
            <span className="font-semibold text-success">{formatCurrency(milkPrice)}/{lang === 'bn' ? 'লি.' : 'L'}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary">{t('finance.costPerLiter')}</span>
            <span className="font-semibold text-danger">{formatCurrency(costPerLiter)}/{lang === 'bn' ? 'লি.' : 'L'}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 4 }}>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('finance.profitPerLiter')}</span>
              <span className="font-bold" style={{ fontSize: 'var(--text-xl)', color: profitPerLiter >= 0 ? '#43A047' : '#E53935' }}>
                {formatCurrency(profitPerLiter)}/{lang === 'bn' ? 'লি.' : 'L'}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-secondary text-sm">{t('finance.profitMargin')}</span>
            <span className="font-medium" style={{ color: profitMargin >= 0 ? '#43A047' : '#E53935' }}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Expense Breakdown Pie */}
        {pieData.length > 0 && (
          <section className="mb-4">
            <div className="section-header">
              <h3 className="section-title">{t('finance.expenseCategories')}</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {pieData.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span>{item.icon} {item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Transactions */}
        <section className="mb-4">
          <div className="section-header">
            <h3 className="section-title">{lang === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}</h3>
          </div>
          <div className="card">
            {[...incomeRecords, ...expenseRecords]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((record, i) => {
                const isIncome = !!INCOME_CATEGORIES.find(c => c.id === record.category);
                return (
                  <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: i < 9 ? '1px solid var(--border-color)' : 'none' }}>
                    <div>
                      <div className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>{record.description || record.category}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{record.date}</div>
                    </div>
                    <span className="font-semibold" style={{ color: isIncome ? '#43A047' : '#E53935' }}>
                      {isIncome ? '+' : '-'}{formatCurrency(record.amount)}
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
