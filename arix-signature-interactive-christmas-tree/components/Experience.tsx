
import React, { Suspense } from 'react';
import { OrbitControls, Environment, PerspectiveCamera, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { TreeParticles, Ornaments } from './TreeParticles';
import { Star } from './Star';
import { COLORS } from '../constants';

interface ExperienceProps {
  morphProgress: number;
}

export const Experience: React.FC<ExperienceProps> = ({ morphProgress }) => {
  return (
    <>
      <color attach="background" args={[COLORS.DEEP_VOID]} />
      
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        maxDistance={40} 
        minDistance={5} 
        autoRotate={morphProgress > 0.5} 
        autoRotateSpeed={1}
      />

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, -10, -10]} color={COLORS.EMERALD_LIGHT} intensity={1} />

      <Suspense fallback={null}>
        <Environment preset="city" />
        
        <group position={[0, 0, 0]}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <TreeParticles morphProgress={morphProgress} />
            <Ornaments morphProgress={morphProgress} />
            <Star morphProgress={morphProgress} />
          </Float>
        </group>

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1.2} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Suspense>
    </>
  );
};
