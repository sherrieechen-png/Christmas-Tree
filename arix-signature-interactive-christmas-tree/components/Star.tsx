
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, TREE_CONFIG } from '../constants';

export const Star: React.FC<{ morphProgress: number }> = ({ morphProgress }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale * morphProgress);
      // Position moves with the tree top
      meshRef.current.position.y = (TREE_CONFIG.HEIGHT / 2 + 1) * morphProgress;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color={COLORS.GOLD_BRIGHT} 
          emissive={COLORS.GOLD_BRIGHT} 
          emissiveIntensity={10} 
          metalness={1}
          roughness={0}
        />
      </mesh>
      <pointLight color={COLORS.GOLD_BRIGHT} intensity={50} distance={10} />
    </group>
  );
};
