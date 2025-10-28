
import React from 'react';
import { KpiCardProps } from '../types';

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-white shadow-lg transform hover:-translate-y-1 transition-transform duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
