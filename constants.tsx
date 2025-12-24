
import * as THREE from 'three';

export const COLORS = {
  EMERALD_DARK: '#064e3b',
  EMERALD_LIGHT: '#10b981',
  GOLD_METALLIC: '#d4af37',
  GOLD_BRIGHT: '#fbbf24',
  DEEP_VOID: '#020617',
};

export const TREE_CONFIG = {
  PARTICLE_COUNT: 1200,
  ORNAMENT_COUNT: 150,
  HEIGHT: 12,
  RADIUS: 5,
  SCATTER_RADIUS: 25,
};

export const INITIAL_STATE = {
  morph: 0, // 0 is scattered, 1 is tree
  rotationSpeed: 0.1,
};
