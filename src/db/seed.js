// KhamarCare — Demo Data Seed
// Realistic data for a Bangladeshi dairy farm with 10 cattle
import db from './database.js';
import { DEFAULT_SETTINGS, FEED_CATEGORIES, BREEDS } from '../config/constants.js';

const today = new Date();
const d = (daysAgo) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};
const futureD = (daysAhead) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};
const dobFromAge = (years, months = 0) => {
  const date = new Date(today);
  date.setFullYear(date.getFullYear() - years);
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
};

export async function seedDemoData() {
  // Check if already seeded
  const existingUsers = await db.users.count();
  if (existingUsers > 0) return false;

  // 1. Create User
  const userId = await db.users.add({
    name: 'আসমাউল হুসনা',
    nameEn: 'Asmaul Husna',
    phone: '01700000000',
    pin: '1234',
    language: 'bn',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 2. Create Farm
  const farmId = await db.farms.add({
    userId,
    name: 'আসমাউল হুসনা এগ্রো ফার্ম',
    nameEn: 'Asmaul Husna Agro Farm',
    address: 'বাংলাদেশ',
    landArea: 2,
    landUnit: 'bigha',
    totalCattle: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 3. Settings
  const settingsEntries = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
    farmId,
    key,
    value: String(value),
    updatedAt: new Date().toISOString(),
  }));
  await db.settings.bulkAdd(settingsEntries);

  // 4. Breeds
  await db.breeds.bulkAdd(BREEDS.map(b => ({
    ...b,
    createdAt: new Date().toISOString(),
  })));

  // 5. Animals — 10 cattle
  const animals = [
    {
      farmId, earTag: 'C001', name: 'শাপলা', nameEn: 'Shapla',
      gender: 'female', animalType: 'cow', breedId: 'friesian',
      dob: dobFromAge(5), birthWeight: 25, currentWeight: 380,
      status: 'lactating', lactationNumber: 3,
      purchaseDate: dobFromAge(4, 6), purchasePrice: 85000,
      currentValue: 120000, source: 'market', notes: 'Top milk producer',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C002', name: 'পদ্মা', nameEn: 'Padma',
      gender: 'female', animalType: 'cow', breedId: 'friesian',
      dob: dobFromAge(4, 6), birthWeight: 23, currentWeight: 350,
      status: 'lactating', lactationNumber: 2,
      purchaseDate: dobFromAge(3, 6), purchasePrice: 75000,
      currentValue: 110000, source: 'market', notes: 'Second highest producer',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C003', name: 'মেঘনা', nameEn: 'Meghna',
      gender: 'female', animalType: 'cow', breedId: 'shahiwal',
      dob: dobFromAge(4), birthWeight: 22, currentWeight: 340,
      status: 'pregnant', lactationNumber: 2,
      purchaseDate: dobFromAge(3), purchasePrice: 70000,
      currentValue: 100000, source: 'market', notes: 'Pregnant — due in ~2 months',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C004', name: 'যমুনা', nameEn: 'Jamuna',
      gender: 'female', animalType: 'cow', breedId: 'local',
      dob: dobFromAge(5, 6), birthWeight: 20, currentWeight: 320,
      status: 'pregnant', lactationNumber: 3,
      purchaseDate: dobFromAge(5), purchasePrice: 55000,
      currentValue: 85000, source: 'farm_born', notes: 'Pregnant — due in ~3 months',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C005', name: 'সুরমা', nameEn: 'Surma',
      gender: 'female', animalType: 'cow', breedId: 'jersey_cross',
      dob: dobFromAge(3, 6), birthWeight: 24, currentWeight: 360,
      status: 'pregnant', lactationNumber: 1,
      purchaseDate: dobFromAge(2, 6), purchasePrice: 80000,
      currentValue: 115000, source: 'market', notes: 'First pregnancy — due in ~4 months',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C006', name: 'তারা', nameEn: 'Tara',
      gender: 'female', animalType: 'heifer', breedId: 'friesian',
      dob: dobFromAge(1, 2), birthWeight: 22, currentWeight: 200,
      status: 'open', lactationNumber: 0,
      purchaseDate: null, purchasePrice: 0,
      currentValue: 60000, source: 'farm_born', notes: '14 months old heifer',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C007', name: 'মিনা', nameEn: 'Mina',
      gender: 'female', animalType: 'heifer', breedId: 'shahiwal',
      dob: dobFromAge(0, 10), birthWeight: 20, currentWeight: 150,
      status: 'open', lactationNumber: 0,
      purchaseDate: null, purchasePrice: 0,
      currentValue: 45000, source: 'farm_born', notes: '10 months old heifer',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C008', name: 'রাজু', nameEn: 'Raju',
      gender: 'male', animalType: 'calf', breedId: 'local',
      dob: dobFromAge(0, 5), birthWeight: 18, currentWeight: 80,
      status: 'open', lactationNumber: 0,
      purchaseDate: null, purchasePrice: 0,
      currentValue: 25000, source: 'farm_born', notes: '5 months old male calf',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C009', name: 'রিমা', nameEn: 'Rima',
      gender: 'female', animalType: 'calf', breedId: 'friesian',
      dob: dobFromAge(0, 3), birthWeight: 20, currentWeight: 55,
      status: 'open', lactationNumber: 0,
      purchaseDate: null, purchasePrice: 0,
      currentValue: 20000, source: 'farm_born', notes: '3 months old female calf',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      farmId, earTag: 'C010', name: 'বলদ', nameEn: 'Bolod',
      gender: 'male', animalType: 'bull', breedId: 'local',
      dob: dobFromAge(3), birthWeight: 25, currentWeight: 450,
      status: 'open', lactationNumber: 0,
      purchaseDate: dobFromAge(2, 6), purchasePrice: 60000,
      currentValue: 90000, source: 'market', notes: 'Breeding bull',
      photo: null, motherId: null, fatherId: null, isDeleted: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
  ];

  const animalIds = await db.animals.bulkAdd(animals, { allKeys: true });

  // 6. Milk Records — last 30 days for C001 (7L) and C002 (6L)
  const milkRecords = [];
  for (let i = 0; i < 30; i++) {
    const date = d(i);
    // Shapla — avg 7L (3.5 morning + 3.5 evening), slight variation
    const shapMorn = +(3.0 + Math.random() * 1.0).toFixed(1);
    const shapEve = +(3.0 + Math.random() * 1.0).toFixed(1);
    const shapTotal = +(shapMorn + shapEve).toFixed(1);
    milkRecords.push({
      farmId, animalId: animalIds[0], date,
      morningMilk: shapMorn, eveningMilk: shapEve, totalMilk: shapTotal,
      pricePerLiter: 50, totalRevenue: +(shapTotal * 50).toFixed(0),
      createdAt: new Date().toISOString(),
    });

    // Padma — avg 6L (3 morning + 3 evening)
    const padMorn = +(2.5 + Math.random() * 1.0).toFixed(1);
    const padEve = +(2.5 + Math.random() * 1.0).toFixed(1);
    const padTotal = +(padMorn + padEve).toFixed(1);
    milkRecords.push({
      farmId, animalId: animalIds[1], date,
      morningMilk: padMorn, eveningMilk: padEve, totalMilk: padTotal,
      pricePerLiter: 50, totalRevenue: +(padTotal * 50).toFixed(0),
      createdAt: new Date().toISOString(),
    });
  }
  await db.milk_records.bulkAdd(milkRecords);

  // 7. Feed Types
  const feedTypeRecords = FEED_CATEGORIES.map(fc => ({
    farmId,
    category: fc.id,
    name: fc.en,
    nameBn: fc.bn,
    unit: fc.unit,
    icon: fc.icon,
    createdAt: new Date().toISOString(),
  }));
  const feedTypeIds = await db.feed_types.bulkAdd(feedTypeRecords, { allKeys: true });

  // 8. Feed Inventory — initial stock
  const feedInventory = [
    { farmId, feedTypeId: feedTypeIds[0], currentStock: 500, minStock: 100, purchasePrice: 5, unit: 'kg', lastUpdated: new Date().toISOString() },
    { farmId, feedTypeId: feedTypeIds[1], currentStock: 200, minStock: 50, purchasePrice: 8, unit: 'kg', lastUpdated: new Date().toISOString() },
    { farmId, feedTypeId: feedTypeIds[2], currentStock: 100, minStock: 30, purchasePrice: 35, unit: 'kg', lastUpdated: new Date().toISOString() },
    { farmId, feedTypeId: feedTypeIds[3], currentStock: 50, minStock: 20, purchasePrice: 25, unit: 'kg', lastUpdated: new Date().toISOString() },
    { farmId, feedTypeId: feedTypeIds[10], currentStock: 5, minStock: 2, purchasePrice: 120, unit: 'kg', lastUpdated: new Date().toISOString() },
  ];
  await db.feed_inventory.bulkAdd(feedInventory);

  // 9. Feed Consumption — last 7 days sample
  const feedConsumption = [];
  for (let i = 0; i < 7; i++) {
    const date = d(i);
    // Each lactating cow gets daily: 30kg grass, 5kg straw, 2kg wheat bran, 50g calcium
    for (const cowIdx of [0, 1]) {
      feedConsumption.push(
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[0], date, quantity: 30, unit: 'kg', cost: 150, createdAt: new Date().toISOString() },
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[1], date, quantity: 5, unit: 'kg', cost: 40, createdAt: new Date().toISOString() },
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[2], date, quantity: 2, unit: 'kg', cost: 70, createdAt: new Date().toISOString() },
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[10], date, quantity: 0.05, unit: 'kg', cost: 6, createdAt: new Date().toISOString() },
      );
    }
    // Pregnant cows — slightly less
    for (const cowIdx of [2, 3, 4]) {
      feedConsumption.push(
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[0], date, quantity: 25, unit: 'kg', cost: 125, createdAt: new Date().toISOString() },
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[1], date, quantity: 5, unit: 'kg', cost: 40, createdAt: new Date().toISOString() },
        { farmId, animalId: animalIds[cowIdx], feedTypeId: feedTypeIds[2], date, quantity: 1.5, unit: 'kg', cost: 53, createdAt: new Date().toISOString() },
      );
    }
  }
  await db.feed_consumption.bulkAdd(feedConsumption);

  // 10. Income Records — milk sales last 30 days
  const incomeRecords = [];
  for (let i = 0; i < 30; i++) {
    const date = d(i);
    const dailyMilk = +(11 + Math.random() * 4).toFixed(1);
    incomeRecords.push({
      farmId, date, category: 'milk_sales',
      amount: +(dailyMilk * 50).toFixed(0),
      description: `দুধ বিক্রি — ${dailyMilk} লিটার`,
      relatedAnimalId: null,
      createdAt: new Date().toISOString(),
    });
  }
  await db.income_records.bulkAdd(incomeRecords);

  // 11. Expense Records — varied
  const expenseRecords = [];
  for (let i = 0; i < 30; i++) {
    const date = d(i);
    // Daily feed cost ~BDT 1100
    expenseRecords.push({
      farmId, date, category: 'feed',
      amount: +(1000 + Math.random() * 200).toFixed(0),
      description: 'দৈনিক খাদ্য খরচ',
      createdAt: new Date().toISOString(),
    });
  }
  // Monthly labor
  expenseRecords.push({
    farmId, date: d(0), category: 'labor',
    amount: 8000, description: 'মাসিক শ্রমিক বেতন',
    createdAt: new Date().toISOString(),
  });
  // Vet visit
  expenseRecords.push({
    farmId, date: d(10), category: 'veterinary',
    amount: 1500, description: 'পশু ডাক্তার ফি',
    createdAt: new Date().toISOString(),
  });
  // Electricity
  expenseRecords.push({
    farmId, date: d(5), category: 'electricity',
    amount: 2000, description: 'মাসিক বিদ্যুৎ বিল',
    createdAt: new Date().toISOString(),
  });
  await db.expense_records.bulkAdd(expenseRecords);

  // 12. Pregnancy Records for pregnant cows
  const pregnancyRecords = [
    {
      farmId, animalId: animalIds[2], // Meghna
      confirmationDate: d(200), conceptionDate: d(220),
      expectedCalvingDate: futureD(63), // ~2 months
      status: 'confirmed', gestationDays: 283,
      notes: 'Normal pregnancy', createdAt: new Date().toISOString(),
    },
    {
      farmId, animalId: animalIds[3], // Jamuna
      confirmationDate: d(170), conceptionDate: d(190),
      expectedCalvingDate: futureD(93), // ~3 months
      status: 'confirmed', gestationDays: 283,
      notes: 'Normal pregnancy', createdAt: new Date().toISOString(),
    },
    {
      farmId, animalId: animalIds[4], // Surma
      confirmationDate: d(140), conceptionDate: d(160),
      expectedCalvingDate: futureD(123), // ~4 months
      status: 'confirmed', gestationDays: 283,
      notes: 'First pregnancy', createdAt: new Date().toISOString(),
    },
  ];
  await db.pregnancy_records.bulkAdd(pregnancyRecords);

  // 13. Land Records
  await db.land_records.add({
    farmId,
    area: 2,
    unit: 'bigha',
    grassType: 'napier',
    grassTypeBn: 'নেপিয়ার',
    plantingDate: d(180),
    estimatedYield: 15000, // kg per year
    fertilizerUsed: 'Organic',
    irrigationType: 'Canal',
    cost: 15000,
    notes: '2 bigha Napier & Pakchong grass',
    createdAt: new Date().toISOString(),
  });

  // 14. Notifications
  await db.notifications.bulkAdd([
    {
      farmId, type: 'calving',
      title: 'বাচ্চা প্রসবের সময় এগিয়ে আসছে',
      titleEn: 'Calving date approaching',
      message: '🐄 মেঘনা (C003) — আনুমানিক বাচ্চা প্রসব ২ মাস পরে',
      messageEn: '🐄 Meghna (C003) — Expected calving in ~2 months',
      scheduledDate: futureD(63),
      isRead: 0, relatedEntityId: animalIds[2], relatedEntityType: 'animal',
      createdAt: new Date().toISOString(),
    },
    {
      farmId, type: 'vaccination',
      title: 'টিকার সময় হয়েছে',
      titleEn: 'Vaccination due',
      message: '💉 সব গরুর FMD টিকা দিতে হবে',
      messageEn: '💉 FMD vaccination due for all cattle',
      scheduledDate: futureD(7),
      isRead: 0, relatedEntityId: null, relatedEntityType: null,
      createdAt: new Date().toISOString(),
    },
    {
      farmId, type: 'feed_stock',
      title: 'খড়ের স্টক কমে যাচ্ছে',
      titleEn: 'Low straw stock',
      message: '🌾 খড়ের স্টক ন্যূনতম মাত্রার কাছাকাছি — কিনুন',
      messageEn: '🌾 Straw stock approaching minimum level — please purchase',
      scheduledDate: d(0),
      isRead: 0, relatedEntityId: null, relatedEntityType: null,
      createdAt: new Date().toISOString(),
    },
  ]);

  return { userId, farmId };
}

export default seedDemoData;
