import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyData } from '../../types';

interface ChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-gray-700 text-white rounded-lg shadow-lg border border-gray-600">
                <p className="font-bold">{label}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.stroke }}>
                        {`${pld.name}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(pld.value)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


const MonthlyPerformanceChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="month" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" tickFormatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{color: '#E2E8F0'}}/>
                <Line type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={2} name="Ingresos" />
                <Line type="monotone" dataKey="expenses" stroke="#EC4899" strokeWidth={2} name="Gastos" />
                <Line type="monotone" dataKey="netMargin" stroke="#38BDF8" strokeWidth={2} name="Margen Neto"/>
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPerformanceChart;