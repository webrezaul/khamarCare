// KhamarCare — Sales Dashboard Page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useSalesStore from '../../stores/useSalesStore.js';
import { formatDate } from '../../utils/dateUtils.js';

export default function SalesDashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  
  const { sales, customers, loadSales, loadCustomers, updatePaymentStatus } = useSalesStore();

  useEffect(() => {
    if (farm?.id) {
      loadSales(farm.id);
      loadCustomers(farm.id);
    }
  }, [farm]);

  // Calculations
  const today = new Date().toISOString().split('T')[0];
  const todaysSales = sales.filter(s => s.date === today);
  const todaysRevenue = todaysSales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
  const pendingPayments = sales.filter(s => s.paymentStatus === 'pending');
  const pendingAmount = pendingPayments.reduce((sum, s) => sum + Number(s.totalAmount), 0);

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === Number(id));
    return customer ? customer.name : (lang === 'bn' ? 'অজানা' : 'Unknown');
  };

  const handleTogglePayment = (sale) => {
    const newStatus = sale.paymentStatus === 'paid' ? 'pending' : 'paid';
    updatePaymentStatus(sale.id, newStatus);
  };

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate('/more')}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'দুধ বিক্রি' : 'Milk Sales'}</span>
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate('/sales/customers')}>
          <Users size={20} />
        </button>
      </header>

      <div className="page-content stagger-children">
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card text-center" style={{ background: '#E8F5E9', border: 'none' }}>
            <div className="text-secondary text-sm mb-1">{lang === 'bn' ? 'আজকের বিক্রি' : 'Today Sales'}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>৳ {todaysRevenue.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</div>
            <div className="text-xs text-secondary mt-1">{todaysSales.length} {lang === 'bn' ? 'টি ডেলিভারি' : 'Deliveries'}</div>
          </div>
          <div className="card text-center" style={{ background: '#FFF3E0', border: 'none' }}>
            <div className="text-secondary text-sm mb-1">{lang === 'bn' ? 'বকেয়া পাওনা' : 'Pending Dues'}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>৳ {pendingAmount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</div>
            <div className="text-xs text-secondary mt-1">{pendingPayments.length} {lang === 'bn' ? 'টি বিল' : 'Bills'}</div>
          </div>
        </div>

        {/* Action Button */}
        <button className="btn btn-primary btn-full mb-6" onClick={() => navigate('/sales/add')}>
          <Plus size={18} style={{ marginRight: 8 }} />
          {lang === 'bn' ? 'নতুন বিক্রি যোগ করুন' : 'Record New Sale'}
        </button>

        {/* Recent Sales List */}
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp size={18} color="var(--color-primary)" />
          {lang === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}
        </h3>

        {sales.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🥛</div>
            <p>{lang === 'bn' ? 'কোনো বিক্রির রেকর্ড পাওয়া যায়নি' : 'No sales records found'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sales.slice(0, 20).map((sale) => (
              <div key={sale.id} className="card p-3 flex justify-between items-center" style={{ borderLeft: `4px solid ${sale.paymentStatus === 'paid' ? 'var(--color-success)' : 'var(--color-warning)'}` }}>
                <div>
                  <div className="font-bold">{getCustomerName(sale.customerId)}</div>
                  <div className="text-sm text-secondary flex gap-2 items-center">
                    <span>{formatDate(sale.date)}</span> • <span>{sale.quantityLiters} L</span>
                  </div>
                  <div className="text-primary font-bold mt-1">৳ {sale.totalAmount}</div>
                </div>
                
                <button 
                  className={`btn btn-sm ${sale.paymentStatus === 'paid' ? 'btn-success' : 'btn-outline'}`}
                  style={{ borderRadius: 20, padding: '4px 12px' }}
                  onClick={() => handleTogglePayment(sale)}
                >
                  {sale.paymentStatus === 'paid' ? (
                    <><CheckCircle size={14} className="mr-1 inline" /> {lang === 'bn' ? 'পরিশোধিত' : 'Paid'}</>
                  ) : (
                    <><Clock size={14} className="mr-1 inline" /> {lang === 'bn' ? 'বকেয়া' : 'Pending'}</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
