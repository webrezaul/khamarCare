// KhamarCare — Dexie.js Database Schema
import Dexie from 'dexie';

const db = new Dexie('KhamarCareDB');

// Version 1 — Phase 1 MVP
db.version(1).stores({
  // User & Farm
  users: '++id, phone, email',
  farms: '++id, userId',
  settings: '++id, farmId, key, [farmId+key]',

  // Breeds (reference data)
  breeds: '++id, name',

  // Animals
  animals: '++id, farmId, earTag, [farmId+status], [farmId+animalType], [farmId+gender], motherId, fatherId, isDeleted',

  // Milk Records
  milk_records: '++id, farmId, animalId, date, [farmId+date], [animalId+date]',

  // Feed
  feed_types: '++id, farmId, category',
  feed_inventory: '++id, farmId, feedTypeId, [farmId+feedTypeId]',
  feed_consumption: '++id, farmId, animalId, feedTypeId, date, [farmId+date], [animalId+date]',

  // Finance
  income_records: '++id, farmId, date, category, [farmId+date], [farmId+category]',
  expense_records: '++id, farmId, date, category, [farmId+date], [farmId+category]',

  // Health (Phase 2 schema ready)
  health_records: '++id, farmId, animalId, date, [farmId+date], [animalId+date]',
  vaccinations: '++id, farmId, animalId, date, nextDueDate, [farmId+animalId], [farmId+nextDueDate]',
  deworming_records: '++id, farmId, animalId, date, nextDueDate, [farmId+animalId]',

  // Breeding (Phase 2 schema ready)
  heat_records: '++id, farmId, animalId, date, [farmId+animalId]',
  breeding_records: '++id, farmId, animalId, date, [farmId+animalId]',
  pregnancy_records: '++id, farmId, animalId, status, [farmId+animalId], [farmId+status]',
  calving_records: '++id, farmId, animalId, date, [farmId+animalId]',

  // Weight tracking
  weight_records: '++id, farmId, animalId, date, [farmId+animalId]',

  // Land & Grass
  land_records: '++id, farmId',

  // Suppliers
  suppliers: '++id, farmId, name',

  // Notifications
  notifications: '++id, farmId, type, scheduledDate, isRead, [farmId+isRead], [farmId+type]',
});

// Version 2 — Milk Sales & Distribution Module
db.version(2).stores({
  // Customers (Buyers, Sweet Shops, etc.)
  customers: '++id, farmId, name, type, phone, [farmId+type]',
  
  // Milk Sales
  milk_sales: '++id, farmId, customerId, date, paymentStatus, [farmId+date], [farmId+customerId]'
});

export default db;
