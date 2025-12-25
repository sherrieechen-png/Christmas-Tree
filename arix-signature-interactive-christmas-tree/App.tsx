
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { TreeMorphState } from './types';

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-amber-200 tracking-widest uppercase text-[10px] animate-pulse">Initializing Arix Experience</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [morphProgress, setMorphProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Smoothly transition morphProgress
  useEffect(() => {
    let animationFrameId: number;
    const target = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0;
    
    const animate = () => {
      setMorphProgress(prev => {
        const step = 0.015;
        if (Math.abs(prev - target) < step) return target;
        return prev + (target > prev ? step : -step);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [morphState]);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white p-10 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4 serif italic">Experience Offline</h1>
          <p className="opacity-70 text-sm max-w-xs mx-auto">
            Your current hardware or browser settings do not support the high-fidelity 3D features required.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 border border-amber-500 text-amber-500 rounded-full text-xs uppercase tracking-widest"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<LoadingScreen />}>
          <Canvas 
            shadows 
            onError={(e) => {
              console.error("Canvas Error:", e);
              setHasError(true);
            }}
            gl={{ 
              antialias: true, 
              toneMapping: 3, // ACESFilmicToneMapping
              powerPreference: 'high-performance'
            }}
          >
            <Experience morphProgress={morphProgress} />
          </Canvas>
        </Suspense>
      </div>

      {/* UI Controls */}
      <UIOverlay 
        morphState={morphState} 
        onMorphChange={setMorphState} 
      />

      {/* Luxury Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent opacity-50" />
    </div>
  );
};

export default App;
