// KhamarCare — Zustand Auth Store
import { create } from 'zustand';
import db from '../db/database.js';
import { seedDemoData } from '../db/seed.js';

const useAuthStore = create((set, get) => ({
  user: null,
  farm: null,
  isLoading: true,
  isAuthenticated: false,
  isOnboarded: false,

  // Initialize — check if user exists
  initialize: async () => {
    try {
      const users = await db.users.toArray();
      if (users.length > 0) {
        const user = users[0];
        const farms = await db.farms.where('userId').equals(user.id).toArray();
        const farm = farms[0] || null;
        set({
          user,
          farm,
          isAuthenticated: true,
          isOnboarded: !!farm,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error('Auth init error:', err);
      set({ isLoading: false });
    }
  },

  // Register with demo data
  registerWithDemo: async () => {
    try {
      set({ isLoading: true });
      const result = await seedDemoData();
      if (result) {
        const user = await db.users.get(result.userId);
        const farm = await db.farms.get(result.farmId);
        set({
          user,
          farm,
          isAuthenticated: true,
          isOnboarded: true,
          isLoading: false,
        });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (err) {
      console.error('Register error:', err);
      set({ isLoading: false });
      return false;
    }
  },

  // Register new user
  register: async ({ name, phone, pin }) => {
    try {
      set({ isLoading: true });
      const userId = await db.users.add({
        name,
        phone,
        pin,
        language: 'bn',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const user = await db.users.get(userId);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      console.error('Register error:', err);
      set({ isLoading: false });
      return false;
    }
  },

  // Login
  login: async (phone, pin) => {
    try {
      set({ isLoading: true });
      const user = await db.users.where('phone').equals(phone).first();
      if (user && user.pin === pin) {
        const farms = await db.farms.where('userId').equals(user.id).toArray();
        set({
          user,
          farm: farms[0] || null,
          isAuthenticated: true,
          isOnboarded: !!farms[0],
          isLoading: false,
        });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (err) {
      console.error('Login error:', err);
      set({ isLoading: false });
      return false;
    }
  },

  // Setup farm
  setupFarm: async (farmData) => {
    try {
      const { user } = get();
      if (!user) return false;
      const farmId = await db.farms.add({
        userId: user.id,
        ...farmData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const farm = await db.farms.get(farmId);
      set({ farm, isOnboarded: true });
      return true;
    } catch (err) {
      console.error('Farm setup error:', err);
      return false;
    }
  },

  // Update farm
  updateFarm: async (updates) => {
    try {
      const { farm } = get();
      if (!farm) return;
      await db.farms.update(farm.id, { ...updates, updatedAt: new Date().toISOString() });
      const updated = await db.farms.get(farm.id);
      set({ farm: updated });
    } catch (err) {
      console.error('Update farm error:', err);
    }
  },

  // Logout
  logout: () => {
    set({ user: null, farm: null, isAuthenticated: false, isOnboarded: false });
  },

  // Clear all data
  clearAllData: async () => {
    try {
      await db.delete();
      window.location.reload();
    } catch (err) {
      console.error('Clear data error:', err);
    }
  },
}));

export default useAuthStore;
