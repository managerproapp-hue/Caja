import React, { useRef, useState, useMemo } from 'react';
import { Transaction, BackupData, BankAccount } from '../types';

interface BackupProps {
    transactions: Transaction[];
    categories: string[];
    bankAccounts: BankAccount[];
    onRestore: (data: BackupData) => void;
    onNavigateBack: () => void;
}

const DownloadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-4 4m4-4l4 4m-4-4v9" />
    </svg>
);

const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-4-4m4 4l4-4m-4-4v9" />
    </svg>
);


const Backup: React.FC<BackupProps> = ({ transactions, categories, bankAccounts, onRestore, onNavigateBack }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [transactionFilter, setTransactionFilter] = useState<'all' | '6months' | 'lastyear' | 'range' | 'none'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [backupSelection, setBackupSelection] = useState({
        categories: true,
        bankAccounts: true,
    });
    
    const filteredTransactions = useMemo(() => {
        const now = new Date();
        switch (transactionFilter) {
            case '6months':
                const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                return transactions.filter(t => new Date(t.date) >= sixMonthsAgo);
            case 'lastyear':
                const lastYear = now.getFullYear() - 1;
                return transactions.filter(t => new Date(t.date).getFullYear() === lastYear);
            case 'range':
                if (!startDate || !endDate) return [];
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Include the whole end day
                return transactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= start && transactionDate <= end;
                });
            case 'none':
                return [];
            case 'all':
            default:
                return transactions;
        }
    }, [transactions, transactionFilter, startDate, endDate]);

    const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setBackupSelection(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const isAnyDataToBackup = transactions.length > 0 || categories.length > 0 || bankAccounts.length > 0;
    const isAnythingSelected = (transactionFilter !== 'none' && filteredTransactions.length > 0) || backupSelection.categories || backupSelection.bankAccounts;


    const handleCreateBackup = () => {
        const backupData: BackupData = {
            transactions: filteredTransactions,
            categories: backupSelection.categories ? categories : [],
            bankAccounts: backupSelection.bankAccounts ? bankAccounts : [],
            backupDate: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `budget-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm("¿Estás seguro de que quieres restaurar desde este archivo? Todos los datos actuales se reemplazarán.")) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not readable");

                const data = JSON.parse(text) as BackupData;
                
                if (!Array.isArray(data.transactions) || !Array.isArray(data.categories) || !data.backupDate) {
                    throw new Error("El archivo de copia de seguridad no es válido o está corrupto.");
                }

                const restoredData: BackupData = {
                    ...data,
                    bankAccounts: data.bankAccounts || [],
                };

                onRestore(restoredData);

            } catch (error: any) {
                alert(`Error al restaurar la copia de seguridad: ${error.message}`);
            } finally {
                 if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.onerror = () => {
             alert("Error al leer el archivo.");
             if (fileInputRef.current) fileInputRef.current.value = "";
        }
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <div className="absolute top-8 right-8">
                 <button onClick={onNavigateBack} className="text-sm text-gray-400 hover:text-white transition">
                    &larr; Volver al Panel
                </button>
            </div>
            <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Gestión de Copia de Seguridad</h1>

                <div className="p-6 rounded-lg bg-gray-700/50">
                    <h2 className="text-xl font-semibold text-violet-400">Crear una Copia de Seguridad</h2>
                    <p className="text-gray-300 mt-2 mb-4">
                       Guarda tus datos en un archivo JSON seguro. Selecciona qué información deseas incluir en tu copia de seguridad.
                    </p>

                    <div className="mb-4 p-4 bg-gray-800/50 rounded-md">
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">Seleccionar datos para incluir:</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="transaction-filter" className="block text-gray-200 mb-2">Transacciones ({filteredTransactions.length})</label>
                                <select 
                                    id="transaction-filter"
                                    value={transactionFilter}
                                    onChange={(e) => setTransactionFilter(e.target.value as any)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-violet-500 focus:border-violet-500"
                                >
                                    <option value="all">Todas las transacciones</option>
                                    <option value="6months">Últimos 6 meses</option>
                                    <option value="lastyear">Año anterior</option>
                                    <option value="range">Rango de fechas</option>
                                    <option value="none">No incluir transacciones</option>
                                </select>

                                {transactionFilter === 'range' && (
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <label htmlFor="start-date" className="text-sm text-gray-400">Desde</label>
                                            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 mt-1"/>
                                        </div>
                                        <div>
                                            <label htmlFor="end-date" className="text-sm text-gray-400">Hasta</label>
                                            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 mt-1"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr className="border-gray-600"/>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="categories" checked={backupSelection.categories} onChange={handleSelectionChange} className="h-5 w-5 text-violet-500 bg-gray-700 border-gray-600 rounded focus:ring-violet-500" />
                                <span className="text-gray-200">Categorías ({categories.length})</span>
                            </label>
                             <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="bankAccounts" checked={backupSelection.bankAccounts} onChange={handleSelectionChange} className="h-5 w-5 text-violet-500 bg-gray-700 border-gray-600 rounded focus:ring-violet-500" />
                                <span className="text-gray-200">Cuentas Bancarias ({bankAccounts.length})</span>
                            </label>
                        </div>
                    </div>


                    <button 
                        onClick={handleCreateBackup}
                        disabled={!isAnyDataToBackup || !isAnythingSelected}
                        className="w-full flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg shadow-pink-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                    >
                        Descargar Copia (JSON)
                        <DownloadCloudIcon />
                    </button>
                    {!isAnyDataToBackup && (
                        <p className="text-sm text-gray-400 mt-2 text-center">No hay datos para crear una copia de seguridad.</p>
                    )}
                     {isAnyDataToBackup && !isAnythingSelected && (
                        <p className="text-sm text-yellow-400 mt-2 text-center">Debes seleccionar al menos un tipo de dato para descargar.</p>
                    )}
                </div>

                <div className="border-t border-gray-700 my-8"></div>

                <div className="p-6 rounded-lg bg-gray-700/50">
                     <h2 className="text-xl font-semibold text-blue-400">Restaurar desde un Archivo</h2>
                     <p className="text-gray-300 mt-2 mb-4">
                        <span className="font-bold text-rose-400">¡Atención!</span> Esta acción reemplazará todos los datos actuales con el contenido del archivo que subas.
                    </p>
                    <button 
                        onClick={handleRestoreClick}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg shadow-blue-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Seleccionar Archivo para Restaurar
                        <UploadCloudIcon />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelected}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
};

export default Backup;