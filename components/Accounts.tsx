import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AccountsProps {
    accounts: BankAccount[];
    onAddAccount: (account: Omit<BankAccount, 'id'>) => void;
    onDeleteAccount: (accountId: string) => void;
    onNavigateBack: () => void;
}

const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TrashIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const Accounts: React.FC<AccountsProps> = ({ accounts, onAddAccount, onDeleteAccount, onNavigateBack }) => {
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const handleAddClick = () => {
        if (!bankName.trim() || !accountName.trim() || !accountNumber.trim()) {
            alert("Todos los campos son obligatorios.");
            return;
        }
        onAddAccount({ bankName, accountName, accountNumber });
        setBankName('');
        setAccountName('');
        setAccountNumber('');
    };
    
    const handleDeleteClick = (account: BankAccount) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la cuenta "${account.accountName}"?`)) {
            onDeleteAccount(account.id);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <div className="absolute top-8 right-8">
                 <button onClick={onNavigateBack} className="text-sm text-gray-400 hover:text-white transition">
                    &larr; Volver al Panel
                </button>
            </div>
            <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Gestionar Cuentas Bancarias</h1>
                
                {/* Add Account Form */}
                <div className="mb-8 p-6 bg-gray-700/50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Añadir Nueva Cuenta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Nombre del Banco (Ej: Cajamar)"
                            className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-violet-500 focus:border-violet-500"
                        />
                         <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="Alias de la cuenta (Ej: Nómina)"
                            className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-violet-500 focus:border-violet-500"
                        />
                         <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Número de Cuenta / IBAN"
                            className="bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={handleAddClick}
                            className="flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            <PlusCircleIcon />
                            Añadir Cuenta
                        </button>
                    </div>
                </div>

                {/* Current Accounts List */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Cuentas Actuales</h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {accounts.length > 0 ? accounts.map(account => (
                            <div key={account.id} className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
                                <div>
                                    <p className="font-bold text-lg">{account.accountName} <span className="text-sm font-normal text-gray-400">- {account.bankName}</span></p>
                                    <p className="font-mono text-gray-300 text-sm">{account.accountNumber}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteClick(account)}
                                    className="text-rose-400 hover:text-rose-500 p-2 rounded-md hover:bg-rose-500/10 transition-colors"
                                    title={`Eliminar cuenta "${account.accountName}"`}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        )) : (
                             <div className="text-center p-8 text-gray-400 bg-gray-700/50 rounded-lg">
                                No has añadido ninguna cuenta bancaria todavía.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accounts;