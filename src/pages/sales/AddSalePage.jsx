// KhamarCare — Add Milk Sale Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useSalesStore from '../../stores/useSalesStore.js';
import useToastStore from '../../stores/useToastStore.js';

export default function AddSalePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const showToast = useToastStore(s => s.showToast);
  
  const { customers, loadCustomers, addSale } = useSalesStore();

  useEffect(() => {
    if (farm?.id && customers.length === 0) {
      loadCustomers(farm.id);
    }
  }, [farm, customers.length]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    quantityLiters: '',
    pricePerLiter: farm?.settings?.milkPrice || 60,
    paymentStatus: 'paid'
  });

  const totalAmount = (Number(formData.quantityLiters) || 0) * (Number(formData.pricePerLiter) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.quantityLiters || !formData.pricePerLiter) {
      showToast(lang === 'bn' ? 'সব তথ্য পূরণ করুন' : 'Fill all required fields', 'error');
      return;
    }

    try {
      await addSale({
        farmId: farm.id,
        date: formData.date,
        customerId: Number(formData.customerId),
        quantityLiters: Number(formData.quantityLiters),
        pricePerLiter: Number(formData.pricePerLiter),
        totalAmount: totalAmount,
        paymentStatus: formData.paymentStatus
      });
      showToast(lang === 'bn' ? 'বিক্রি রেকর্ড করা হয়েছে' : 'Sale recorded successfully', 'success');
      navigate('/sales/dashboard');
    } catch (err) {
      showToast('Error recording sale', 'error');
    }
  };

  return (
    <div className="page">
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'দুধ বিক্রি এন্ট্রি' : 'Record Milk Sale'}</span>
        <div style={{ width: 36 }} />
      </header>

      <div className="page-content stagger-children">
        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div>
              <label className="form-label">{lang === 'bn' ? 'তারিখ' : 'Date'}</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})}
                required 
              />
            </div>

            <div>
              <label className="form-label flex justify-between">
                {lang === 'bn' ? 'ক্রেতা নির্বাচন করুন' : 'Select Customer'}
                <button type="button" className="text-primary text-xs" onClick={() => navigate('/sales/customers')}>
                  + {lang === 'bn' ? 'নতুন ক্রেতা' : 'New'}
                </button>
              </label>
              <select 
                className="form-control" 
                value={formData.customerId} 
                onChange={e => setFormData({...formData, customerId: e.target.value})}
                required
              >
                <option value="">{lang === 'bn' ? '-- নির্বাচন করুন --' : '-- Select --'}</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.type === 'shop' ? '(দোকান)' : ''}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">{lang === 'bn' ? 'পরিমাণ (লিটার)' : 'Quantity (L)'}</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-control" 
                  placeholder="0.0"
                  value={formData.quantityLiters} 
                  onChange={e => setFormData({...formData, quantityLiters: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="form-label">{lang === 'bn' ? 'দাম/লিটার (৳)' : 'Price/L (৳)'}</label>
                <input 
                  type="number" 
                  step="0.5"
                  className="form-control" 
                  value={formData.pricePerLiter} 
                  onChange={e => setFormData({...formData, pricePerLiter: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="p-4 rounded-xl text-center mt-2" style={{ background: 'var(--color-primary-light)' }}>
              <div className="text-sm text-secondary">{lang === 'bn' ? 'মোট বিল' : 'Total Bill'}</div>
              <div className="text-3xl font-bold text-primary mt-1">৳ {totalAmount.toFixed(2)}</div>
            </div>

            <div>
              <label className="form-label">{lang === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}</label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  className={`btn flex-1 ${formData.paymentStatus === 'paid' ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setFormData({...formData, paymentStatus: 'paid'})}
                >
                  {lang === 'bn' ? 'নগদ জমা' : 'Paid in Full'}
                </button>
                <button 
                  type="button" 
                  className={`btn flex-1 ${formData.paymentStatus === 'pending' ? 'btn-warning' : 'btn-outline'}`}
                  style={formData.paymentStatus === 'pending' ? { color: '#fff' } : {}}
                  onClick={() => setFormData({...formData, paymentStatus: 'pending'})}
                >
                  {lang === 'bn' ? 'বকেয়া' : 'Pending/Due'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full mt-4">
              {lang === 'bn' ? 'বিক্রি সেভ করুন' : 'Save Sale'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
