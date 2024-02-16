import { ExpenseItem } from '../types';

export const aggregateExpensesByPeriod = (
  expenses: ExpenseItem[],
  targetPeriod: string
): { period: string; total: number }[] => {
  const filteredExpenses = expenses.filter((expense) =>
    expense.date.startsWith(targetPeriod)
  );

  const monthlyTotals = filteredExpenses.reduce<Record<string, number>>(
    (acc, curr) => {
      const period = curr.date;

      acc[period] = (acc[period] || 0) + parseFloat(curr.amount);

      return acc;
    },
    {}
  );
  const sortedEntries = Object.entries(monthlyTotals).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  return sortedEntries.map(([period, total]) => ({
    period,
    total,
  }));
};

export const aggregateExpensesByCategory = (
  expenses: ExpenseItem[],
  targetPeriod: string
): { category: string; total: number }[] => {
  const filteredExpenses = expenses.filter((expense) =>
    expense.date.startsWith(targetPeriod)
  );

  const categoryTotals = filteredExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total,
  }));
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  return day;
};
