// KhamarCare — Customers List Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, UserPlus, Phone, MapPin, Search } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore.js';
import useSalesStore from '../../stores/useSalesStore.js';
import useToastStore from '../../stores/useToastStore.js';

export default function CustomersPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const farm = useAuthStore(s => s.farm);
  const showToast = useToastStore(s => s.showToast);
  
  const { customers, addCustomer } = useSalesStore();

  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'individual' // individual, shop, company
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast(lang === 'bn' ? 'নাম প্রদান করুন' : 'Name is required', 'error');
      return;
    }

    try {
      await addCustomer({
        farmId: farm.id,
        ...formData
      });
      showToast(lang === 'bn' ? 'ক্রেতা যুক্ত হয়েছে' : 'Customer added successfully', 'success');
      setIsAdding(false);
      setFormData({ name: '', phone: '', address: '', type: 'individual' });
    } catch (err) {
      showToast('Error adding customer', 'error');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <header className="app-header">
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => navigate('/sales/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-header-title">{lang === 'bn' ? 'ক্রেতার তালিকা' : 'Customers Directory'}</span>
        <button className="btn btn-ghost btn-icon btn-icon-sm" onClick={() => setIsAdding(!isAdding)}>
          <UserPlus size={20} />
        </button>
      </header>

      <div className="page-content stagger-children">
        
        {isAdding && (
          <div className="card mb-6" style={{ border: '2px solid var(--color-primary)' }}>
            <h3 className="font-bold mb-3">{lang === 'bn' ? 'নতুন ক্রেতা' : 'New Customer'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="form-label">{lang === 'bn' ? 'ক্রেতার নাম' : 'Name'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">{lang === 'bn' ? 'ফোন নম্বর' : 'Phone'}</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="form-label">{lang === 'bn' ? 'ক্রেতার ধরন' : 'Type'}</label>
                  <select 
                    className="form-control" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="individual">{lang === 'bn' ? 'ব্যক্তিগত' : 'Individual'}</option>
                    <option value="shop">{lang === 'bn' ? 'দোকান/মিষ্টির দোকান' : 'Sweet Shop'}</option>
                    <option value="company">{lang === 'bn' ? 'ডেইরি কোম্পানি' : 'Dairy Company'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">{lang === 'bn' ? 'ঠিকানা' : 'Address'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button type="button" className="btn btn-outline flex-1" onClick={() => setIsAdding(false)}>
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {lang === 'bn' ? 'সেভ করুন' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        {!isAdding && (
          <div className="mb-4 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              className="form-control" 
              style={{ paddingLeft: 36 }}
              placeholder={lang === 'bn' ? 'নাম বা নম্বর দিয়ে খুঁজুন...' : 'Search customers...'} 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* List */}
        <div className="flex flex-col gap-3">
          {filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <p>{lang === 'bn' ? 'কোনো ক্রেতা পাওয়া যায়নি' : 'No customers found'}</p>
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <div key={customer.id} className="card p-3 flex gap-3 items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-gray-100"
                >
                  {customer.type === 'shop' ? '🏪' : customer.type === 'company' ? '🏭' : '👤'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{customer.name}</h4>
                  {customer.phone && (
                    <div className="text-sm text-secondary flex items-center gap-1 mt-1">
                      <Phone size={12} /> {customer.phone}
                    </div>
                  )}
                  {customer.address && (
                    <div className="text-sm text-secondary flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {customer.address}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}
