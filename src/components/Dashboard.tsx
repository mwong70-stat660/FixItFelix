import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import { RefreshCcw, HandPlatter } from 'lucide-react';

export function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-12 flex justify-center"><RefreshCcw className="w-8 h-8 animate-spin text-neutral-400" /></div>;
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-500">
         <HandPlatter className="w-12 h-12 mx-auto mb-4 opacity-50" />
         <p>No survey data available yet.</p>
      </div>
    );
  }

  // Aggregations
  const avgSat = (data.reduce((acc, c) => acc + c.satisfaction, 0) / data.length).toFixed(1);
  const avgUse = (data.reduce((acc, c) => acc + c.usefulness, 0) / data.length).toFixed(1);

  const npsPromoters = data.filter(d => d.recommendation >= 9).length;
  const npsDetractors = data.filter(d => d.recommendation <= 6).length;
  const npsScore = Math.round(((npsPromoters - npsDetractors) / data.length) * 100);

  const subData = [
    { name: 'Unlikely (1-2)', value: data.filter(d => d.subscribeLikelihood <= 2).length },
    { name: 'Neutral (3)', value: data.filter(d => d.subscribeLikelihood === 3).length },
    { name: 'Likely (4-5)', value: data.filter(d => d.subscribeLikelihood >= 4).length },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  const barData = [
    { name: 'Satisfaction', score: parseFloat(avgSat) },
    { name: 'Usefulness', score: parseFloat(avgUse) }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto space-y-8">
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Survey Dashboard</h1>
          <button onClick={fetchDashboard} className="p-2 text-neutral-500 hover:text-neutral-900 bg-white rounded-full border border-neutral-200">
            <RefreshCcw className="w-5 h-5" />
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
             <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Total Responses</p>
             <p className="text-4xl font-semibold text-neutral-900">{data.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
             <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Net Promoter Score</p>
             <p className={`text-4xl font-semibold ${npsScore > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{npsScore}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
             <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Avg Satisfaction</p>
             <p className="text-4xl font-semibold text-blue-600">{avgSat} <span className="text-lg text-neutral-400 font-normal">/ 5</span></p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-80 flex flex-col">
             <h3 className="text-lg font-medium text-neutral-900 mb-6">Core Metrics (Out of 5)</h3>
             <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 14}} />
                   <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#737373'}} />
                   <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={60} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-80 flex flex-col">
             <h3 className="text-lg font-medium text-neutral-900 mb-2">Subscription Likelihood</h3>
             <div className="flex-1 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={subData}
                     innerRadius={60}
                     outerRadius={90}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {subData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center -translate-y-4">
                 <div className="text-center">
                    <p className="text-2xl font-semibold text-neutral-900">{subData[2].value}</p>
                    <p className="text-xs text-neutral-500 uppercase">Likely</p>
                 </div>
               </div>
             </div>
          </div>
       </div>
    </motion.div>
  );
}
