import { Transaction, MonthlyData, CategoryData } from '../types';

export const mockTransactions: Transaction[] = [
  // Datos de ejemplo eliminados para un estado inicial limpio.
];


export const processDataForDashboard = (transactions: Transaction[]) => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const netMargin = totalIncome - totalExpenses;
    const savingsPercentage = totalIncome > 0 ? ((netMargin / totalIncome) * 100) : 0;

    const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString('es-ES', { month: 'short' }).replace('.','');
        return { month: month.charAt(0).toUpperCase() + month.slice(1), income: 0, expenses: 0, netMargin: 0 };
    });

    transactions.forEach(t => {
        const monthIndex = new Date(t.date).getMonth();
        if (t.type === 'income') {
            monthlyData[monthIndex].income += t.amount;
        } else {
            monthlyData[monthIndex].expenses += t.amount;
        }
    });

    monthlyData.forEach(m => {
        m.netMargin = m.income - m.expenses;
    });

    const expenseByCategory: CategoryData[] = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category, value: t.amount });
            }
            return acc;
        }, [] as CategoryData[]);

    const incomeBySource: CategoryData[] = transactions
        .filter(t => t.type === 'income' && t.source)
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.source);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.source!, value: t.amount });
            }
            return acc;
        }, [] as CategoryData[]);


    return {
        totalIncome,
        totalExpenses,
        netMargin,
        savingsPercentage,
        monthlyData,
        expenseByCategory,
        incomeBySource
    };
};