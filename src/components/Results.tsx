import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Youtube, MapPin, Search, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { AIVideoTab } from './AIVideoTab';
import { ExportToSlides } from './ExportToSlides';

interface ResultData {
  appliance: string;
  brand: string;
  guides: string[];
  partsPrompt: string;
  youtubeQuery: string;
}

interface ResultsProps {
  data: ResultData;
  onReset: () => void;
  onNext: () => void; // move to Beta testing
}

export function Results({ data, onReset, onNext }: ResultsProps) {
  const [activeTab, setActiveTab] = useState<'guides' | 'ai' | 'videos' | 'parts'>('guides');
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExtras() {
      setLoadingExtras(true);
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partsPrompt: data.partsPrompt, youtubeQuery: data.youtubeQuery })
        });
        const json = await res.json();
        setVideos(json.videos || []);
        setParts(json.parts || []);
      } catch (err) {
        console.error('Error fetching extras:', err);
      } finally {
        setLoadingExtras(false);
      }
    }
    fetchExtras();
  }, [data]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
        <p className="text-sm font-medium text-blue-600 tracking-wider uppercase mb-1">Identified</p>
        <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight leading-tight">
          {data.brand} <br/> <span className="text-neutral-500">{data.appliance}</span>
        </h1>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
           {['guides', 'ai', 'videos', 'parts'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={cn(
                 "flex-1 px-6 py-4 text-sm font-medium capitalize transition-colors whitespace-nowrap flex items-center justify-center gap-1.5",
                 activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-neutral-500 hover:text-neutral-800"
               )}
             >
               {tab === 'ai' && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
               {tab}
             </button>
           ))}
        </div>

        <div className="p-6 sm:p-8 min-h-[300px]">
          {activeTab === 'guides' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <h3 className="flex items-center text-lg font-medium text-neutral-900 mb-6">
                 <Wrench className="w-5 h-5 mr-3 text-neutral-400" />
                 Troubleshooting Steps
               </h3>
               <div className="space-y-3">
                 {data.guides.map((guide, i) => (
                   <div key={i} className="flex gap-4 items-start p-4 bg-neutral-50 rounded-2xl">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                        {i + 1}
                      </div>
                      <p className="text-neutral-700 leading-relaxed pt-1">{guide}</p>
                   </div>
                 ))}
               </div>
               <ExportToSlides appliance={data.appliance} brand={data.brand} guides={data.guides} />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <AIVideoTab appliance={data.appliance} brand={data.brand} guides={data.guides} />
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="flex items-center text-lg font-medium text-neutral-900 mb-6">
                 <Youtube className="w-5 h-5 mr-3 text-red-500" />
                 DIY Video Tutorials
              </h3>
              {loadingExtras ? (
                 <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-neutral-100 rounded-2xl"></div>
                    <div className="h-20 bg-neutral-100 rounded-2xl"></div>
                 </div>
              ) : videos.length > 0 ? (
                 <div className="space-y-3">
                   {videos.map((vid, i) => (
                     <a key={i} href={vid.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition group border border-transparent hover:border-neutral-200">
                        <span className="text-neutral-800 font-medium group-hover:text-blue-600 transition">{vid.title}</span>
                        <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition -translate-x-2 group-hover:translate-x-0" />
                     </a>
                   ))}
                 </div>
              ) : (
                <p className="text-neutral-500">No videos found.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'parts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <h3 className="flex items-center text-lg font-medium text-neutral-900 mb-6">
                 <Search className="w-5 h-5 mr-3 text-emerald-500" />
                 Price Comparison & Parts
               </h3>
               {loadingExtras ? (
                 <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-neutral-100 rounded-2xl"></div>
                    <div className="h-16 bg-neutral-100 rounded-2xl"></div>
                 </div>
              ) : parts.length > 0 ? (
                 <div className="space-y-3">
                   {parts.map((p, i) => (
                     <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 gap-4">
                        <div>
                          <p className="font-medium text-neutral-900">{p.partName}</p>
                          <p className="text-sm text-neutral-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" /> {p.store}
                          </p>
                        </div>
                        <div className="flex flex-col items-end whitespace-nowrap">
                          <span className="text-lg font-semibold text-emerald-600">${p.price?.toFixed(2)}</span>
                          <span className="text-xs text-neutral-400 flex items-center mt-1"><Truck className="w-3 h-3 mr-1" /> +$5.99 Ship</span>
                        </div>
                     </div>
                   ))}
                 </div>
              ) : (
                <p className="text-neutral-500">No parts found instantly.</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={onReset}
          className="flex-1 py-4 text-neutral-600 bg-white border border-neutral-200 rounded-full font-medium hover:bg-neutral-50 transition"
        >
          Scan Another
        </button>
        <button 
          onClick={onNext}
          className="flex-1 py-4 text-white bg-neutral-900 rounded-full font-medium hover:bg-neutral-800 transition"
        >
          Take A Survey
        </button>
      </div>
    </motion.div>
  );
}
