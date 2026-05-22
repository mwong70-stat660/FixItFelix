import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  onCapture: (imageString: string) => void;
  isAnalyzing: boolean;
}

export function Scanner({ onCapture, isAnalyzing }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err: any) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageString = canvas.toDataURL('image/jpeg');
        onCapture(imageString);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
        <AnimatePresence>
          {!stream && !error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-neutral-500"
            >
              <RefreshCw className="w-8 h-8 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-red-400 bg-neutral-900 border border-red-900 rounded-3xl">
             <Smartphone className="w-12 h-12 mb-4 opacity-50" />
             <p>{error}</p>
             <button onClick={startCamera} className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded-full text-sm font-medium hover:bg-neutral-700 transition">
               Retry Camera
             </button>
           </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanner Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-2xl">
             <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
             <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
             <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
             <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
           </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
          <button 
            onClick={handleCapture}
            disabled={!stream || isAnalyzing}
            className={cn(
              "relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center overflow-hidden transition-transform active:scale-95 disabled:opacity-50",
              isAnalyzing ? 'animate-pulse' : ''
            )}
          >
             <div className={cn("absolute inset-1 bg-white rounded-full transition-all", isAnalyzing ? 'scale-50' : 'scale-100')}></div>
          </button>
        </div>
      </div>
      <p className="mt-6 text-sm text-neutral-500 font-medium tracking-wide">FRAME APPLIANCE TO IDENTIFY</p>
    </div>
  );
}
