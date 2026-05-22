import React from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'motion/react';
import { Apple, Smartphone } from 'lucide-react';

interface BetaProgramProps {
  onSurvey: () => void;
}

export function BetaProgram({ onSurvey }: BetaProgramProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 text-center space-y-8"
    >
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">FixItFelix Beta</h2>
        <p className="text-neutral-500 mt-2 leading-relaxed">
          Be the first to access new diagnostic tools. Scan the code to directly install the test build on iOS or Android.
        </p>
      </div>

      <div className="bg-neutral-50 p-8 rounded-3xl inline-block border border-neutral-100">
        <QRCode value="https://fixitfelix.example.com/beta-invite" size={200} />
      </div>

      <div className="flex justify-center gap-6">
         <div className="flex items-center text-sm font-medium text-neutral-600">
            <Apple className="w-5 h-5 mr-2" /> iOS
         </div>
         <div className="flex items-center text-sm font-medium text-neutral-600">
            <Smartphone className="w-5 h-5 mr-2" /> Android
         </div>
      </div>

      <div className="pt-6 border-t border-neutral-100">
         <p className="text-sm text-neutral-500 mb-4">Help us improve the experience.</p>
         <button 
           onClick={onSurvey}
           className="w-full py-4 text-white bg-blue-600 rounded-full font-medium shadow-sm hover:bg-blue-700 hover:shadow transition"
         >
           Take the Satisfaction Survey
         </button>
      </div>
    </motion.div>
  );
}
