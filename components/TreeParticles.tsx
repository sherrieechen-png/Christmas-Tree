
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TREE_CONFIG, COLORS } from '../constants';
import { ParticleData } from '../types';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

interface TreeParticlesProps {
  morphProgress: number; // 0 (Scattered) to 1 (Tree)
}

export const TreeParticles: React.FC<TreeParticlesProps> = ({ morphProgress }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate positions
  const particles = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < TREE_CONFIG.PARTICLE_COUNT; i++) {
      // 1. Scattered Position (In a large sphere)
      const scatterPos = new THREE.Vector3(
        (Math.random() - 0.5) * TREE_CONFIG.SCATTER_RADIUS * 2,
        (Math.random() - 0.5) * TREE_CONFIG.SCATTER_RADIUS * 2,
        (Math.random() - 0.5) * TREE_CONFIG.SCATTER_RADIUS * 2
      );

      // 2. Tree Position (Conical Spiral)
      const ratio = i / TREE_CONFIG.PARTICLE_COUNT;
      const height = ratio * TREE_CONFIG.HEIGHT - TREE_CONFIG.HEIGHT / 2;
      const angle = ratio * Math.PI * 40; // High frequency spiral
      const radius = (1 - ratio) * TREE_CONFIG.RADIUS;
      const noise = (Math.random() - 0.5) * 0.5; // Add some organic feel
      
      const treePos = new THREE.Vector3(
        Math.cos(angle) * (radius + noise),
        height,
        Math.sin(angle) * (radius + noise)
      );

      data.push({
        scatterPosition: scatterPos,
        treePosition: treePos,
        scatterRotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        treeRotation: new THREE.Euler(0, angle, 0),
        scale: 0.1 + Math.random() * 0.2
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      // Interpolate Position
      const currentPos = new THREE.Vector3().lerpVectors(p.scatterPosition, p.treePosition, morphProgress);
      
      // Add subtle floating animation
      if (morphProgress < 1) {
        currentPos.y += Math.sin(time + i) * 0.1 * (1 - morphProgress);
        currentPos.x += Math.cos(time * 0.5 + i) * 0.1 * (1 - morphProgress);
      }

      tempObject.position.copy(currentPos);
      
      // Interpolate Rotation (simplified)
      tempObject.rotation.set(
        THREE.MathUtils.lerp(p.scatterRotation.x, p.treeRotation.x, morphProgress),
        THREE.MathUtils.lerp(p.scatterRotation.y, p.treeRotation.y, morphProgress),
        THREE.MathUtils.lerp(p.scatterRotation.z, p.treeRotation.z, morphProgress)
      );

      tempObject.scale.setScalar(p.scale);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      // Coloring logic: Emerald needles
      tempColor.set(i % 10 === 0 ? COLORS.GOLD_METALLIC : COLORS.EMERALD_DARK);
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TREE_CONFIG.PARTICLE_COUNT]}>
      <boxGeometry args={[0.5, 0.05, 0.2]} />
      <meshStandardMaterial metalness={0.8} roughness={0.2} />
    </instancedMesh>
  );
};

export const Ornaments: React.FC<TreeParticlesProps> = ({ morphProgress }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const ornamentData = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < TREE_CONFIG.ORNAMENT_COUNT; i++) {
      const scatterPos = new THREE.Vector3(
        (Math.random() - 0.5) * TREE_CONFIG.SCATTER_RADIUS,
        (Math.random() - 0.5) * TREE_CONFIG.SCATTER_RADIUS,
        (Math.random() - 0.5) * TREE_CONFIG.SCATTER_RADIUS
      );

      const ratio = Math.random();
      const height = ratio * TREE_CONFIG.HEIGHT - TREE_CONFIG.HEIGHT / 2;
      const angle = Math.random() * Math.PI * 2;
      const radius = (1 - ratio) * TREE_CONFIG.RADIUS;

      const treePos = new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      data.push({
        scatterPosition: scatterPos,
        treePosition: treePos,
        scatterRotation: new THREE.Euler(),
        treeRotation: new THREE.Euler(),
        scale: 0.2 + Math.random() * 0.3
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    ornamentData.forEach((p, i) => {
      const currentPos = new THREE.Vector3().lerpVectors(p.scatterPosition, p.treePosition, morphProgress);
      
      // Floating
      currentPos.y += Math.sin(time * 0.8 + i) * 0.15 * (1 - morphProgress);

      tempObject.position.copy(currentPos);
      tempObject.scale.setScalar(p.scale * morphProgress); // Ornaments appear as tree forms
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TREE_CONFIG.ORNAMENT_COUNT]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial 
        color={COLORS.GOLD_BRIGHT} 
        metalness={1} 
        roughness={0.1}
        envMapIntensity={2}
      />
    </instancedMesh>
  );
};
