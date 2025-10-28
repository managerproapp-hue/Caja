import React, { useState } from 'react';
import { Transaction, ReviewTransaction, AIResponse, BankAccount } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface SmartImportProps {
  onImport: (transactions: Transaction[]) => void;
  onCancel: () => void;
  existingTransactions: Transaction[];
  availableCategories: string[];
  bankAccounts: BankAccount[];
}

type ImportPhase = 'upload' | 'loading' | 'review';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

const SmartImport: React.FC<SmartImportProps> = ({ onImport, onCancel, existingTransactions, availableCategories, bankAccounts }) => {
  const [phase, setPhase] = useState<ImportPhase>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState('');
  const [context, setContext] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [reviewTransactions, setReviewTransactions] = useState<ReviewTransaction[]>([]);
  const [processingErrors, setProcessingErrors] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !source) {
      setError('La cuenta de origen y al menos un archivo son obligatorios.');
      return;
    }
    setError(null);
    setPhase('loading');

    try {
      const fileParts = await Promise.all(
          files.map(async (file) => {
              const base64Data = await fileToBase64(file);
              return {
                  inlineData: {
                      mimeType: file.type,
                      data: base64Data,
                  },
              };
          })
      );
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const uniqueCategories = [...new Set(existingTransactions.map(t => t.category).concat(availableCategories))];
      const fewShotExamples = existingTransactions.slice(-5).map(t => ({
          descripcion: t.description,
          importe: t.type === 'expense' ? -t.amount : t.amount,
          categoria: t.category,
      }));

      const selectedAccount = bankAccounts.find(acc => acc.accountName === source);

      const prompt = `
        Eres un experto en procesar datos financieros de extractos bancarios de varios formatos de archivo (PDF, Excel, CSV, texto plano).
        Tu tarea es analizar los archivos proporcionados, extraer cada transacción y clasificarla.
        
        **Contexto del Usuario:**
        - Fuente de los datos (Cuenta): ${selectedAccount?.bankName} - ${selectedAccount?.accountName} (${selectedAccount?.accountNumber})
        - Contexto adicional: ${context || 'No proporcionado'}
        - Lista de categorías de gastos disponibles: ${uniqueCategories.join(', ')}
        
        **Aprendizaje Histórico (Ejemplos):**
        Aquí tienes ejemplos de cómo el usuario ha clasificado transacciones previamente. Usa esto para mantener la consistencia.
        ${JSON.stringify(fewShotExamples, null, 2)}

        **Instrucciones:**
        1. Procesa los archivos adjuntos. Pueden ser PDF, XLS, XLSX, CSV o TXT.
        2. Normaliza los datos: convierte fechas a formato 'YYYY-MM-DD', y asegúrate de que los importes sean números.
        3. Identifica transacciones: Cada transacción tiene fecha, descripción e importe.
        4. Clasifica el tipo: Importes negativos o que indiquen un pago son 'gasto'. Importes positivos son 'ingreso'. Para ingresos, la categoría suele ser 'Salario', 'Freelance', 'Inversiones', etc.
        5. Asigna Categoría: Para cada gasto, asigna la categoría más lógica de la lista proporcionada. Si la descripción es similar a un ejemplo histórico, usa la misma categoría. Para ingresos, usa una categoría descriptiva como "Ingreso por Salario" o "Ingreso Varios". Si no estás seguro, usa 'Sin Categorizar'.
        6. Manejo de errores: Si una línea o entrada en un archivo no parece ser una transacción válida, ignórala y repórtala en la sección de 'errores'.
        
        Analiza los archivos y devuelve el JSON estructurado como se te ha indicado.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, ...fileParts] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transacciones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fecha: { type: Type.STRING, description: "Fecha en formato YYYY-MM-DD" },
                    descripcion: { type: Type.STRING },
                    importe: { type: Type.NUMBER },
                    tipo: { type: Type.STRING, enum: ['ingreso', 'gasto'] },
                    categoriaSugerida: { type: Type.STRING },
                  },
                  required: ['fecha', 'descripcion', 'importe', 'tipo', 'categoriaSugerida'],
                },
              },
              errores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    linea: { type: Type.STRING, description: "La línea de texto que no se pudo procesar" },
                    error: { type: Type.STRING, description: "La razón del error" },
                  },
                  required: ['linea', 'error'],
                },
              },
            },
            required: ['transacciones', 'errores'],
          },
        },
      });
      
      const aiResponse: AIResponse = JSON.parse(response.text);

      setReviewTransactions(aiResponse.transacciones.map((t, i) => ({ ...t, id: `review-${i}` })));
      setProcessingErrors(aiResponse.errores);
      setPhase('review');

    } catch (e: any) {
      console.error(e);
      setError(`Error al analizar el archivo: ${e.message}`);
      setPhase('upload');
    }
  };
  
  const handleCategoryChange = (id: string, newCategory: string) => {
    setReviewTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, categoriaSugerida: newCategory } : t)
    );
  };
  
  const handleConfirmImport = () => {
    const newTransactions: Transaction[] = reviewTransactions.map((t, index) => ({
      id: `imported-${Date.now()}-${index}`,
      date: t.fecha,
      description: t.descripcion,
      amount: Math.abs(t.importe),
      type: t.importe < 0 ? 'expense' : 'income',
      category: t.categoriaSugerida,
      source: source, // Asignar la fuente a TODAS las transacciones
    }));
    onImport(newTransactions);
  };


  if (phase === 'loading') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
            <h2 className="text-2xl font-semibold text-white mt-6">Analizando archivos...</h2>
            <p className="text-gray-400 mt-2">La IA está procesando tus extractos. Esto puede tardar unos segundos.</p>
        </div>
    );
  }

  if (phase === 'review') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Revisar y Confirmar Importación</h1>
        
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Transacciones Identificadas de: <span className="text-violet-400">{source}</span></h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-3">Fecha</th>
                            <th className="p-3">Descripción</th>
                            <th className="p-3 text-right">Importe</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Categoría Sugerida</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviewTransactions.map(t => (
                            <tr key={t.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                                <td className="p-3">{t.fecha}</td>
                                <td className="p-3">{t.descripcion}</td>
                                <td className={`p-3 text-right font-mono ${t.importe > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.importe)}
                                </td>
                                <td className="p-3 capitalize">{t.tipo}</td>
                                <td className="p-3">
                                    <select 
                                        value={t.categoriaSugerida}
                                        onChange={(e) => handleCategoryChange(t.id, e.target.value)}
                                        className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full focus:ring-violet-500 focus:border-violet-500"
                                    >
                                        {[...new Set(['Sin Categorizar', ...availableCategories])].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {processingErrors.length > 0 && (
             <div className="bg-red-900/50 border border-red-500/50 rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-yellow-300">Errores de Procesamiento</h2>
                <ul className="list-disc pl-5 space-y-2 font-mono text-sm">
                    {processingErrors.map((err, i) => (
                        <li key={i}><strong>Línea no procesada:</strong> "{err.linea}" <br/> <strong>Motivo:</strong> {err.error}</li>
                    ))}
                </ul>
            </div>
        )}

        <div className="flex justify-end space-x-4">
            <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition">Cancelar</button>
            <button onClick={handleConfirmImport} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg transition">Confirmar e Importar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Importación Inteligente de Datos</h1>
        <p className="text-gray-400 mb-6">Sube tus extractos bancarios (PDF, XLS, CSV, TXT) y deja que la IA organice tus transacciones.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-1">Cuenta de Origen (Obligatorio)</label>
            <select 
              id="source" 
              value={source} 
              onChange={e => setSource(e.target.value)} 
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="" disabled>Selecciona una cuenta</option>
              {bankAccounts.map(account => (
                <option key={account.id} value={account.accountName}>{account.accountName} ({account.bankName})</option>
              ))}
            </select>
            {bankAccounts.length === 0 && <p className="text-xs text-yellow-400 mt-1">No hay cuentas bancarias. Añade una desde el panel de Cuentas Bancarias.</p>}
          </div>
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-300 mb-1">Contexto Adicional (Opcional)</label>
            <input type="text" id="context" value={context} onChange={e => setContext(e.target.value)} placeholder="Ej: Extracto de mayo 2024" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-violet-500 focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Archivos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-violet-400 hover:text-violet-500 focus-within:outline-none">
                    <span>Selecciona un archivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".txt,.csv,.xls,.xlsx,.pdf" />
                  </label>
                  <p className="pl-1">o arrástralo aquí</p>
                </div>
                <p className="text-xs text-gray-500">PDF, XLS, XLSX, CSV, TXT</p>
              </div>
            </div>
             {files.length > 0 && <div className="mt-2 text-sm text-gray-300">{files.map(f => f.name).join(', ')}</div>}
          </div>
        </div>
        
        {error && <p className="mt-4 text-red-400">{error}</p>}

        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition">Cancelar</button>
          <button onClick={handleAnalyze} disabled={!source || files.length === 0} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed">Analizar Archivo</button>
        </div>
      </div>
    </div>
  );
};

export default SmartImport;