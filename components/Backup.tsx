import React, { useRef } from 'react';
import { Transaction, BackupData } from '../types';

interface BackupProps {
    transactions: Transaction[];
    categories: string[];
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


const Backup: React.FC<BackupProps> = ({ transactions, categories, onRestore, onNavigateBack }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateBackup = () => {
        const backupData: BackupData = {
            transactions,
            categories,
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
                
                // Basic validation
                if (!Array.isArray(data.transactions) || !Array.isArray(data.categories) || !data.backupDate) {
                    throw new Error("El archivo de copia de seguridad no es válido o está corrupto.");
                }

                onRestore(data);

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
                        Guarda todas tus transacciones y categorías en un archivo JSON seguro. Podrás usar este archivo para restaurar tus datos en cualquier momento.
                    </p>
                    <button 
                        onClick={handleCreateBackup}
                        disabled={transactions.length === 0}
                        className="w-full flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg shadow-pink-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                    >
                        Descargar Copia (JSON)
                        <DownloadCloudIcon />
                    </button>
                    {transactions.length === 0 && (
                        <p className="text-sm text-gray-400 mt-2 text-center">No hay transacciones para crear una copia de seguridad.</p>
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