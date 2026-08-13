// KhamarCare — Predictions Engine

import { todayStr, formatDate } from './dateUtils.js';

/**
 * Calculates predictive alerts based on farm data.
 * @param {Array} animals - List of all cattle
 * @param {Array} milkRecords - All milk records
 * @param {Object} settings - Farm settings
 * @returns {Array} List of prediction alerts
 */
export function generatePredictions(animals, milkRecords, settings) {
  const alerts = [];
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const heatCycleDays = Number(settings.heatCycleDays) || 21;
  const gestationDays = Number(settings.gestationPeriodDays) || 283;

  // Group milk records by animal
  const milkByAnimal = {};
  milkRecords.forEach(r => {
    if (!r.animalId) return;
    if (!milkByAnimal[r.animalId]) milkByAnimal[r.animalId] = [];
    milkByAnimal[r.animalId].push(r);
  });

  animals.forEach(animal => {
    // 1. Milk Drop Alerts (For lactating cows)
    if (animal.status === 'lactating' && milkByAnimal[animal.id]) {
      const records = milkByAnimal[animal.id].sort((a, b) => new Date(b.date) - new Date(a.date));
      if (records.length >= 10) {
        // Average of last 3 days
        const last3 = records.slice(0, 3);
        const avg3 = last3.reduce((sum, r) => sum + r.totalMilk, 0) / 3;
        
        // Average of previous 7 days (days 4 to 10)
        const prev7 = records.slice(3, 10);
        const avg7 = prev7.reduce((sum, r) => sum + r.totalMilk, 0) / 7;

        // If drop is more than 15%
        if (avg7 > 0 && avg3 < avg7 * 0.85) {
          alerts.push({
            type: 'milk_drop',
            animalId: animal.id,
            titleBn: `${animal.earTag} এর দুধ উৎপাদন কমেছে`,
            titleEn: `${animal.earTag} Milk Drop Alert`,
            messageBn: `গত ৩ দিনে গড়ে ${avg3.toFixed(1)} লি. দুধ দিয়েছে, যা আগের ৭ দিনের গড় (${avg7.toFixed(1)} লি.) থেকে উল্লেখযোগ্যভাবে কম। গরুর স্বাস্থ্য পরীক্ষা করুন।`,
            messageEn: `Averaged ${avg3.toFixed(1)} L over the last 3 days, significantly lower than the previous 7-day average (${avg7.toFixed(1)} L). Check health.`,
            priority: 'high',
          });
        }
      }
    }

    // 2. Heat Cycle Predictions (For open cows/heifers)
    if ((animal.status === 'open' || animal.status === 'heifer') && animal.lastHeatDate) {
      const lastHeat = new Date(animal.lastHeatDate);
      const nextHeat = new Date(lastHeat.getTime() + heatCycleDays * 24 * 60 * 60 * 1000);
      const diffDays = Math.round((nextHeat - todayDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 3) {
        alerts.push({
          type: 'heat_cycle',
          animalId: animal.id,
          titleBn: `${animal.earTag} হিটে আসার সম্ভাবনা`,
          titleEn: `${animal.earTag} Expected Heat Cycle`,
          messageBn: `আগামী ${diffDays === 0 ? 'আজ' : diffDays + ' দিনের মধ্যে'} হিটে আসার সম্ভাবনা রয়েছে। পর্যবেক্ষণ করুন।`,
          messageEn: `Expected to come into heat ${diffDays === 0 ? 'today' : 'in ' + diffDays + ' days'}. Please monitor.`,
          priority: diffDays === 0 ? 'high' : 'medium',
        });
      } else if (diffDays < 0 && diffDays > -3) {
        alerts.push({
          type: 'heat_cycle_missed',
          animalId: animal.id,
          titleBn: `${animal.earTag} এর সম্ভাব্য হিট মিস হয়েছে`,
          titleEn: `${animal.earTag} Missed Heat Cycle?`,
          messageBn: `গত ${Math.abs(diffDays)} দিন আগে হিটে আসার কথা ছিল। যদি বীজ দেওয়া হয়ে থাকে তবে রেকর্ড আপডেট করুন।`,
          messageEn: `Expected heat was ${Math.abs(diffDays)} days ago. If inseminated, please update the record.`,
          priority: 'medium',
        });
      }
    }

    // 3. Dry Period Alerts (For pregnant cows)
    if (animal.status === 'pregnant' && animal.pregnancyDate) {
      const pregDate = new Date(animal.pregnancyDate);
      const expectedCalving = new Date(pregDate.getTime() + gestationDays * 24 * 60 * 60 * 1000);
      const dryDate = new Date(expectedCalving.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days before calving
      
      const diffDaysToDry = Math.round((dryDate - todayDate) / (1000 * 60 * 60 * 24));
      
      if (diffDaysToDry >= 0 && diffDaysToDry <= 7) {
        alerts.push({
          type: 'dry_period',
          animalId: animal.id,
          titleBn: `${animal.earTag} কে ড্রাই করার সময়`,
          titleEn: `Time to Dry Off ${animal.earTag}`,
          messageBn: `সম্ভাব্য বাছুর প্রসবের তারিখ: ${formatDate(expectedCalving.toISOString().split('T')[0])}। আগামী ${diffDaysToDry} দিনের মধ্যে দুধ দোহন বন্ধ করুন।`,
          messageEn: `Expected calving date: ${formatDate(expectedCalving.toISOString().split('T')[0])}. Stop milking in ${diffDaysToDry} days.`,
          priority: 'high',
        });
      }
    }
  });

  return alerts;
}
