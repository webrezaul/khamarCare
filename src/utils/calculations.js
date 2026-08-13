// KhamarCare — Business Logic Calculations

/**
 * Calculate cost per liter of milk
 * @param {number} totalExpense - Total farm expenses for the period
 * @param {number} totalMilk - Total milk produced (liters) for the period
 * @returns {number} Cost per liter
 */
export const calcCostPerLiter = (totalExpense, totalMilk) => {
  if (!totalMilk || totalMilk <= 0) return 0;
  return +(totalExpense / totalMilk).toFixed(2);
};

/**
 * Calculate profit per liter
 * @param {number} sellingPrice - Price per liter
 * @param {number} costPerLiter - Cost per liter
 * @returns {number}
 */
export const calcProfitPerLiter = (sellingPrice, costPerLiter) => {
  return +(sellingPrice - costPerLiter).toFixed(2);
};

/**
 * Calculate profit margin
 * @param {number} totalIncome
 * @param {number} totalExpense
 * @returns {number} Percentage
 */
export const calcProfitMargin = (totalIncome, totalExpense) => {
  if (!totalIncome || totalIncome <= 0) return 0;
  return +(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1);
};

/**
 * Calculate net profit
 */
export const calcNetProfit = (totalIncome, totalExpense) => {
  return +(totalIncome - totalExpense).toFixed(2);
};

/**
 * Calculate expected calving date from breeding date
 * @param {string} breedingDate - ISO date string
 * @param {number} gestationDays - Default 283
 * @returns {string} ISO date string
 */
export const calcExpectedCalvingDate = (breedingDate, gestationDays = 283) => {
  if (!breedingDate) return null;
  const date = new Date(breedingDate);
  date.setDate(date.getDate() + gestationDays);
  return date.toISOString().split('T')[0];
};

/**
 * Calculate milk revenue
 */
export const calcMilkRevenue = (totalMilk, pricePerLiter) => {
  return +(totalMilk * pricePerLiter).toFixed(2);
};

/**
 * Calculate feed cost per cow per day
 */
export const calcFeedCostPerCow = (totalFeedCost, numberOfCows) => {
  if (!numberOfCows || numberOfCows <= 0) return 0;
  return +(totalFeedCost / numberOfCows).toFixed(2);
};

/**
 * Feed cost per liter of milk produced
 */
export const calcFeedCostPerLiter = (totalFeedCost, totalMilk) => {
  if (!totalMilk || totalMilk <= 0) return 0;
  return +(totalFeedCost / totalMilk).toFixed(2);
};

/**
 * Calculate Profitability Score (0-100)
 * Factors:
 * - Milk productivity (milk per cow)
 * - Feed efficiency (feed cost vs milk revenue)
 * - Profit margin
 * - Reproductive performance (pregnant + lactating cows ratio)
 * - Health (sick animals ratio — lower is better)
 */
export const calcProfitabilityScore = ({
  avgMilkPerCow = 0,
  feedCostRatio = 0, // feed cost as % of milk revenue
  profitMargin = 0,
  reproductiveRate = 0, // (pregnant + lactating) / total cows
  sickRate = 0, // sick / total
}) => {
  // Milk productivity: 0-25 points (benchmark: 10L/cow/day = 25 pts)
  const milkScore = Math.min(25, (avgMilkPerCow / 10) * 25);

  // Feed efficiency: 0-25 points (feed < 40% of revenue = 25 pts)
  const feedScore = feedCostRatio <= 0 ? 15 : Math.min(25, Math.max(0, (1 - feedCostRatio / 100) * 25));

  // Profitability: 0-25 points (margin > 30% = 25 pts)
  const profitScore = Math.min(25, Math.max(0, (profitMargin / 30) * 25));

  // Reproductive: 0-15 points
  const reproScore = Math.min(15, reproductiveRate * 15);

  // Health: 0-10 points (0% sick = 10 pts)
  const healthScore = Math.max(0, (1 - sickRate) * 10);

  const total = Math.round(milkScore + feedScore + profitScore + reproScore + healthScore);
  
  let level, explanation;
  if (total >= 80) {
    level = 'excellent';
    explanation = {
      bn: 'আপনার খামারের পারফরম্যান্স চমৎকার! দুধ উৎপাদন, খরচ নিয়ন্ত্রণ এবং প্রজনন দক্ষতা ভালো।',
      en: 'Your farm performance is excellent! Milk production, cost management, and breeding efficiency are strong.',
    };
  } else if (total >= 60) {
    level = 'good';
    explanation = {
      bn: 'আপনার খামার ভালো চলছে। কিছু ক্ষেত্রে উন্নতির সুযোগ আছে।',
      en: 'Your farm is performing well. There is room for improvement in some areas.',
    };
  } else {
    level = 'needsAttention';
    explanation = {
      bn: 'আপনার খামারের কিছু ক্ষেত্রে মনোযোগ দরকার। খরচ কমান এবং দুধ উৎপাদন বাড়ানোর চেষ্টা করুন।',
      en: 'Some areas of your farm need attention. Try to reduce costs and increase milk production.',
    };
  }

  return {
    score: total,
    level,
    explanation,
    breakdown: { milkScore, feedScore, profitScore, reproScore, healthScore },
  };
};

/**
 * Feed insight: additional feed cost vs additional milk revenue
 */
export const calcFeedInsight = (prevFeedCost, currentFeedCost, prevMilkRevenue, currentMilkRevenue) => {
  const additionalFeedCost = currentFeedCost - prevFeedCost;
  const additionalMilkRevenue = currentMilkRevenue - prevMilkRevenue;
  const additionalProfit = additionalMilkRevenue - additionalFeedCost;
  
  return {
    additionalFeedCost,
    additionalMilkRevenue,
    additionalProfit,
    isWorthIt: additionalProfit > 0,
  };
};

/**
 * Simple feed recommendation calculator
 * WARNING: General estimates only, not veterinary advice
 */
export const calcFeedRecommendation = ({ animalType, bodyWeight, milkProduction = 0, isPregnant = false, lactationStage = 'mid' }) => {
  // Base maintenance requirement per 100kg body weight
  const maintenanceGrass = (bodyWeight / 100) * 5; // kg green grass
  const maintenanceStraw = (bodyWeight / 100) * 2; // kg straw
  let concentrate = (bodyWeight / 100) * 0.5; // kg concentrate (base)

  // Additional for milk production: ~0.4kg concentrate per liter of milk
  const milkConcentrate = milkProduction * 0.4;
  concentrate += milkConcentrate;

  // Pregnancy allowance (last trimester)
  let pregnancyExtra = 0;
  if (isPregnant) {
    pregnancyExtra = 1.5; // extra kg concentrate
    concentrate += pregnancyExtra;
  }

  // Water: approximately 3-4 liters per kg dry matter intake
  const dryMatterIntake = (maintenanceGrass * 0.2) + (maintenanceStraw * 0.9) + (concentrate * 0.9);
  const water = Math.round(dryMatterIntake * 3.5);

  // Mineral mix: 50-80g per day for lactating cow
  const mineralMix = milkProduction > 0 ? 80 : 50;

  return {
    greenGrass: +maintenanceGrass.toFixed(1),
    straw: +maintenanceStraw.toFixed(1),
    concentrate: +concentrate.toFixed(1),
    mineralMix,
    water,
    disclaimer: true,
  };
};
