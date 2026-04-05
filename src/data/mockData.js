// Mock transaction data for the finance dashboard — Indian Rupee (INR)
const categories = {
  expense: ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education'],
  income: ['Salary', 'Freelance', 'Investments', 'Refund']
};

const descriptions = {
  'Food & Dining': ['Swiggy Order', 'Zomato Delivery', 'Chai Point', 'Restaurant Bill', 'BigBasket Grocery'],
  'Transport': ['Ola Ride', 'Uber Auto', 'Metro Card Recharge', 'Parking Fee', 'Petrol Fill-up'],
  'Shopping': ['Flipkart Order', 'Myntra Purchase', 'Croma Electronics', 'Reliance Digital', 'Amazon India'],
  'Entertainment': ['PVR Cinemas', 'Netflix Subscription', 'Hotstar Premium', 'BookMyShow', 'Spotify India'],
  'Bills & Utilities': ['Electricity Bill', 'Jio Recharge', 'Airtel Broadband', 'Water Bill', 'LIC Premium'],
  'Healthcare': ['Apollo Pharmacy', 'Doctor Consultation', 'Lab Tests', 'Dental Checkup', 'MedPlus Order'],
  'Education': ['Udemy Course', 'Book Purchase', 'Workshop Fee', 'Exam Registration', 'Coursera Plus'],
  'Salary': ['Monthly Salary', 'Performance Bonus', 'Overtime Pay'],
  'Freelance': ['Web Dev Project', 'UI Design Work', 'Content Writing', 'Consulting Fee'],
  'Investments': ['Mutual Fund Dividend', 'FD Interest', 'Stock Profit', 'PPF Interest'],
  'Refund': ['GST Refund', 'Product Return', 'Insurance Claim']
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
  return 'txn_' + Math.random().toString(36).substr(2, 9);
}

function generateTransactions() {
  const transactions = [];
  const now = new Date(2026, 2, 31); // March 31, 2026

  for (let i = 0; i < 120; i++) {
    const daysAgo = randomBetween(0, 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const isIncome = Math.random() < 0.25;
    const type = isIncome ? 'income' : 'expense';
    const category = pickRandom(categories[type]);
    const description = pickRandom(descriptions[category]);

    let amount;
    if (type === 'income') {
      if (category === 'Salary') amount = randomBetween(45000, 85000);
      else if (category === 'Freelance') amount = randomBetween(5000, 30000);
      else if (category === 'Investments') amount = randomBetween(1000, 15000);
      else amount = randomBetween(500, 5000);
    } else {
      if (category === 'Bills & Utilities') amount = randomBetween(300, 5000);
      else if (category === 'Shopping') amount = randomBetween(200, 8000);
      else if (category === 'Food & Dining') amount = randomBetween(50, 2500);
      else if (category === 'Healthcare') amount = randomBetween(200, 5000);
      else if (category === 'Education') amount = randomBetween(150, 5000);
      else if (category === 'Transport') amount = randomBetween(50, 3000);
      else amount = randomBetween(100, 3000);
    }

    transactions.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      description,
      amount: parseFloat(amount.toFixed(2)),
      category,
      type
    });
  }

  // Add recurring salary entries (monthly)
  for (let m = 0; m < 6; m++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - m);
    date.setDate(1);
    transactions.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      description: 'Monthly Salary',
      amount: 65000 + randomBetween(-5000, 5000),
      category: 'Salary',
      type: 'income'
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const initialTransactions = generateTransactions();

export const categoryColors = {
  'Food & Dining': '#f97316',
  'Transport': '#06b6d4',
  'Shopping': '#8b5cf6',
  'Entertainment': '#ec4899',
  'Bills & Utilities': '#eab308',
  'Healthcare': '#ef4444',
  'Education': '#3b82f6',
  'Salary': '#10b981',
  'Freelance': '#6366f1',
  'Investments': '#14b8a6',
  'Refund': '#64748b'
};

// Utility: format INR
export function formatINR(amount) {
  const absAmount = Math.abs(amount);
  if (absAmount >= 10000000) return `₹${(absAmount / 10000000).toFixed(2)} Cr`;
  if (absAmount >= 100000) return `₹${(absAmount / 100000).toFixed(2)} L`;
  return `₹${absAmount.toLocaleString('en-IN')}`;
}

export function formatINRFull(amount) {
  return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Utility functions
export function computeSummary(transactions) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  return { totalIncome, totalExpenses, balance, savingsRate };
}

export function getMonthlyData(transactions) {
  const monthly = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!monthly[month]) {
      monthly[month] = { month, income: 0, expenses: 0, balance: 0 };
    }
    if (t.type === 'income') monthly[month].income += t.amount;
    else monthly[month].expenses += t.amount;
  });

  return Object.values(monthly)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => {
      m.balance = m.income - m.expenses;
      const [year, mo] = m.month.split('-');
      m.label = new Date(year, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
      return m;
    });
}

export function getCategoryBreakdown(transactions) {
  const breakdown = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!breakdown[t.category]) breakdown[t.category] = 0;
      breakdown[t.category] += t.amount;
    });

  return Object.entries(breakdown)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)), color: categoryColors[name] }))
    .sort((a, b) => b.value - a.value);
}

export function getInsights(transactions) {
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const highestCategory = categoryBreakdown[0] || { name: 'N/A', value: 0 };

  const monthlyData = getMonthlyData(transactions);
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((s, t) => s + t.amount, 0);
  const daysSpan = transactions.length > 0
    ? Math.max(1, Math.ceil((new Date(transactions[0].date) - new Date(transactions[transactions.length - 1].date)) / (1000 * 60 * 60 * 24)))
    : 1;
  const avgDailySpending = totalExpenses / daysSpan;

  const topTransactions = [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  let monthChange = null;
  if (currentMonth && previousMonth) {
    const change = currentMonth.expenses - previousMonth.expenses;
    const pct = previousMonth.expenses > 0 ? ((change / previousMonth.expenses) * 100) : 0;
    monthChange = { change, pct, increased: change > 0 };
  }

  return {
    highestCategory,
    categoryBreakdown,
    avgDailySpending,
    topTransactions,
    monthChange,
    monthlyData,
    currentMonth,
    previousMonth
  };
}

export const allCategories = [...categories.expense, ...categories.income];
