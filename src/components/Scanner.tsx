import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Smartphone, Upload, Settings, X, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  onCapture: (imageString: string) => void;
  isAnalyzing: boolean;
}

export function Scanner({ onCapture, isAnalyzing }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  
  const [hasInteracted, setHasInteracted] = useState(false);

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
      // Trigger voice instructions upon setting starting stream
      speakInstructions();
    } catch (err: any) {
      console.error("Camera error:", err);
      setError("Camera permission denied or camera not available. Do not worry! You can upload an image or photo of your appliance directly below.");
    }
  };

  const speakInstructions = () => {
    if ('speechSynthesis' in window) {
      // Cancel previous speak requests
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Please point your camera at the appliance and tap the capture button, or upload a photo."
      );
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
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

  const handleCapture = useCallback(() => {
    if (isAnalyzing) return;
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
  }, [isAnalyzing, onCapture]);

  // Use refs in effects to avoid stale closures
  const handleCaptureRef = useRef(handleCapture);
  useEffect(() => {
    handleCaptureRef.current = handleCapture;
  }, [handleCapture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 top-16 z-40 bg-black flex flex-col">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
      />

      <div className="relative w-full h-full bg-neutral-900 overflow-hidden">
        <AnimatePresence>
          {!stream && !error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-4"
            >
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium tracking-widest uppercase">Initializing Camera</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-neutral-950">
             <div className="w-16 h-16 rounded-2xl bg-neutral-900/60 flex items-center justify-center mb-6 border border-neutral-800">
               <Upload className="w-8 h-8 text-blue-500" />
             </div>
             <h3 className="text-lg font-medium text-white mb-2">Camera Access Blocked</h3>
             <p className="text-neutral-400 text-sm max-w-sm mb-8 leading-relaxed">
               {error}
             </p>
             <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button 
                  onClick={triggerUpload} 
                  className="flex-1 px-5 py-3.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-500 transition active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Upload Photo
                </button>
                <button 
                  onClick={startCamera} 
                  className="px-5 py-3.5 bg-neutral-900 text-neutral-300 rounded-full text-sm font-semibold hover:bg-neutral-800 transition border border-neutral-800 active:scale-95"
                >
                  Retry Camera
                </button>
             </div>
           </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-700", stream ? "opacity-100" : "opacity-0")}
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanner Overlay UI - Full Screen Frame */}
        {!error && stream && (
          <>
            <div className="absolute inset-0 pointer-events-none p-6 sm:p-12 flex flex-col justify-between">
               {/* Full Screen Viewfinder Frame corners */}
               <div className="absolute inset-x-8 top-16 bottom-32">
                 <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white/50" />
                 <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white/50" />
                 <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white/50" />
                 <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white/50" />
                 
                 {/* Center precise reticle */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                     <div className="w-full h-full border border-blue-500/50 rounded-full" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                 </div>
               </div>

               {/* Top Bar for states */}
               <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-3 pt-safe-top pointer-events-auto">
                  <div className="flex gap-2">
                     <button 
                       onClick={speakInstructions}
                       title="Hear Spoken Voice Guide"
                       className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white hover:bg-neutral-800 transition active:scale-95 flex items-center gap-2"
                     >
                        <Volume2 className="w-3 h-3 text-blue-400 animate-pulse" />
                        <span className="text-white text-[10px] font-bold tracking-wider animate-pulse">AUDIO GUIDE</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex items-center justify-between bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
              <button 
                onClick={triggerUpload}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition active:scale-95"
              >
                 <Upload className="w-5 h-5 text-white" />
              </button>

              <button 
                onClick={handleCaptureRef.current}
                disabled={!stream || isAnalyzing}
                className={cn(
                  "relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center overflow-hidden transition-transform active:scale-95 disabled:opacity-50",
                  isAnalyzing ? 'animate-pulse' : ''
                )}
              >
                 <div className={cn("absolute inset-1.5 bg-white rounded-full transition-all", isAnalyzing ? 'scale-50 bg-blue-500' : 'scale-100')}></div>
              </button>
              
              {/* Empty div for flex spacing balance */}
              <div className="w-12 h-12" />
            </div>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center pointer-events-none">
                 <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                 <p className="text-white font-medium tracking-widest uppercase">Analyzing Appliance</p>
                 <p className="text-neutral-400 text-sm mt-2">Identifying parts and models...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
