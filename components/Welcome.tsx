import React from 'react';

interface WelcomeProps {
  onNavigate: () => void;
}

const PiggyBankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-violet-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);


const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div 
        className="max-w-md w-full text-center bg-gray-500/10 backdrop-blur-xl p-8 rounded-2xl border border-gray-500/20 shadow-2xl shadow-violet-500/10"
      >
        <PiggyBankIcon />
        <h1 className="text-4xl font-bold text-white mb-3">
          Bienvenido a tu Panel de Presupuesto
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Visualiza tus finanzas, importa extractos bancarios con IA y toma el control de tu dinero de forma sencilla y potente.
        </p>
        <button
          onClick={onNavigate}
          className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Empezar Ahora
          <SparklesIcon />
        </button>
      </div>
    </div>
  );
};

export default Welcome;