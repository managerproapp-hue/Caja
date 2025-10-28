import React, { useMemo } from 'react';
import { Transaction, AnnualComparisonData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnnualComparisonProps {
    transactions: Transaction[];
    onNavigateBack: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-gray-700 text-white rounded-lg shadow-lg border border-gray-600">
                <p className="font-bold">{`Año ${label}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.fill }}>
                        {`${pld.name}: ${formatCurrency(pld.value)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AnnualComparison: React.FC<AnnualComparisonProps> = ({ transactions, onNavigateBack }) => {
    
    const annualData = useMemo<AnnualComparisonData[]>(() => {
        const dataByYear: { [year: number]: Omit<AnnualComparisonData, 'year'> } = {};

        transactions.forEach(t => {
            const year = new Date(t.date).getFullYear();
            if (!dataByYear[year]) {
                dataByYear[year] = { income: 0, expenses: 0, netMargin: 0 };
            }
            if (t.type === 'income') {
                dataByYear[year].income += t.amount;
            } else {
                dataByYear[year].expenses += t.amount;
            }
        });

        return Object.entries(dataByYear)
            .map(([year, data]) => ({
                year: parseInt(year),
                ...data,
                netMargin: data.income - data.expenses,
            }))
            .sort((a, b) => a.year - b.year);

    }, [transactions]);


    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Comparativa Anual</h1>
                <button 
                    onClick={onNavigateBack}
                    className="text-sm text-gray-400 hover:text-white transition"
                >
                    &larr; Volver al Panel
                </button>
            </div>
            
            {annualData.length > 0 ? (
                <>
                    {/* Chart */}
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-white">Evolución de Ingresos y Gastos</h2>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={annualData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                    <XAxis dataKey="year" stroke="#A0AEC0" />
                                    <YAxis stroke="#A0AEC0" tickFormatter={(value) => formatCurrency(value as number)} />
                                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
                                    <Legend wrapperStyle={{color: '#E2E8F0'}}/>
                                    <Bar dataKey="income" fill="#10B981" name="Ingresos" />
                                    <Bar dataKey="expenses" fill="#EC4899" name="Gastos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    {/* Summary Table */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                         <h2 className="text-xl font-semibold p-6 text-white">Resumen por Año</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="p-4">Año</th>
                                        <th className="p-4 text-right">Ingresos Totales</th>
                                        <th className="p-4 text-right">Gastos Totales</th>
                                        <th className="p-4 text-right">Margen Neto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {annualData.map(data => (
                                        <tr key={data.year} className="border-b border-gray-700/50">
                                            <td className="p-4 font-bold">{data.year}</td>
                                            <td className="p-4 text-right font-mono text-emerald-400">{formatCurrency(data.income)}</td>
                                            <td className="p-4 text-right font-mono text-rose-400">{formatCurrency(data.expenses)}</td>
                                            <td className={`p-4 text-right font-mono font-semibold ${data.netMargin >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                                                {formatCurrency(data.netMargin)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-12 bg-gray-800 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-white">No hay datos suficientes</h2>
                    <p className="text-gray-400 mt-2">Añade algunas transacciones para empezar a comparar tus finanzas anualmente.</p>
                </div>
            )}
        </div>
    );
};

export default AnnualComparison;
