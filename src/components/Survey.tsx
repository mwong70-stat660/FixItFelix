import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface SurveyProps {
  onFinish: () => void;
}

export function Survey({ onFinish }: SurveyProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    satisfaction: 5,
    usefulness: 5,
    recommendation: 5,
    subscribeLikelihood: 1,
    feedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setDone(true);
      setTimeout(onFinish, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm max-w-md mx-auto">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-semibold text-neutral-900">Thank You!</h2>
        <p className="text-neutral-500 mt-2">Your feedback has been securely stored.</p>
      </motion.div>
    );
  }

  const Question = ({ title, field, min = 1, max = 5, labels = ['Poor', 'Excellent'] }: any) => (
    <div className="space-y-6">
       <h3 className="text-xl font-medium text-neutral-900">{title}</h3>
       <div className="flex justify-between px-2">
         {Array.from({length: max - min + 1}).map((_, i) => {
           const val = min + i;
           return (
             <button
               key={val}
               onClick={() => setFormData(p => ({ ...p, [field]: val }))}
               className={`w-12 h-12 rounded-full font-medium transition-all ${
                 formData[field as keyof typeof formData] === val 
                 ? 'bg-blue-600 text-white scale-110 shadow-md' 
                 : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
               }`}
             >
               {val}
             </button>
           )
         })}
       </div>
       <div className="flex justify-between text-sm text-neutral-400 font-medium px-2">
         <span>{labels[0]}</span>
         <span>{labels[1]}</span>
       </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-sm border border-neutral-100"
    >
      <div className="mb-8 flex justify-between items-center border-b border-neutral-100 pb-4">
        <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Feedback Survey</span>
        <span className="text-sm font-medium text-blue-600">Step {step + 1} of 5</span>
      </div>

      <div className="min-h-[250px]">
        {step === 0 && <Question title="Overall Satisfaction with FixItFelix?" field="satisfaction" />}
        {step === 1 && <Question title="How useful were the repair guides?" field="usefulness" />}
        {step === 2 && <Question title="How likely are you to recommend us?" field="recommendation" min={1} max={10} labels={['Not Likely', 'Very Likely']} />}
        {step === 3 && <Question title="Likelihood to pay $4.99/mo for Pro features?" field="subscribeLikelihood" />}
        {step === 4 && (
          <div className="space-y-4">
             <h3 className="text-xl font-medium text-neutral-900">Any additional thoughts?</h3>
             <textarea 
               className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
               rows={4}
               placeholder="Tell us what you liked or how we can improve..."
               value={formData.feedback}
               onChange={(e) => setFormData(p => ({...p, feedback: e.target.value}))}
             />
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-between">
        <button 
           disabled={step === 0}
           onClick={() => setStep(s => s - 1)}
           className="px-6 py-3 text-neutral-500 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:text-neutral-900 transition"
        >
          Back
        </button>
        
        {step < 4 ? (
          <button 
             onClick={() => setStep(s => s + 1)}
             className="px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition"
          >
            Next
          </button>
        ) : (
          <button 
             onClick={handleSubmit}
             disabled={loading}
             className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium flex items-center hover:bg-blue-700 transition"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit
          </button>
        )}
      </div>
    </motion.div>
  );
}
