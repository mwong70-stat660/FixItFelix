import React, { useState } from 'react';
import { Settings, Wrench, Menu } from 'lucide-react';
import { Scanner } from './components/Scanner';
import { Results } from './components/Results';
import { BetaProgram } from './components/BetaProgram';
import { Survey } from './components/Survey';
import { Dashboard } from './components/Dashboard';

type ViewState = 'scan' | 'results' | 'beta' | 'survey' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('scan');
  const [resultData, setResultData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCapture = async (imageString: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageString, mimeType: 'image/jpeg' })
      });
      const data = await res.json();
      if (res.ok) {
        setResultData(data);
        setView('results');
      } else {
        alert(data.error || 'Failed to analyze');
      }
    } catch (err) {
      console.error(err);
      alert('Error analyzing image. Make sure GEMINI_API_KEY is configured.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setView('scan')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:bg-blue-700 transition">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-neutral-900">FixItFelix</span>
          </div>
          
          <div className="flex z-50">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-neutral-500 hover:text-neutral-900 transition relative"
            >
              <Menu className="w-6 h-6" />
              {menuOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-neutral-100 shadow-xl rounded-2xl py-2 flex flex-col items-stretch overflow-hidden">
                   <button 
                     onClick={() => { setView('scan'); setMenuOpen(false); }}
                     className="px-4 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 w-full"
                   >
                     Home (Scan)
                   </button>
                   <button 
                     onClick={() => { setView('dashboard'); setMenuOpen(false); }}
                     className="px-4 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 w-full"
                   >
                     KPI Dashboard
                   </button>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full">
        {view === 'scan' && (
           <Scanner onCapture={handleCapture} isAnalyzing={isAnalyzing} />
        )}

        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          {view === 'results' && resultData && (
            <Results 
              data={resultData} 
              onReset={() => { setResultData(null); setView('scan'); }}
              onNext={() => setView('beta')}
            />
          )}

          {view === 'beta' && (
            <BetaProgram onSurvey={() => setView('survey')} />
          )}

          {view === 'survey' && (
            <Survey onFinish={() => setView('dashboard')} />
          )}

          {view === 'dashboard' && (
            <Dashboard />
          )}
        </div>
      </main>
    </div>
  );
}
