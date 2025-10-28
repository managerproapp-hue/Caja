import React, { useState, useEffect, useCallback } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import SmartImport from './components/SmartImport';
import Database from './components/Database';
import Backup from './components/Backup';
import Settings from './components/Settings';
import Accounts from './components/Accounts';
import AnnualComparison from './components/AnnualComparison';
import ApiKeySetup from './components/ApiKeySetup';
import { Transaction, BackupData, BankAccount } from './types';
import { mockTransactions } from './data/mockData';

type Page = 'welcome' | 'dashboard' | 'import' | 'database' | 'backup' | 'settings' | 'accounts' | 'annual-comparison';

const initialCategories = [
    'Supermercado', 'Gasolina', 'Ocio', 'Servicios', 'Salud', 
    'Transporte', 'Viajes', 'Electrónica', 'Ropa', 'Regalos', 'Otros',
    'Salario', 'Freelance', 'Inversiones', 'Sin Categorizar'
];

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
        <h2 className="text-2xl font-semibold text-white mt-6">Verificando configuración...</h2>
    </div>
);


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);

  const checkApiKey = useCallback(async () => {
    setIsCheckingApiKey(true);
    let keyFound = null;
    try {
        // @ts-ignore
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            // @ts-ignore
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (hasKey) {
                keyFound = 'aistudio-managed';
            }
        }
        
        if (!keyFound) {
            const storedKey = localStorage.getItem('gemini-api-key');
            if (storedKey) {
                keyFound = storedKey;
            }
        }
    } catch (error) {
        console.error("Error checking API key:", error);
    } finally {
        setApiKey(keyFound);
        setIsCheckingApiKey(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKeyInAiStudio = async () => {
     try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        await checkApiKey();
     } catch (error) {
        console.error("Error opening select key dialog:", error);
        await checkApiKey();
     }
  };

  const handleManualApiKeySubmit = (manualKey: string) => {
      if (manualKey && manualKey.trim()) {
          localStorage.setItem('gemini-api-key', manualKey.trim());
          setApiKey(manualKey.trim());
      } else {
          alert("Por favor, introduce una clave de API válida.");
      }
  };

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
  
  if (isCheckingApiKey) {
    return <LoadingSpinner />;
  }
  
  if (!apiKey) {
    return <ApiKeySetup 
              onSelectKeyInAiStudio={handleSelectKeyInAiStudio} 
              onManualApiKeySubmit={handleManualApiKeySubmit} 
           />;
  }

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
                  apiKey={apiKey === 'aistudio-managed' ? (process.env.API_KEY as string) : apiKey}
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
