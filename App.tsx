
import React, { useState } from 'react';
import { AnalysisState, AnalysisResult } from './types';
import { summarizeWebsite } from './services/geminiService';
import { getTechnicalInfo } from './services/techService';
import AnalysisForm from './components/AnalysisForm';
import InfoCard from './components/InfoCard';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalysis = async (url: string) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      // Execute both analysis tasks. Technical info usually fails first if domain is invalid.
      const [techInfo, aiResult] = await Promise.all([
        getTechnicalInfo(url),
        summarizeWebsite(url)
      ]);

      const result: AnalysisResult = {
        summary: aiResult.summary,
        category: aiResult.category,
        technical: techInfo,
        url,
        timestamp: Date.now()
      };

      setState({
        isLoading: false,
        error: null,
        result
      });
    } catch (err: any) {
      console.error("Erro na análise:", err);
      setState({
        isLoading: false,
        error: err.message || 'Ocorreu um erro inesperado. Tente novamente em instantes.',
        result: null
      });
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      {/* Header Section */}
      <header className="pt-12 pb-8 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-indigo-600 p-3 rounded-2xl mb-6 shadow-xl shadow-indigo-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">SiteInsight</h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          Análise inteligente de domínios e conteúdo web.
        </p>
      </header>

      <main className="px-6 max-w-4xl mx-auto">
        {/* Search Input */}
        <section className="mb-12">
          <AnalysisForm onAnalyze={handleAnalysis} isLoading={state.isLoading} />
        </section>

        {/* Error Feedback */}
        {state.error && (
          <div className="bg-white border-l-4 border-red-500 p-6 rounded-2xl shadow-sm text-red-700 flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
            <div className="bg-red-50 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold mb-1">Ops! Algo deu errado</p>
              <p className="text-sm opacity-90">{state.error}</p>
              <p className="text-xs mt-2 text-red-400">Dica: Verifique se a URL está digitada corretamente e se o site está acessível publicamente.</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {state.result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            
            {/* Summary Card */}
            <div className="glass-card p-8 rounded-3xl shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
                  {state.result.category}
                </span>
                <div className="flex items-center text-xs text-slate-400 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Analizado em {new Date(state.result.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Resumo do Conteúdo</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {state.result.summary}
              </p>
            </div>

            {/* Technical Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-700 ml-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Infraestrutura & Domínio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard 
                  label="Endereço IP" 
                  value={state.result.technical.ip} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>}
                />
                <InfoCard 
                  label="Localização Física" 
                  value={`${state.result.technical.country} (${state.result.technical.location})`} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                />
                <InfoCard 
                  label="Empresa / Host" 
                  value={state.result.technical.provider} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" clipRule="evenodd" /></svg>}
                />
                <InfoCard 
                  label="Protocolo Utilizado" 
                  value={state.result.technical.protocol} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746A2 2 0 0119 6.753V11a9 9 0 01-9 9 9 9 0 01-9-9V6.753a2 2 0 011.166-1.853zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>}
                />
                <div className="md:col-span-2">
                  <div className={`flex items-center space-x-3 p-4 rounded-2xl border ${state.result.technical.status === 'online' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    <div className={`h-3 w-3 rounded-full ${state.result.technical.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-bold uppercase tracking-wider text-sm">
                      Status: {state.result.technical.status === 'online' ? 'Site Online / DNS Respondendo' : 'Problemas de Conectividade'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!state.result && !state.isLoading && !state.error && (
          <div className="mt-20 text-center opacity-30 select-none">
            <div className="relative inline-block">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <p className="text-slate-500 font-semibold text-lg">Insira uma URL para começar a descoberta</p>
            <p className="text-slate-400 text-sm mt-2">Ex: google.com, wikipedia.org, mercadolivre.com.br</p>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto pt-16 pb-8 text-center text-slate-400 text-xs">
        <div className="flex items-center justify-center space-x-2 mb-2">
           <div className="h-px w-8 bg-slate-200" />
           <span className="font-medium tracking-widest uppercase">Tecnologia Insight Engine</span>
           <div className="h-px w-8 bg-slate-200" />
        </div>
        <p>
          &copy; {new Date().getFullYear()} SiteInsight • Desenvolvido por{' '}
          <a 
            href="https://ridolfiweb.com.br" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-400 hover:text-indigo-600 transition-colors font-semibold underline underline-offset-2"
          >
            RidolfiWEB
          </a>{' '}
          com Gemini AI
        </p>
      </footer>
    </div>
  );
};

export default App;
