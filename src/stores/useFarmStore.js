// KhamarCare — Zustand Farm Data Store (Cattle, Milk, Feed, Finance)
import { create } from 'zustand';
import db from '../db/database.js';
import { todayStr, getLast7Days, getLast30Days } from '../utils/dateUtils.js';
import { generatePredictions } from '../utils/predictions.js';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';

const useFarmStore = create((set, get) => ({
  // ========= ANIMALS =========
  animals: [],
  animalsLoading: false,

  loadAnimals: async (farmId) => {
    set({ animalsLoading: true });
    try {
      const animals = await db.animals.where('farmId').equals(farmId).and(a => !a.isDeleted).toArray();
      set({ animals, animalsLoading: false });
      return animals;
    } catch (err) {
      console.error('Load animals error:', err);
      set({ animalsLoading: false });
      return [];
    }
  },

  addAnimal: async (animalData) => {
    try {
      const id = await db.animals.add({
        ...animalData,
        isDeleted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const animal = await db.animals.get(id);
      set(s => ({ animals: [...s.animals, animal] }));
      return animal;
    } catch (err) {
      console.error('Add animal error:', err);
      return null;
    }
  },

  updateAnimal: async (id, updates) => {
    try {
      await db.animals.update(id, { ...updates, updatedAt: new Date().toISOString() });
      const animal = await db.animals.get(id);
      set(s => ({ animals: s.animals.map(a => a.id === id ? animal : a) }));
      return animal;
    } catch (err) {
      console.error('Update animal error:', err);
      return null;
    }
  },

  deleteAnimal: async (id) => {
    try {
      await db.animals.update(id, { isDeleted: 1, updatedAt: new Date().toISOString() });
      set(s => ({ animals: s.animals.filter(a => a.id !== id) }));
      return true;
    } catch (err) {
      console.error('Delete animal error:', err);
      return false;
    }
  },

  getAnimalById: (id) => get().animals.find(a => a.id === id),

  getAnimalsByType: (type) => get().animals.filter(a => a.animalType === type),

  getAnimalsByStatus: (status) => get().animals.filter(a => a.status === status),

  // ========= MILK RECORDS =========
  milkRecords: [],
  milkLoading: false,

  loadMilkRecords: async (farmId, days = 30) => {
    set({ milkLoading: true });
    try {
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      const records = await db.milk_records
        .where('[farmId+date]')
        .between([farmId, startDate], [farmId, '\uffff'])
        .toArray();
      set({ milkRecords: records, milkLoading: false });
      return records;
    } catch (err) {
      console.error('Load milk error:', err);
      set({ milkLoading: false });
      return [];
    }
  },

  addMilkRecord: async (record) => {
    try {
      const id = await db.milk_records.add({
        ...record,
        createdAt: new Date().toISOString(),
      });
      const milkRecord = await db.milk_records.get(id);
      set(s => ({ milkRecords: [...s.milkRecords, milkRecord] }));
      return milkRecord;
    } catch (err) {
      console.error('Add milk error:', err);
      return null;
    }
  },

  updateMilkRecord: async (id, updates) => {
    try {
      await db.milk_records.update(id, updates);
      const record = await db.milk_records.get(id);
      set(s => ({ milkRecords: s.milkRecords.map(r => r.id === id ? record : r) }));
      return record;
    } catch (err) {
      console.error('Update milk error:', err);
      return null;
    }
  },

  deleteMilkRecord: async (id) => {
    try {
      await db.milk_records.delete(id);
      set(s => ({ milkRecords: s.milkRecords.filter(r => r.id !== id) }));
      return true;
    } catch (err) {
      return false;
    }
  },

  getTodayMilk: () => {
    const today = todayStr();
    return get().milkRecords.filter(r => r.date === today);
  },

  getTodayTotalMilk: () => {
    const today = todayStr();
    return get().milkRecords
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + (r.totalMilk || 0), 0);
  },

  getMilkByDate: (date) => {
    return get().milkRecords.filter(r => r.date === date);
  },

  getDailyMilkTrend: (days = 7) => {
    const dates = days === 7 ? getLast7Days() : getLast30Days();
    const records = get().milkRecords;
    return dates.map(date => {
      const dayRecords = records.filter(r => r.date === date);
      const total = dayRecords.reduce((sum, r) => sum + (r.totalMilk || 0), 0);
      return { date, total: +total.toFixed(1), label: format(new Date(date), 'dd/MM') };
    });
  },

  getCowMilkComparison: () => {
    const records = get().milkRecords;
    const animals = get().animals.filter(a => a.status === 'lactating');
    return animals.map(cow => {
      const cowRecords = records.filter(r => r.animalId === cow.id);
      const totalMilk = cowRecords.reduce((sum, r) => sum + (r.totalMilk || 0), 0);
      const avgMilk = cowRecords.length > 0 ? +(totalMilk / cowRecords.length).toFixed(1) : 0;
      return { ...cow, totalMilk: +totalMilk.toFixed(1), avgMilk, recordCount: cowRecords.length };
    }).sort((a, b) => b.avgMilk - a.avgMilk);
  },

  // ========= FEED RECORDS =========
  feedTypes: [],
  feedInventory: [],
  feedConsumption: [],
  feedLoading: false,

  loadFeedData: async (farmId) => {
    set({ feedLoading: true });
    try {
      const feedTypes = await db.feed_types.where('farmId').equals(farmId).toArray();
      const feedInventory = await db.feed_inventory.where('farmId').equals(farmId).toArray();
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const feedConsumption = await db.feed_consumption
        .where('[farmId+date]')
        .between([farmId, startDate], [farmId, '\uffff'])
        .toArray();
      set({ feedTypes, feedInventory, feedConsumption, feedLoading: false });
    } catch (err) {
      console.error('Load feed error:', err);
      set({ feedLoading: false });
    }
  },

  addFeedConsumption: async (record) => {
    try {
      const id = await db.feed_consumption.add({
        ...record,
        createdAt: new Date().toISOString(),
      });
      const rec = await db.feed_consumption.get(id);
      set(s => ({ feedConsumption: [...s.feedConsumption, rec] }));
      return rec;
    } catch (err) {
      console.error('Add feed error:', err);
      return null;
    }
  },

  getTodayFeedCost: () => {
    const today = todayStr();
    return get().feedConsumption
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + (r.cost || 0), 0);
  },

  getMonthlyFeedCost: () => {
    const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    return get().feedConsumption
      .filter(r => r.date >= start)
      .reduce((sum, r) => sum + (r.cost || 0), 0);
  },

  getLowStockItems: () => {
    const { feedInventory, feedTypes } = get();
    return feedInventory
      .filter(inv => inv.currentStock <= inv.minStock)
      .map(inv => {
        const feedType = feedTypes.find(ft => ft.id === inv.feedTypeId);
        return { ...inv, feedType };
      });
  },

  getAlerts: () => {
    const alerts = [];
    const { feedInventory, feedTypes } = get();

    // Low stock alerts
    feedInventory.forEach(inv => {
      if (inv.currentStock <= inv.minStock) {
        const ft = feedTypes.find(f => f.id === inv.feedTypeId);
        alerts.push({
          id: `feed_${inv.id}`,
          type: 'feed_stock',
          title: `${ft?.nameBn || 'খাদ্য'} এর স্টক কমে গেছে`,
          titleEn: `Low stock for ${ft?.name || 'Feed'}`,
          message: `বর্তমান স্টক: ${inv.currentStock} ${inv.unit}। আরও ক্রয় করুন।`,
          messageEn: `Current stock: ${inv.currentStock} ${inv.unit}. Please purchase more.`,
          priority: 'medium',
        });
      }
    });

    // Predictive AI Alerts (Milk drops, heat cycles, dry periods)
    const aiAlerts = generatePredictions(get().animals, get().milkRecords, get().settings);
    aiAlerts.forEach((aiAlert, index) => {
      alerts.push({
        id: `ai_${aiAlert.type}_${aiAlert.animalId}_${index}`,
        type: aiAlert.type,
        title: aiAlert.titleBn,
        titleEn: aiAlert.titleEn,
        message: aiAlert.messageBn,
        messageEn: aiAlert.messageEn,
        priority: aiAlert.priority,
      });
    });

    return alerts;
  },

  updateFeedInventory: async (id, updates) => {
    try {
      await db.feed_inventory.update(id, { ...updates, lastUpdated: new Date().toISOString() });
      const inv = await db.feed_inventory.get(id);
      set(s => ({ feedInventory: s.feedInventory.map(i => i.id === id ? inv : i) }));
      return inv;
    } catch (err) {
      return null;
    }
  },

  // ========= FINANCE =========
  incomeRecords: [],
  expenseRecords: [],
  financeLoading: false,

  loadFinanceData: async (farmId) => {
    set({ financeLoading: true });
    try {
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const incomeRecords = await db.income_records
        .where('[farmId+date]')
        .between([farmId, startDate], [farmId, '\uffff'])
        .toArray();
      const expenseRecords = await db.expense_records
        .where('[farmId+date]')
        .between([farmId, startDate], [farmId, '\uffff'])
        .toArray();
      set({ incomeRecords, expenseRecords, financeLoading: false });
    } catch (err) {
      console.error('Load finance error:', err);
      set({ financeLoading: false });
    }
  },

  addIncome: async (record) => {
    try {
      const id = await db.income_records.add({
        ...record,
        createdAt: new Date().toISOString(),
      });
      const rec = await db.income_records.get(id);
      set(s => ({ incomeRecords: [...s.incomeRecords, rec] }));
      return rec;
    } catch (err) {
      console.error('Add income error:', err);
      return null;
    }
  },

  addExpense: async (record) => {
    try {
      const id = await db.expense_records.add({
        ...record,
        createdAt: new Date().toISOString(),
      });
      const rec = await db.expense_records.get(id);
      set(s => ({ expenseRecords: [...s.expenseRecords, rec] }));
      return rec;
    } catch (err) {
      console.error('Add expense error:', err);
      return null;
    }
  },

  getTodayIncome: () => {
    const today = todayStr();
    return get().incomeRecords
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  },

  getTodayExpense: () => {
    const today = todayStr();
    return get().expenseRecords
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  },

  getMonthlyIncome: () => {
    const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    return get().incomeRecords
      .filter(r => r.date >= start)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  },

  getMonthlyExpense: () => {
    const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    return get().expenseRecords
      .filter(r => r.date >= start)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  },

  getMonthlyExpenseByCategory: () => {
    const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const expenses = get().expenseRecords.filter(r => r.date >= start);
    const byCategory = {};
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    return byCategory;
  },

  getIncomeVsExpenseTrend: () => {
    const dates = getLast7Days();
    const { incomeRecords, expenseRecords } = get();
    return dates.map(date => {
      const income = incomeRecords.filter(r => r.date === date).reduce((s, r) => s + r.amount, 0);
      const expense = expenseRecords.filter(r => r.date === date).reduce((s, r) => s + r.amount, 0);
      return { date, income, expense, label: format(new Date(date), 'dd/MM') };
    });
  },

  // ========= PREGNANCY / NOTIFICATIONS (read-only for dashboard) =========
  pregnancyRecords: [],
  notifications: [],

  loadPregnancyRecords: async (farmId) => {
    try {
      const records = await db.pregnancy_records.where('farmId').equals(farmId).toArray();
      set({ pregnancyRecords: records });
    } catch (err) {
      console.error('Load pregnancy error:', err);
    }
  },

  loadNotifications: async (farmId) => {
    try {
      const records = await db.notifications.where('farmId').equals(farmId).toArray();
      set({ notifications: records.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)) });
    } catch (err) {
      console.error('Load notifications error:', err);
    }
  },

  getUnreadNotifications: () => {
    return get().notifications.filter(n => !n.isRead);
  },

  markNotificationRead: async (id) => {
    try {
      await db.notifications.update(id, { isRead: 1 });
      set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: 1 } : n) }));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  },

  // ========= SETTINGS =========
  settings: {},

  loadSettings: async (farmId) => {
    try {
      const settingsArr = await db.settings.where('farmId').equals(farmId).toArray();
      const settings = {};
      settingsArr.forEach(s => { settings[s.key] = s.value; });
      set({ settings });
      return settings;
    } catch (err) {
      console.error('Load settings error:', err);
      return {};
    }
  },

  updateSetting: async (farmId, key, value) => {
    try {
      const existing = await db.settings.where('[farmId+key]').equals([farmId, key]).first();
      if (existing) {
        await db.settings.update(existing.id, { value: String(value), updatedAt: new Date().toISOString() });
      } else {
        await db.settings.add({ farmId, key, value: String(value), updatedAt: new Date().toISOString() });
      }
      set(s => ({ settings: { ...s.settings, [key]: String(value) } }));
    } catch (err) {
      console.error('Update setting error:', err);
    }
  },

  // ========= BREEDING =========
  breedingRecords: [],
  breedingLoading: false,

  loadBreedingRecords: async (farmId) => {
    set({ breedingLoading: true });
    try {
      const breedingRecords = await db.breeding_records.where('farmId').equals(farmId).reverse().sortBy('date');
      set({ breedingRecords, breedingLoading: false });
      return breedingRecords;
    } catch (err) {
      console.error('Load breeding error:', err);
      set({ breedingLoading: false });
      return [];
    }
  },

  addBreedingRecord: async (recordData) => {
    try {
      const id = await db.breeding_records.add({
        ...recordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      const record = await db.breeding_records.get(id);
      
      // Also update the cow's status to 'pregnant' or 'open' based on this if we wanted, but let's just save the record for now
      // Actually, breeding status is usually 'pending' until confirmed pregnant.

      set(s => ({ breedingRecords: [record, ...s.breedingRecords] }));
      return record;
    } catch (err) {
      console.error('Add breeding error:', err);
      return null;
    }
  },

  updateBreedingRecord: async (id, updates) => {
    try {
      await db.breeding_records.update(id, { ...updates, updatedAt: new Date().toISOString() });
      const record = await db.breeding_records.get(id);
      set(s => ({ breedingRecords: s.breedingRecords.map(r => r.id === id ? record : r) }));
      return record;
    } catch (err) {
      console.error('Update breeding error:', err);
      return null;
    }
  },

  // ========= LOAD ALL DATA =========
  loadAllData: async (farmId) => {
    const store = get();
    await Promise.all([
      store.loadAnimals(farmId),
      store.loadMilkRecords(farmId),
      store.loadFeedData(farmId),
      store.loadFinanceRecords(farmId),
      store.loadSettings(farmId),
      store.loadNotifications(farmId),
      store.loadBreedingRecords(farmId),
    ]);
  },
}));

export default useFarmStore;
