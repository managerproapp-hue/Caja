import React from 'react';
import { processDataForDashboard } from '../data/mockData';
import KpiCard from './KpiCard';
import MonthlyPerformanceChart from './charts/MonthlyPerformanceChart';
import ExpenseDistributionPieChart from './charts/ExpenseDistributionPieChart';
import ExpenseByCategoryBarChart from './charts/ExpenseByCategoryBarChart';
import IncomeSourceBarChart from './charts/IncomeSourceBarChart';
import { Transaction } from '../types';

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-7-7m7 7l7-7" />
    </svg>
);

const ScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a2 2 0 002 2h10a2 2 0 002-2l-3-9m0 0l3-1m-6 0v12" />
    </svg>
);

const PiggyBankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.982 10.982a2.5 2.5 0 012.828 0l.4.4a2.5 2.5 0 003.536 0l.4-.4a2.5 2.5 0 012.828 0l.4.4a2.5 2.5 0 003.536 0l.4-.4a2.5 2.5 0 012.828 0l.172.172A2.5 2.5 0 0121 13.5v.5a2.5 2.5 0 01-2.5 2.5h-10A2.5 2.5 0 016 14v-.5a2.5 2.5 0 01.38-1.328l.172-.172z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10V6a3 3 0 013-3v0a3 3 0 013 3v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10a2 2 0 11-4 0" />
    </svg>
);

interface DashboardProps {
    transactions: Transaction[];
    onNavigateToWelcome: () => void;
    onNavigateToImport: () => void;
    onNavigateToDatabase: () => void;
    onNavigateToBackup: () => void;
    onNavigateToSettings: () => void;
    onNavigateToAccounts: () => void;
    onNavigateToAnnualComparison: () => void;
    onApiKeyReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    transactions, 
    onNavigateToWelcome, 
    onNavigateToImport, 
    onNavigateToDatabase, 
    onNavigateToBackup, 
    onNavigateToSettings, 
    onNavigateToAccounts, 
    onNavigateToAnnualComparison,
    onApiKeyReset 
}) => {
    const data = processDataForDashboard(transactions);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
    }

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                     <button 
                        onClick={onNavigateToAnnualComparison}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-indigo-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Comparativa Anual
                    </button>
                     <button 
                        onClick={onNavigateToAccounts}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-blue-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Cuentas Bancarias
                    </button>
                    <button 
                        onClick={onNavigateToSettings}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-gray-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Configuración
                    </button>
                    <button 
                        onClick={onNavigateToBackup}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-teal-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Copia de Seguridad
                    </button>
                    <button 
                        onClick={onNavigateToDatabase}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-cyan-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Base de Datos
                    </button>
                    <button 
                        onClick={onNavigateToImport}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Importar Datos
                    </button>
                    <button 
                        onClick={onApiKeyReset}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-red-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Resetear API Key
                    </button>
                    <button 
                        onClick={onNavigateToWelcome}
                        className="text-sm text-gray-400 hover:text-white transition ml-4"
                    >
                        &larr; Volver
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Ingresos" value={formatCurrency(data.totalIncome)} icon={<ArrowUpIcon />} color="from-purple-500 to-indigo-600" />
                <KpiCard title="Total Gastos" value={formatCurrency(data.totalExpenses)} icon={<ArrowDownIcon />} color="from-pink-500 to-red-500" />
                <KpiCard title="Margen Neto" value={formatCurrency(data.netMargin)} icon={<ScaleIcon />} color="from-blue-500 to-cyan-500" />
                <KpiCard title="Porcentaje de Ahorro" value={`${data.savingsPercentage.toFixed(1).replace('.', ',')}%`} icon={<PiggyBankIcon />} color="from-green-500 to-teal-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Rendimiento Mensual</h2>
                    <MonthlyPerformanceChart data={data.monthlyData} />
                </div>

                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Distribución de Gastos</h2>
                     <ExpenseDistributionPieChart data={data.expenseByCategory} />
                </div>
                
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                     <h2 className="text-xl font-semibold mb-4 text-white">Gastos por Categoría</h2>
                     <ExpenseByCategoryBarChart data={data.expenseByCategory} />
                </div>
                
                <div className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Ingresos por Fuente</h2>
                    <IncomeSourceBarChart data={data.incomeBySource} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;