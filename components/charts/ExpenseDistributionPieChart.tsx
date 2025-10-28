import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CategoryData } from '../../types';

interface ChartProps {
  data: CategoryData[];
}

const COLORS = ['#8B5CF6', '#EC4899', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, percent } = payload[0].payload;
      return (
        <div className="p-4 bg-gray-700 text-white rounded-lg shadow-lg border border-gray-600">
          <p className="font-bold">{name}</p>
          <p>{`Importe: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)}`}</p>
          <p>{`Porcentaje: ${percent.toFixed(2).replace('.', ',')}%`}</p>
        </div>
      );
    }
  
    return null;
  };

const ExpenseDistributionPieChart: React.FC<ChartProps> = ({ data }) => {
    const total = data.reduce((acc, entry) => acc + entry.value, 0);
    const dataWithPercent = data.map(entry => ({...entry, percent: (entry.value / total) * 100}));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{color: '#E2E8F0', paddingTop: '20px'}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseDistributionPieChart;