
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [morphProgress, setMorphProgress] = useState(0);

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

  return (
    <div className="w-full h-screen relative bg-slate-950">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          shadows 
          gl={{ 
            antialias: true, 
            toneMapping: 3, // ACESFilmicToneMapping
            powerPreference: 'high-performance'
          }}
        >
          <Experience morphProgress={morphProgress} />
        </Canvas>
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
