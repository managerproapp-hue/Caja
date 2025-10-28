import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoryData } from '../../types';

interface ChartProps {
  data: CategoryData[];
}

const IncomeSourceBarChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart 
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" tickFormatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value as number)} />
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
                <Bar dataKey="value" fill="#10B981" name="Importe del Ingreso" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default IncomeSourceBarChart;