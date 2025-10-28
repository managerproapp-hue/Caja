import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CategoryData } from '../../types';

interface ChartProps {
  data: CategoryData[];
}
const COLORS = ['#8B5CF6', '#EC4899', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];


const ExpenseByCategoryBarChart: React.FC<ChartProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart 
                data={sortedData} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis type="number" stroke="#A0AEC0" tickFormatter={(value) => new Intl.NumberFormat('es-ES').format(value as number)} />
                <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={100} tick={{ fill: '#A0AEC0' }} />
                <Tooltip 
                    cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
                    contentStyle={{ 
                        backgroundColor: '#2D3748', 
                        borderColor: '#4A5568',
                        borderRadius: '0.75rem'
                    }} 
                    labelStyle={{ color: '#E2E8F0' }}
                    formatter={(value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)}
                />
                <Bar dataKey="value" name="Importe del Gasto">
                    {
                        sortedData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                    }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ExpenseByCategoryBarChart;