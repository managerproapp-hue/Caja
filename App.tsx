import React, { useState } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import SmartImport from './components/SmartImport';
import Database from './components/Database';
import Backup from './components/Backup';
import Settings from './components/Settings';
import Accounts from './components/Accounts';
import AnnualComparison from './components/AnnualComparison';
import { Transaction, BackupData, BankAccount } from './types';
import { mockTransactions } from './data/mockData';

type Page = 'welcome' | 'dashboard' | 'import' | 'database' | 'backup' | 'settings' | 'accounts' | 'annual-comparison';

const initialCategories = [
    'Supermercado', 'Gasolina', 'Ocio', 'Servicios', 'Salud', 
    'Transporte', 'Viajes', 'Electrónica', 'Ropa', 'Regalos', 'Otros',
    'Salario', 'Freelance', 'Inversiones', 'Sin Categorizar'
];


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const handleImportTransactions = (newTransactions: Transaction[]) => {
    setTransactions(prev => [...prev, ...newTransactions]);
    setCurrentPage('dashboard');
  };

  const handleRestoreBackup = (data: BackupData) => {
    setTransactions(data.transactions);
    setCategories(data.categories);
    setBankAccounts(data.bankAccounts || []); // Handle backups without accounts
    alert(`Copia de seguridad restaurada con éxito. Se cargaron ${data.transactions.length} transacciones.`);
    setCurrentPage('dashboard');
  }

  const handleAddCategory = (newCategory: string) => {
    if (newCategory && !categories.find(c => c.toLowerCase() === newCategory.toLowerCase())) {
        setCategories(prev => [...prev, newCategory].sort());
    } else {
        alert("La categoría no puede estar vacía o ya existe.");
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (categoryToDelete === 'Sin Categorizar') {
        alert("La categoría 'Sin Categorizar' no se puede eliminar.");
        return;
    }
    setCategories(prev => prev.filter(c => c !== categoryToDelete));
  };

  const handleAddBankAccount = (account: Omit<BankAccount, 'id'>) => {
      const newAccount: BankAccount = { ...account, id: `account-${Date.now()}` };
      setBankAccounts(prev => [...prev, newAccount]);
  };

  const handleDeleteBankAccount = (accountId: string) => {
      setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
                  transactions={transactions} 
                  onNavigateToWelcome={() => navigateTo('welcome')} 
                  onNavigateToImport={() => navigateTo('import')}
                  onNavigateToDatabase={() => navigateTo('database')}
                  onNavigateToBackup={() => navigateTo('backup')}
                  onNavigateToSettings={() => navigateTo('settings')}
                  onNavigateToAccounts={() => navigateTo('accounts')}
                  onNavigateToAnnualComparison={() => navigateTo('annual-comparison')}
               />;
      case 'import':
        return <SmartImport 
                  onImport={handleImportTransactions} 
                  onCancel={() => navigateTo('dashboard')}
                  existingTransactions={transactions}
                  availableCategories={categories}
                  bankAccounts={bankAccounts}
               />;
      case 'database':
        return <Database
                  transactions={transactions}
                  onNavigateBack={() => navigateTo('dashboard')}
                />;
       case 'backup':
        return <Backup
                  transactions={transactions}
                  categories={categories}
                  bankAccounts={bankAccounts}
                  onRestore={handleRestoreBackup}
                  onNavigateBack={() => navigateTo('dashboard')}
                />;
      case 'settings':
        return <Settings
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onNavigateBack={() => navigateTo('dashboard')}
                />;
      case 'accounts':
        return <Accounts
                    accounts={bankAccounts}
                    onAddAccount={handleAddBankAccount}
                    onDeleteAccount={handleDeleteBankAccount}
                    onNavigateBack={() => navigateTo('dashboard')}
                />;
      case 'annual-comparison':
        return <AnnualComparison
                    transactions={transactions}
                    onNavigateBack={() => navigateTo('dashboard')}
                />;
      case 'welcome':
      default:
        return <Welcome onNavigate={() => navigateTo('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {renderPage()}
    </div>
  );
};

export default App;