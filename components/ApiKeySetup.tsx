import React from 'react';

interface ApiKeySetupProps {
  onSelectKey: () => void;
}

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-violet-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);


const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSelectKey }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div 
        className="max-w-md w-full text-center bg-gray-500/10 backdrop-blur-xl p-8 rounded-2xl border border-gray-500/20 shadow-2xl shadow-violet-500/10"
      >
        <KeyIcon />
        <h1 className="text-4xl font-bold text-white mb-3">
          Configuración Requerida
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Para activar las funciones de Inteligencia Artificial, como la importación automática, necesitas configurar tu clave de API de Google AI Studio.
        </p>
        <button
          onClick={onSelectKey}
          className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Configurar Clave de API
        </button>
      </div>
    </div>
  );
};

export default ApiKeySetup;