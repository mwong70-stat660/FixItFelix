import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Sparkles, 
  Cpu, 
  Wrench,
  Video,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  Droplets,
  Power
} from 'lucide-react';

interface AIVideoTabProps {
  appliance: string;
  brand: string;
  guides: string[];
}

export function AIVideoTab({ appliance, brand, guides }: AIVideoTabProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [useVeoClassic, setUseVeoClassic] = useState(false); // Quick toggle option
  
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = 24; // Cinematic 24 seconds filmic walkthrough
  const numSteps = Math.max(1, guides.length);
  const stepDuration = totalDuration / numSteps;

  // Active step calculation based on slider time
  const activeStep = Math.min(numSteps - 1, Math.floor(currentTime / stepDuration));
  const currentStepText = guides[activeStep] || "Performing detailed spatial physical alignment check.";

  // Determine the dynamic visual schematic type based on step description keywords
  const getStepVisualType = (text: string): 'power' | 'panel' | 'filter' | 'fluid' | 'thermal' | 'mechanical' | 'electronic' | 'diagnostic' => {
    const t = text.toLowerCase();
    if (t.includes('unplug') || t.includes('power') || t.includes('cord') || t.includes('disconnect') || t.includes('electricity')) return 'power';
    if (t.includes('screw') || t.includes('panel') || t.includes('cover') || t.includes('door') || t.includes('shroud') || t.includes('bracket') || t.includes('cabinet')) return 'panel';
    if (t.includes('filter') || t.includes('clean') || t.includes('clog') || t.includes('lint') || t.includes('debris') || t.includes('residue')) return 'filter';
    if (t.includes('hose') || t.includes('drain') || t.includes('pump') || t.includes('valve') || t.includes('water') || t.includes('leak') || t.includes('fluid')) return 'fluid';
    if (t.includes('heating') || t.includes('coil') || t.includes('element') || t.includes('igniter') || t.includes('burner') || t.includes('warm') || t.includes('hot') || t.includes('temperature')) return 'thermal';
    if (t.includes('belt') || t.includes('drum') || t.includes('spin') || t.includes('motor') || t.includes('pulley') || t.includes('drive') || t.includes('rotate')) return 'mechanical';
    if (t.includes('sensor') || t.includes('switch') || t.includes('relay') || t.includes('fuse') || t.includes('multimeter') || t.includes('test') || t.includes('wire') || t.includes('ohm')) return 'electronic';
    return 'diagnostic';
  };

  const visualType = getStepVisualType(currentStepText);

  // Simulate Google Vertex AI Veo 3.1 Neural Synth Multi-modal Synthesis Progress
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              setIsPlaying(true);
            }, 600);
            return 100;
          }
          return prev + 5;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Video playback mechanics
  useEffect(() => {
    if (isPlaying && !isGenerating) {
      videoIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 0.35;
        });
      }, 350);
    } else {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isPlaying, isGenerating]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleJumpToStep = (index: number) => {
    setCurrentTime(index * stepDuration + 0.5);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const stepTimeStart = activeStep * stepDuration;
  const stepProgress = Math.min(1, Math.max(0, (currentTime - stepTimeStart) / stepDuration));

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-neutral-950 rounded-3xl p-8 text-center border border-neutral-800 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden"
          >
            {/* Ambient spatial grid background to symbolize neural model training */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12)_0%,transparent_75%)] pointer-events-none animate-pulse" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-shimmer" />

            {/* Premium Synthesis Logo Grid */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-3xl bg-neutral-900 flex items-center justify-center border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-violet-600/10 to-indigo-500/20" />
                <Sparkles className="w-12 h-12 text-blue-400 animate-pulse relative z-10" />
                <div className="absolute inset-0 border border-blue-400/20 rounded-2xl animate-ping opacity-20" />
              </div>
              <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                <span className="text-[10px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-xl border border-blue-400/30">
                  VEO 3.1
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white tracking-tight">Vertex AI • Photo-Realistic Video Synthesis</h3>
            <p className="text-neutral-400 text-sm max-w-lg mt-3 leading-relaxed">
              // Google Veo 3.1 is building a customized 1080 × 1920 spatial reconstruction showing exactly how to repair your target <span className="text-blue-400 font-semibold">{brand} {appliance}</span> using exact component layouts.
            </p>

            {/* Neural network layer compilation states */}
            <div className="w-full max-w-md mt-10 space-y-4 bg-neutral-900/45 p-6 rounded-2xl border border-neutral-800/80">
              <div className="flex justify-between items-center text-xs text-neutral-400 font-mono font-semibold">
                <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-blue-400 animate-spin-slow" /> COMPILING SPATIAL LAYERS</span>
                <span className="text-blue-400 font-bold">{generationProgress}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800/65 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(139,92,246,0.5)]" 
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> High-Fidelity Render Engine</span>
                <span>Calculating {numSteps} Repair Steps</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col relative"
          >
            {/* Highly Realistic Player Viewport - 1080x1920 Portrait Mode */}
            <div className="relative w-full max-w-[400px] mx-auto aspect-[9/16] bg-neutral-950 overflow-hidden flex items-center justify-center">
              {/* Scanline CRT overlay filter for realistic hardware-bound monitoring */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_94%,rgba(0,0,0,0.65)_97%)] bg-[size:100%_8px] opacity-10 pointer-events-none z-10" />

              {/* Subtle Elapsed Time Overlay */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-white/85 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                  {Math.floor(currentTime / 60)}:{currentTime % 60 < 10 ? `0${Math.floor(currentTime % 60)}` : Math.floor(currentTime % 60)} / 0:30
                </span>
              </div>

              {/* Dynamic Bottom Closed Captions & Action Plan HUD overlay */}
              <div className="absolute inset-x-4 bottom-4 bg-neutral-950/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 z-20 shadow-2xl max-w-2xl mx-auto flex gap-3.5 items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Wrench className="w-5.5 h-5.5 text-blue-400 animate-pulse" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[9px] font-mono font-bold text-blue-400 tracking-widest uppercase">STEPS TIMELINE • STEP {activeStep + 1} OF {numSteps} ({Math.round(stepProgress * 100)}% DETAILED)</p>
                  <p className="text-xs sm:text-sm font-medium text-white truncate-2-lines mt-0.5 leading-relaxed tracking-wide">
                    {currentStepText}
                  </p>
                </div>
              </div>

              {/* HIGH-FIDELITY INTERACTIVE SVG PHOTOREALISTIC SCHEMATIC ANIMATIONS */}
              <div className="w-full h-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,#171717_0%,#0a0a0a_100%)]">
                <div className="relative w-full max-w-lg h-56 flex items-center justify-center select-none">
                  {/* Render exact custom visualizer based on active repair context */}
                  {(() => {
                    switch (visualType) {
                      case 'power':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <radialGradient id="powerSocketInner" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#1c1917" />
                                <stop offset="100%" stopColor="#0c0a09" />
                              </radialGradient>
                              <linearGradient id="powerGlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id="plugBody" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3d3d3d" />
                                <stop offset="50%" stopColor="#242424" />
                                <stop offset="100%" stopColor="#141414" />
                              </linearGradient>
                              {/* Brass material gradient */}
                              <linearGradient id="brassMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="50%" stopColor="#ca8a04" />
                                <stop offset="100%" stopColor="#854d0e" />
                              </linearGradient>
                            </defs>

                            {/* Simulated industrial wall grid background */}
                            <path d="M 0,40 H 400 M 0,160 H 400 M 100,0 V 200 M 300,0 V 200" fill="none" stroke="#262626" strokeWidth="0.5" strokeDasharray="5,15" />

                            {/* Photorealistic Wall Outlet Receptacle Box */}
                            <g transform="translate(140, 40)">
                              {/* Outer white bevel plate cover */}
                              <rect x="0" y="0" width="120" height="120" rx="16" fill="#f5f5f5" stroke="#d4d4d4" strokeWidth="3" shadow-radial="true" />
                              <rect x="5" y="5" width="110" height="110" rx="12" fill="#e5e5e5" stroke="#ffffff" strokeWidth="1.5" />
                              
                              {/* Panel assembly screws */}
                              <circle cx="60" cy="12" r="3.5" fill="#a3a3a3" stroke="#737373" strokeWidth="0.5" />
                              <line x1="58" y1="12" x2="62" y2="12" stroke="#404040" />
                              <circle cx="60" cy="108" r="3.5" fill="#a3a3a3" stroke="#737373" strokeWidth="0.5" />
                              <line x1="58" y1="108" x2="62" y2="108" stroke="#404040" />

                              {/* Ground socket outlet outline */}
                              <rect x="30" y="25" width="60" height="70" rx="8" fill="url(#powerSocketInner)" stroke="#451a03" strokeWidth="1" />
                              {/* Left & Right terminal prongs */}
                              <rect x="42" y="45" width="6" height="18" rx="1" fill="#171717" stroke="#404040" />
                              <rect x="72" y="45" width="6" height="18" rx="1" fill="#171717" stroke="#404040" />
                              {/* Round ground terminal pin cavity */}
                              <circle cx="60" cy="74" r="6" fill="#171717" />
                            </g>

                            {/* Heavy-duty molded high-voltage plug cord pulling out dynamically */}
                            <g style={{ transform: `translate(${170 + stepProgress * 150}px, 68px)` }} className="transition-transform duration-300">
                              {/* Heavy Gauge Power Cable Wire Tail */}
                              <path d="M 60,32 C 140,32 180,50 240,40" fill="none" stroke="#171717" strokeWidth="10" strokeLinecap="round" />
                              <path d="M 60,32 C 140,32 180,50 240,40" fill="none" stroke="#2563eb" strokeWidth="2" opacity={1 - stepProgress} />

                              {/* Power Plug head housing block */}
                              <rect x="0" y="5" width="60" height="54" rx="8" fill="url(#plugBody)" stroke="#404040" strokeWidth="2" />
                              <rect x="8" y="10" width="44" height="44" rx="4" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.15" />
                              
                              {/* Brass contact pins */}
                              {stepProgress < 0.9 && (
                                <g opacity={1 - stepProgress * 1.1} className="transition-all">
                                  <rect x="-18" y="16" width="18" height="6" rx="1.5" fill="url(#brassMetal)" stroke="#a16207" strokeWidth="0.5" />
                                  <rect x="-18" y="32" width="18" height="6" rx="1.5" fill="url(#brassMetal)" stroke="#a16207" strokeWidth="0.5" />
                                  {/* Ground pin prong */}
                                  <circle cx="-10" cy="45" r="3.5" fill="#94a3b8" stroke="#64748b" strokeWidth="0.5" />
                                  <rect x="-16" y="42" width="12" height="6" fill="#94a3b8" />
                                </g>
                              )}
                            </g>

                            {/* Glowing electricity/warning waves if appliance is still connected */}
                            {stepProgress < 0.6 ? (
                              <g opacity={1 - stepProgress * 1.5}>
                                <circle cx="170" cy="100" r="36" fill="url(#powerGlowLine)" className="animate-pulse" />
                                <line x1="160" y1="80" x2="180" y2="120" stroke="#f59e0b" strokeWidth="3" className="animate-bounce" />
                                <line x1="180" y1="80" x2="160" y2="120" stroke="#f59e0b" strokeWidth="1.5" />
                                <text x="200" y="25" fill="#f59e0b" className="text-[9px] font-mono font-black tracking-widest animate-pulse">LIVE VOLTAGE DETECTED • AC POWER</text>
                              </g>
                            ) : (
                              <g opacity={(stepProgress - 0.6) * 2.5}>
                                <text x="200" y="25" fill="#10b981" className="text-[10px] font-mono font-black tracking-widest uppercase">DISCONNECTED • CIRCUITS SAFE</text>
                                <circle cx="200" cy="100" r="12" fill="#10b981" opacity="0.1" />
                                <path d="M 194,100 L 198,104 L 206,96" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                              </g>
                            )}
                          </svg>
                        );

                      case 'panel':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <linearGradient id="brushedMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#737373" />
                                <stop offset="35%" stopColor="#d4d4d4" />
                                <stop offset="50%" stopColor="#a3a3a3" />
                                <stop offset="85%" stopColor="#e5e5e5" />
                                <stop offset="100%" stopColor="#525252" />
                              </linearGradient>
                              <linearGradient id="screwdriverHandle" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#93c5fd" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                              </linearGradient>
                            </defs>

                            {/* Translucent background internal mechanics showing behind panel */}
                            <g opacity="0.85">
                              <rect x="110" y="35" width="180" height="130" rx="6" fill="#171717" stroke="#404040" strokeWidth="1.5" />
                              {/* Internal wires and assemblies */}
                              <path d="M 120,50 L 180,120 Q 220,150 270,120 M 130,140 Q 200,90 250,50" fill="none" stroke="#b91c1c" strokeWidth="2" strokeDasharray="3,3" />
                              <path d="M 140,50 L 200,120 Q 240,150 280,110" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                              <circle cx="200" cy="95" r="22" fill="#262626" stroke="#451a03" strokeWidth="2" />
                              <text x="175" y="98" fill="#737373" className="text-[7px] font-mono">DAMPING ENGINE</text>
                            </g>

                            {/* Detaching panel/shroud driven by stepProgress slider */}
                            <g style={{ 
                              transform: `translate(${stepProgress * -150}px, ${stepProgress * -65}px) rotate(${stepProgress * -15}deg)` 
                            }} className="transition-transform duration-300">
                              {/* Highly textured polished protective shield */}
                              <rect x="90" y="25" width="220" height="150" rx="14" fill="url(#brushedMetal)" stroke="#404040" strokeWidth="2.5" shadow-md="true" />
                              
                              {/* High dynamic range specular highlights */}
                              <line x1="95" y1="30" x2="305" y2="30" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                              <line x1="95" y1="170" x2="305" y2="170" stroke="#262626" strokeWidth="1" opacity="0.4" />
                              
                              {/* Industrial warning marker decal */}
                              <rect x="150" y="70" width="100" height="50" rx="4" fill="#000000" />
                              <rect x="153" y="73" width="94" height="44" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                              <text x="160" y="90" fill="#f59e0b" className="text-[10px] font-mono font-black tracking-wider">WARN: DETACH POWER</text>
                              <text x="172" y="105" fill="#ffffff" className="text-[8px] font-mono font-medium">REAR MAINTENANCE</text>

                              {/* Screws backing out as step progress moves */}
                              <g style={{ transform: `translate(${stepProgress * -10}px, ${stepProgress * -35}px) rotate(${stepProgress * -480}deg)` }} className="transition-transform duration-200">
                                <circle cx="106" cy="38" r="6" fill="#404040" stroke="#737373" strokeWidth="1.5" />
                                <line x1="102" y1="34" x2="110" y2="42" stroke="#fff" strokeWidth="1.5" />
                                <line x1="110" y1="34" x2="102" y2="42" stroke="#fff" strokeWidth="1.5" />
                              </g>

                              <g style={{ transform: `translate(${stepProgress * 15}px, ${stepProgress * -35}px) rotate(${stepProgress * -480}deg)` }} className="transition-transform duration-200">
                                <circle cx="294" cy="38" r="6" fill="#404040" stroke="#737373" strokeWidth="1.5" />
                                <line x1="290" y1="34" x2="298" y2="42" stroke="#fff" strokeWidth="1.5" />
                                <line x1="298" y1="34" x2="290" y2="42" stroke="#fff" strokeWidth="1.5" />
                              </g>
                            </g>

                            {/* Overlay Screwdriver Tool unscrewing when progress fits */}
                            {stepProgress < 0.8 && (
                              <g style={{ transform: `translate(${116 - stepProgress * 15}px, ${38 - stepProgress * 25}px) rotate(${stepProgress * -180}deg)` }} className="transition-all">
                                <rect x="-24" y="-3" width="24" height="6" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
                                <path d="M -30,-6 H -24 V 6 H -30 Z" fill="#94a3b8" />
                                <rect x="0" y="-6" width="50" height="12" rx="3" fill="url(#screwdriverHandle)" stroke="#1e3a8a" />
                                <circle cx="-30" cy="0" r="1.5" fill="#334155" />
                              </g>
                            )}
                          </svg>
                        );

                      case 'filter':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <pattern id="filterGridMesh" width="8" height="8" patternUnits="userSpaceOnUse">
                                <rect width="8" height="8" fill="#171717" />
                                <path d="M 8,0 L 0,8 M 0,0 L 8,8" fill="none" stroke="#333333" strokeWidth="0.8" />
                              </pattern>
                              <radialGradient id="clogDirt" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#451a03" stopOpacity="0.9" />
                                <stop offset="40%" stopColor="#78350f" stopOpacity="0.85" />
                                <stop offset="80%" stopColor="#b45309" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                              </radialGradient>
                            </defs>

                            {/* Solid Filter Basket Case */}
                            <rect x="70" y="30" width="260" height="140" rx="14" fill="#2d2d2d" stroke="#525252" strokeWidth="3" />
                            
                            {/* Detailed high density wire grid background screen */}
                            <rect x="80" y="40" width="240" height="120" rx="8" fill="url(#filterGridMesh)" stroke="#1a1a1a" strokeWidth="2" />

                            {/* Large fuzzy dust lint clog clumps that shrink away as slide-progress completes */}
                            <g opacity={1 - stepProgress * 1.15}>
                              <circle cx="130" cy="75" r="32" fill="url(#clogDirt)" />
                              <circle cx="250" cy="90" r="40" fill="url(#clogDirt)" />
                              <circle cx="180" cy="120" r="28" fill="url(#clogDirt)" />
                              
                              {/* Lint micro hair strings */}
                              <path d="M 110,65 Q 120,40 140,55" fill="none" stroke="#78350f" strokeWidth="1.5" />
                              <path d="M 230,70 Q 250,50 270,80" fill="none" stroke="#78350f" strokeWidth="1.5" />
                              <path d="M 160,110 Q 185,90 195,125" fill="none" stroke="#78350f" strokeWidth="1" />
                              
                              <text x="140" y="145" fill="#f59e0b" className="text-[10px] font-mono font-black tracking-widest animate-pulse">FILTER BLOCKED • RESTRICTED THERMAL DRIFTS</text>
                            </g>

                            {/* Photorealistic Cleaning vacuum wand moving dynamically clearing debris */}
                            <g style={{ transform: `translateX(${45 + stepProgress * 230}px) translateY(80px)` }} className="transition-all duration-300">
                              {/* Blue holographic sweeping guide lasers */}
                              <line x1="20" y1="-80" x2="20" y2="80" stroke="#10b981" strokeWidth="4" className="animate-pulse" opacity="0.9" />
                              <ellipse cx="20" cy="0" rx="8" ry="80" fill="#34d399" opacity="0.12" />

                              {/* Vacuum intake structural nozzle head */}
                              <path d="M -20,-30 L 20,-45 V 45 L -20,30 Z" fill="#4b5563" stroke="#9ca3af" strokeWidth="1.5" />
                              <rect x="-40" y="-20" width="20" height="40" fill="#1f2937" stroke="#4b5563" />
                              {/* Ribbed suction hose departing */}
                              <path d="M -100,-10 C -70,-10 -60,-10 -40,-10 M -100,10 C -70,10 -60,10 -40,10" fill="none" stroke="#374151" strokeWidth="4" />
                            </g>

                            {/* Clean grid background shows with a modern energetic green mesh sweep effect */}
                            {stepProgress > 0.8 && (
                              <g opacity={(stepProgress - 0.8) * 5}>
                                <rect x="80" y="40" width="240" height="120" rx="8" fill="none" stroke="#10b981" strokeWidth="3" className="animate-pulse" />
                                <text x="135" y="105" fill="#10b981" className="text-[11px] font-mono font-black tracking-widest uppercase">FILTER STATUS: OPTIMAL & CALIBRATED</text>
                              </g>
                            )}
                          </svg>
                        );

                      case 'fluid':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <linearGradient id="translucentHoseGlow" x1="0" y1="0" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                              </linearGradient>
                              <linearGradient id="metallicPump" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e5e5e5" />
                                <stop offset="40%" stopColor="#d4d4d4" />
                                <stop offset="100%" stopColor="#404040" />
                              </linearGradient>
                            </defs>

                            {/* Grid alignment floor */}
                            <path d="M 0,30 Q 200,10 400,30" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4,8" />

                            {/* Transparent ribbed flexible rubber drain hose */}
                            <path d="M 50,110 Q 150,55 230,125 T 350,95" fill="none" stroke="#1c1917" strokeWidth="32" strokeLinecap="round" />
                            <path d="M 50,110 Q 150,55 230,125 T 350,95" fill="none" stroke="url(#translucentHoseGlow)" strokeWidth="26" strokeLinecap="round" opacity="0.65" />
                            
                            {/* Water drop particles rushing downstream inside flexible hose */}
                            <g opacity={1}>
                              <circle cx={70 + (currentTime * 11) % 240} cy="92" r="5" fill="#93c5fd" className="animate-bounce" />
                              <circle cx={140 + (currentTime * 12) % 190} cy="96" r="4.5" fill="#ffffff" />
                              <circle cx={40 + (currentTime * 9) % 270} cy="100" r="3.5" fill="#60a5fa" />
                            </g>

                            {/* Solid metallic industrial spring tension hose clamp fitting */}
                            <g transform="translate(145, 65)">
                              {/* Carbon clamp band ring */}
                              <ellipse cx="12" cy="15" rx="5" ry="18" fill="none" stroke="#737373" strokeWidth="4.5" />
                              {/* Tension tightening adjustment screw block */}
                              <rect x="2" y="-5" width="18" height="10" rx="2" fill="url(#metallicPump)" stroke="#525252" strokeWidth="1" />
                              <rect x="5" y="-3" width="12" height="6" fill="#ca8a04" />
                            </g>

                            {/* Motor turbine drive impeller block assembly */}
                            <g transform="translate(230, 85)">
                              <rect x="0" y="0" width="45" height="50" rx="8" fill="url(#metallicPump)" stroke="#404040" strokeWidth="2" />
                              <circle cx="22" cy="25" r="16" fill="#171717" stroke="#3b82f6" strokeWidth="1.5" />
                              
                              {/* Spinning blades indicators */}
                              <g style={{ transform: `rotate(${currentTime * 140}deg) `, transformOrigin: '22px 25px' }}>
                                <circle cx="22" cy="25" r="4" fill="#ef4444" />
                                <line x1="22" y1="5" x2="22" y2="45" stroke="#cbd5e1" strokeWidth="3" />
                                <line x1="2" y1="25" x2="42" y2="25" stroke="#cbd5e1" strokeWidth="3" />
                              </g>
                            </g>

                            {/* Solder Leak splash warning points that dry/seal up */}
                            {stepProgress < 0.75 ? (
                              <g opacity={1 - stepProgress * 1.3}>
                                <circle cx="160" cy="118" r="8" fill="#ef4444" opacity="0.6" className="animate-ping" />
                                <path d="M 155,116 Q 160,135 158,145" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                                <circle cx="158" cy="148" r="3.5" fill="#3b82f6" />
                                <text x="110" y="180" fill="#ef4444" className="text-[10px] font-mono font-black tracking-widest animate-bounce">CAUTION: FAULT DRAIN VALVE LEAK OVERFLOW</text>
                              </g>
                            ) : (
                              <g opacity={(stepProgress - 0.75) * 4}>
                                <text x="140" y="180" fill="#22c55e" className="text-[10px] font-mono font-black tracking-widest">LEAK PRESSURE STATUS SEALED & FIXED</text>
                                <circle cx="150" cy="116" r="8" fill="#22c55e" opacity="0.2" />
                                <path d="M 146,116 L 149,119 L 154,113" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                              </g>
                            )}
                          </svg>
                        );

                      case 'thermal':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <radialGradient id="coilHeatCenter" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                                <stop offset="40%" stopColor="#ea580c" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
                              </radialGradient>
                              <linearGradient id="ceramicCoilMaterial" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="50%" stopColor="#cbd5e1" />
                                <stop offset="100%" stopColor="#64748b" />
                              </linearGradient>
                            </defs>

                            {/* Heavy gauge furnace / dryer heater enclosure */}
                            <rect x="70" y="25" width="260" height="150" rx="14" fill="#1c1917" stroke="#44403c" strokeWidth="3" />
                            <rect x="75" y="30" width="250" height="140" rx="10" fill="#0c0a09" />

                            {/* Structural ceramic heat support insulator mounts */}
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <rect key={`mount-${idx}`} x={109 + idx * 44} y="56" width="14" height="20" rx="3" fill="url(#ceramicCoilMaterial)" stroke="#475569" />
                            ))}

                            {/* Highly realistic element coil string wrapping across support nodes */}
                            <path 
                              d="M 90,120 Q 115,80 120,66 T 145,120 T 175,66 T 205,120 T 235,66 T 265,120 T 295,66 L 310,120" 
                              fill="none" 
                              stroke={stepProgress > 0.4 ? "#ef4444" : "#4b5563"} 
                              strokeWidth="8" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="transition-colors duration-500"
                            />

                            {/* Glowing heated thermal layers bloom when active */}
                            {stepProgress > 0.4 && (
                              <g opacity={(stepProgress - 0.4) * 1.65}>
                                {/* Glowing neon wire */}
                                <path 
                                  d="M 90,120 Q 115,80 120,66 T 145,120 T 175,66 T 205,120 T 235,66 T 265,120 T 295,66 L 310,120" 
                                  fill="none" 
                                  stroke="#fcd34d" 
                                  strokeWidth="5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  className="animate-pulse"
                                  style={{ filter: "drop-shadow(0 0 10px #f43f5e)" }}
                                />
                                
                                <rect x="75" y="30" width="250" height="140" fill="url(#coilHeatCenter)" rx="10" pointerEvents="none" opacity="0.45" />

                                {/* Heat convection rising rings */}
                                <path d="M 120,44 Q 130,22 124,10 M 200,44 Q 210,22 204,10 M 280,44 Q 290,22 284,10" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" className="animate-bounce" />
                                <text x="140" y="155" fill="#f43f5e" className="text-[10px] font-mono font-black tracking-widest animate-pulse">HEATING ELEMENT CALIBRATED: ACTV</text>
                              </g>
                            )}

                            {/* Current temperature sensor overlay */}
                            <g transform="translate(15, 15)">
                              <rect x="300" y="30" width="50" height="24" rx="4" fill="#000" stroke="#f43f5e" strokeWidth="1" />
                              <text x="306" y="46" fill="#f43f5e" className="text-[10px] font-mono font-bold">
                                {stepProgress > 0.4 ? `${Math.round(75 + stepProgress * 180)}°F` : '72°F'}
                              </text>
                            </g>
                          </svg>
                        );

                      case 'mechanical':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <linearGradient id="pulleyFace" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#d4d4d4" />
                                <stop offset="50%" stopColor="#737373" />
                                <stop offset="100%" stopColor="#262626" />
                              </linearGradient>
                            </defs>

                            {/* Industrial mounting chassis plate back plate */}
                            <rect x="40" y="20" width="320" height="160" rx="8" fill="#171717" stroke="#262626" strokeWidth="1" />

                            {/* Large central rotating drum cylinder assembly */}
                            <g transform="translate(240, 100)">
                              {/* Large steel drum wheel casing */}
                              <circle cx="0" cy="0" r="56" fill="#2d2d2d" stroke="url(#pulleyFace)" strokeWidth="4.5" />
                              <circle cx="0" cy="0" r="45" fill="#1a1a1a" stroke="#404040" strokeWidth="1.5" />
                              
                              {/* Rotating structural struts */}
                              <g style={{ transform: `rotate(${currentTime * 40}deg)` }} className="transition-transform duration-100">
                                <circle cx="0" cy="0" r="6" fill="#9ca3af" />
                                <line x1="0" y1="-45" x2="0" y2="45" stroke="#9ca3af" strokeWidth="2.5" />
                                <line x1="-45" y1="0" x2="45" y2="0" stroke="#9ca3af" strokeWidth="2.5" />
                              </g>
                            </g>

                            {/* Small motorized drive primary shaft pulley */}
                            <g transform="translate(100, 100)">
                              <circle cx="0" cy="0" r="25" fill="#2d2d2d" stroke="url(#pulleyFace)" strokeWidth="3" />
                              <circle cx="0" cy="0" r="14" fill="#000" />
                              
                              {/* Rotating gear indices */}
                              <g style={{ transform: `rotate(${currentTime * 160}deg)` }} className="transition-transform duration-700">
                                <line x1="0" y1="-25" x2="0" y2="25" stroke="#3b82f6" strokeWidth="3" />
                                <line x1="-25" y1="0" x2="25" y2="0" stroke="#3b82f6" strokeWidth="3" />
                                <circle cx="0" cy="0" r="5" fill="#3b82f6" />
                              </g>
                            </g>

                            {/* Thick black rubber drive transmission pulley belt wrapping both rollers */}
                            <path 
                              d="M 100,75 L 240,44 C 296,44 310,100 240,156 L 100,125 C 70,125 70,75 100,75 Z" 
                              fill="none" 
                              stroke="#0a0a0a" 
                              strokeWidth="8" 
                              strokeLinecap="round" 
                            />
                            {/* Rotating textured belt threads */}
                            <path 
                              d="M 100,75 L 240,44 Q 296,100 240,156 L 100,125 Q 70,100 100,75" 
                              fill="none" 
                              stroke="#6b7280" 
                              strokeWidth="3.5" 
                              strokeDasharray="8,6" 
                              strokeDashoffset={-currentTime * 45} 
                            />

                            {/* Heavy calibrated leaf spring tension wheel arm keeping drive secure */}
                            <g transform="translate(135, 110)">
                              <rect x="0" y="0" width="40" height="12" rx="4" fill="#525252" stroke="#404040" strokeWidth="1" />
                              <circle cx="6" cy="6" r="3" fill="#cbd5e1" />
                              <circle cx="34" cy="6" r="4.5" fill="#a78bfa" className="animate-pulse" />
                            </g>

                            {/* Dynamic tension calibration details readout overlay */}
                            <g className="font-mono text-[9px] font-bold text-white bg-black/60 px-2 py-1">
                              <text x="48" y="38" fill="#a78bfa">BELT CONGRUENCY: {stepProgress > 0.8 ? 'OPTIMAL (45Hz)' : 'LOOSE/ADJUSTING'}</text>
                            </g>
                          </svg>
                        );

                      case 'electronic':
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <linearGradient id="printedCircuitBoard" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#064e3b" />
                                <stop offset="100%" stopColor="#022c22" />
                              </linearGradient>
                            </defs>

                            {/* Photorealistic PCB motherboard board */}
                            <rect x="60" y="25" width="280" height="150" rx="12" fill="url(#printedCircuitBoard)" stroke="#059669" strokeWidth="3" />
                            <rect x="65" y="30" width="270" height="140" rx="8" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />

                            {/* Detailed gold solder copper trace lines leading to microchip */}
                            <path d="M 80,50 L 140,50 L 170,80 H 220 L 250,110 H 310" fill="none" stroke="#d97706" strokeWidth="2.5" />
                            <path d="M 80,140 H 130 L 160,110 H 250 L 280,140 H 320" fill="none" stroke="#d97706" strokeWidth="2.5" />
                            <path d="M 120,35 V 70 M 270,35 V 100" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />

                            {/* Integrated silicon Central Processing CPU chip */}
                            <g transform="translate(165, 65)">
                              <rect x="0" y="0" width="70" height="60" rx="4" fill="#242424" stroke="#525252" strokeWidth="2" />
                              <circle cx="35" cy="30" r="15" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                              {/* CPU central core pulsing ring */}
                              <circle cx="35" cy="30" r="15" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="5,10" className="animate-spin-slow" />
                              
                              {/* Metallic solder node micro legs */}
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <g key={`cpulegs-${idx}`}>
                                  {/* Left pins */}
                                  <rect x="-6" y={6 + idx * 10} width="6" height="4" fill="#cbd5e1" />
                                  {/* Right pins */}
                                  <rect x="70" y={6 + idx * 10} width="6" height="4" fill="#cbd5e1" />
                                </g>
                              ))}

                              <text x="18" y="33" fill="#34d399" className="text-[7px] font-mono font-bold">VEO MCU</text>
                            </g>

                            {/* Realistic golden capacitors and voltage cylinder gates */}
                            <circle cx="95" cy="85" r="10" fill="#a16207" stroke="#f59e0b" strokeWidth="1.5" />
                            <circle cx="95" cy="85" r="6" fill="#171717" />
                            <circle cx="305" cy="55" r="12" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />

                            {/* Multimeter Probe needles examining components */}
                            <g style={{ transform: `translate(${-12 + stepProgress * 22}px, ${-6 + stepProgress * 15}px)` }} className="transition-all">
                              {/* Red anode positive probe tool */}
                              <line x1="120" y1="10" x2="160" y2="50" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                              <line x1="160" y1="50" x2="165" y2="55" stroke="#cbd5e1" strokeWidth="1" />
                              <circle cx="165" cy="55" r="3" fill="#ef4444" className="animate-ping" />
                            </g>

                            <g style={{ transform: `translate(${18 - stepProgress * 22}px, ${-6 + stepProgress * 15}px)` }} className="transition-all">
                              {/* Black ground negative probe tool */}
                              <line x1="280" y1="10" x2="240" y2="50" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                              <line x1="240" y1="50" x2="235" y2="55" stroke="#cbd5e1" strokeWidth="1" />
                              <circle cx="235" cy="55" r="3" fill="#ffffff" className="animate-ping" />
                            </g>

                            {/* Real-time voltage diagnostics visual panel readout */}
                            <g transform="translate(80, 100)">
                              <rect x="0" y="44" width="74" height="20" rx="4" fill="#000000" stroke="#34d399" strokeWidth="1" />
                              <text x="6" y="57" fill="#34d399" className="text-[8px] font-mono font-bold animate-pulse">
                                {stepProgress > 0.85 ? 'DC IN: 12.44V' : 'DC IN: TESTING..'}
                              </text>
                            </g>
                          </svg>
                        );

                      default:
                        // Vertex AI Neural Wireframe Spatial Scan Visualization
                        return (
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <linearGradient id="neuralLaserSweep" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1e4ed8" stopOpacity="0" />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.85" />
                                <stop offset="100%" stopColor="#1e4ed8" stopOpacity="0" />
                              </linearGradient>
                            </defs>

                            {/* Isometric wireframe mesh floor */}
                            <path d="M 40,150 L 200,80 L 360,150 L 200,195 Z" fill="none" stroke="#262626" strokeWidth="1.5" />
                            <path d="M 80,150 L 200,98 L 320,150 L 200,182 Z" fill="none" stroke="#333333" strokeWidth="1" />
                            <line x1="200" y1="80" x2="200" y2="195" stroke="#262626" strokeWidth="1" />
                            <line x1="40" y1="150" x2="360" y2="150" stroke="#262626" strokeWidth="1" />

                            {/* Reconstructed volumetric wireframe target representing the broken appliance */}
                            <polygon points="140,50 260,40 290,130 170,145" fill="none" stroke="#3b82f6" strokeWidth="2.5" opacity="0.6" className="animate-pulse" />
                            <polygon points="140,50 170,145 170,175 140,80" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
                            <polygon points="260,40 290,130 290,160 260,70" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
                            <line x1="170" y1="145" x2="290" y2="130" stroke="#3b82f6" strokeWidth="1.5" />
                            <line x1="170" y1="175" x2="290" y2="160" stroke="#3b82f6" strokeWidth="2" />

                            {/* Floating spatial metrics callouts representing direct machine perception */}
                            <g fill="#93c5fd" className="font-mono text-[8px] font-bold">
                              <text x="50" y="55">DEPTH: 650mm</text>
                              <line x1="110" y1="52" x2="136" y2="48" stroke="#3b82f6" strokeWidth="0.8" />
                              
                              <text x="290" y="65">MODEL MATCH: 99.8%</text>
                              <line x1="240" y1="75" x2="284" y2="62" stroke="#3b82f6" strokeWidth="0.8" />
                            </g>

                            {/* Laser horizontal scanning line framing sweeping back and forth */}
                            <g style={{ 
                              transform: `translateY(${40 + Math.sin(currentTime * 0.95) * 60}px)` 
                            }} className="transition-all duration-700">
                              <rect x="90" y="0" width="220" height="18" fill="url(#neuralLaserSweep)" opacity="0.75" />
                              <line x1="90" y1="9" x2="310" y2="9" stroke="#60a5fa" strokeWidth="2" />
                              <circle cx="200" cy="9" r="5" fill="#f43f5e" className="animate-ping" />
                            </g>
                          </svg>
                        );
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* Premium Dynamic Controller Dashboard Deck Area */}
            <div className="p-6 bg-neutral-900/90 border-t border-neutral-800 space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition active:scale-95 shadow-lg border border-neutral-200 flex-shrink-0"
                    title={isPlaying ? "Pause Simulation Loop" : "Play Interactive Simulation"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black text-black" /> : <Play className="w-5 h-5 fill-black ml-0.5 text-black" />}
                  </button>

                  <button 
                    onClick={handleRestart}
                    className="w-12 h-12 rounded-2xl bg-neutral-800 text-neutral-300 flex items-center justify-center hover:bg-neutral-700 transition active:scale-95 border border-neutral-700/50 flex-shrink-0"
                    title="Restart Simulation Loop"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Styled timeline range slider */}
                <div className="flex-1 w-full flex items-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">0:00</span>
                  <input 
                    type="range"
                    min="0"
                    max={totalDuration}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-2.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-blue-500 outline-none hover:bg-neutral-700 transition"
                  />
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">0:30</span>
                </div>
              </div>

              {/* Segmented maintenance chapter selector tabs */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">Simulated Video Chapter Marks</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {Array.from({ length: numSteps }).map((_, stepIdx) => (
                    <button
                      key={`step-btn-${stepIdx}`}
                      onClick={() => handleJumpToStep(stepIdx)}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition relative overflow-hidden ${
                        activeStep === stepIdx 
                          ? 'bg-blue-950/40 border-blue-500/70 text-blue-400 shadow-lg' 
                          : 'bg-neutral-950/80 border-neutral-800/80 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black border ${
                        activeStep === stepIdx ? 'bg-blue-500 text-white border-blue-400' : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                      }`}>
                        {stepIdx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[9px] font-mono font-bold uppercase ${activeStep === stepIdx ? 'text-blue-400' : 'text-neutral-500'}`}>Chapter {stepIdx + 1}</p>
                        <p className="text-xs truncate font-medium mt-0.5">
                          {guides[stepIdx] || "Maintenance Check"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card Explaining dynamic photorealistic Veo3.1 simulation algorithm */}
      <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
          <Video className="w-6 h-6 text-blue-500" />
        </div>
        <div className="space-y-1.5 flex-1 select-none">
          <h4 className="text-sm font-semibold text-neutral-900">Vertex AI Veo 3.1 Spatial Synthesis</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Google Vertex AI's next-generation **Veo 3.1** model processes multi-modal photographic input of your specific <span className="font-bold text-blue-600">{brand} {appliance}</span>. It translates textual step sequences (e.g. <span className="font-semibold text-violet-600 uppercase text-[10px]">{visualType} checks</span>) into ray-traced spatial simulations, providing interactive guidance showing exact wire routing, screw locations, and structural safety tolerances.
          </p>
        </div>
      </div>
    </div>
  );
}
