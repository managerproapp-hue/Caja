import React, { useState } from 'react';

interface SettingsProps {
    categories: string[];
    onAddCategory: (category: string) => void;
    onDeleteCategory: (category: string) => void;
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


const Settings: React.FC<SettingsProps> = ({ categories, onAddCategory, onDeleteCategory, onNavigateBack }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddClick = () => {
        onAddCategory(newCategory.trim());
        setNewCategory('');
    };
    
    const handleDeleteClick = (category: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category}"?`)) {
            onDeleteCategory(category);
        }
    }

    const protectedCategory = "Sin Categorizar";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <div className="absolute top-8 right-8">
                 <button onClick={onNavigateBack} className="text-sm text-gray-400 hover:text-white transition">
                    &larr; Volver al Panel
                </button>
            </div>
            <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Gestionar Categorías de Gasto</h1>
                
                {/* Add Category Form */}
                <div className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nombre de la nueva categoría"
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-violet-500 focus:border-violet-500"
                        />
                        <button 
                            onClick={handleAddClick}
                            className="flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            <PlusCircleIcon />
                            Añadir
                        </button>
                    </div>
                </div>

                {/* Current Categories List */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">Categorías Actuales</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {categories.map(category => (
                            <div key={category} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                                <span className="font-medium">{category}</span>
                                {category !== protectedCategory && (
                                     <button 
                                        onClick={() => handleDeleteClick(category)}
                                        className="text-rose-400 hover:text-rose-500 p-2 rounded-md hover:bg-rose-500/10 transition-colors"
                                        title={`Eliminar categoría "${category}"`}
                                    >
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
