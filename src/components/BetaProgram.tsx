import React from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'motion/react';

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
        <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">Take a Survey</h2>
        <p className="text-neutral-500 mt-2 leading-relaxed">
          Help us improve the experience! Scan the QR code below or tap the link to take a survey.
        </p>
      </div>

      <div className="bg-neutral-50 p-8 rounded-3xl inline-block border border-neutral-100">
        <QRCode value="https://forms.gle/aTsoJgCrbYHuFtkF9" size={200} />
      </div>

      <div className="flex justify-center gap-6 pb-6">
         <a href="https://forms.gle/aTsoJgCrbYHuFtkF9" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline text-sm truncate">
           forms.gle/aTsoJgCrbYHuFtkF9
         </a>
      </div>
    </motion.div>
  );
}
