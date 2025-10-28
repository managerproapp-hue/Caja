import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface DatabaseProps {
  transactions: Transaction[];
  onNavigateBack: () => void;
}

const ITEMS_PER_PAGE = 15;

const Database: React.FC<DatabaseProps> = ({ transactions, onNavigateBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'description' | 'category'>('description');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) {
      return transactions;
    }
    return transactions.filter(t => 
      t[searchType]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm, searchType]);
  
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const handleClear = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Base de Datos de Transacciones</h1>
        <button 
          onClick={onNavigateBack}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          &larr; Volver al Panel
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex items-center gap-4">
        <select 
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'description' | 'category')}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-violet-500 focus:border-violet-500"
        >
          <option value="description">Buscar por Descripción</option>
          <option value="category">Buscar por Categoría</option>
        </select>
        <input 
          type="text"
          placeholder="Escribe para buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset page on new search
          }}
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-violet-500 focus:border-violet-500"
        />
        <button onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Limpiar</button>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50">
              <tr className="border-b border-gray-700">
                <th className="p-4">Fecha</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Fuente</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Tipo</th>
                <th className="p-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? paginatedTransactions.map(t => (
                <tr key={t.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                  <td className="p-4 whitespace-nowrap">{t.date}</td>
                  <td className="p-4">{t.description}</td>
                  <td className="p-4">
                    <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{t.source}</span>
                  </td>
                  <td className="p-4">{t.category}</td>
                  <td className={`p-4 font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </td>
                  <td className={`p-4 text-right font-mono font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.amount)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'No hay transacciones para mostrar.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       {/* Pagination Controls */}
       {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
            >
                Anterior
            </button>
            <span className="text-gray-400">
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
      )}
    </div>
  );
};

export default Database;