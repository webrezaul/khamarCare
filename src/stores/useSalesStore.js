// KhamarCare — Sales & Distribution Store (Zustand)
import { create } from 'zustand';
import db from '../db/database.js';

const useSalesStore = create((set, get) => ({
  customers: [],
  sales: [],
  loading: false,

  // Load Customers
  loadCustomers: async (farmId) => {
    try {
      set({ loading: true });
      const data = await db.customers.where('farmId').equals(farmId).toArray();
      set({ customers: data, loading: false });
    } catch (error) {
      console.error('Failed to load customers', error);
      set({ loading: false });
    }
  },

  // Add Customer
  addCustomer: async (customerData) => {
    try {
      const id = await db.customers.add(customerData);
      set((state) => ({
        customers: [...state.customers, { ...customerData, id }]
      }));
      return id;
    } catch (error) {
      console.error('Failed to add customer', error);
      throw error;
    }
  },

  // Load Sales
  loadSales: async (farmId) => {
    try {
      set({ loading: true });
      const data = await db.milk_sales.where('farmId').equals(farmId).reverse().sortBy('date');
      set({ sales: data, loading: false });
    } catch (error) {
      console.error('Failed to load sales', error);
      set({ loading: false });
    }
  },

  // Add Sale
  addSale: async (saleData) => {
    try {
      const id = await db.milk_sales.add(saleData);
      
      // We also want to record this in income_records for unified finance tracking!
      await db.income_records.add({
        farmId: saleData.farmId,
        date: saleData.date,
        amount: saleData.totalAmount,
        category: 'milk_sale',
        notes: `Sale to Customer #${saleData.customerId} (${saleData.quantityLiters}L)`,
        createdAt: new Date().toISOString()
      });

      set((state) => ({
        sales: [{ ...saleData, id }, ...state.sales]
      }));
      return id;
    } catch (error) {
      console.error('Failed to record sale', error);
      throw error;
    }
  },
  
  // Update Payment Status
  updatePaymentStatus: async (saleId, status) => {
    try {
      await db.milk_sales.update(saleId, { paymentStatus: status });
      set((state) => ({
        sales: state.sales.map(s => s.id === saleId ? { ...s, paymentStatus: status } : s)
      }));
    } catch (error) {
      console.error('Failed to update payment status', error);
    }
  }
}));

export default useSalesStore;
