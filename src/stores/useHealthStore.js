// KhamarCare — Health Store (Zustand)
import { create } from 'zustand';
import db from '../db/database.js';

const useHealthStore = create((set, get) => ({
  healthRecords: [],
  vaccinations: [],
  dewormingRecords: [],
  loading: false,

  loadHealthData: async (farmId) => {
    set({ loading: true });
    try {
      const [health, vax, deworm] = await Promise.all([
        db.health_records.where('farmId').equals(farmId).toArray(),
        db.vaccinations.where('farmId').equals(farmId).toArray(),
        db.deworming_records.where('farmId').equals(farmId).toArray()
      ]);
      set({ healthRecords: health, vaccinations: vax, dewormingRecords: deworm });
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      set({ loading: false });
    }
  },

  addVaccination: async (record) => {
    try {
      const id = await db.vaccinations.add(record);
      set(state => ({
        vaccinations: [...state.vaccinations, { ...record, id }]
      }));
      return id;
    } catch (error) {
      console.error('Failed to add vaccination:', error);
      throw error;
    }
  },

  addHealthRecord: async (record) => {
    try {
      const id = await db.health_records.add(record);
      set(state => ({
        healthRecords: [...state.healthRecords, { ...record, id }]
      }));
      return id;
    } catch (error) {
      console.error('Failed to add health record:', error);
      throw error;
    }
  }
}));

export default useHealthStore;
