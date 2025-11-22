/**
 * Particle System for Cozy Growth
 * Creates delightful particle effects for various interactions
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export type ParticleType = 'sparkle' | 'heart' | 'leaf' | 'water' | 'sunlight';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
}

interface ParticleSystemProps {
  type: ParticleType;
  count?: number;
  duration?: number;
  spread?: number;
  active?: boolean;
}

const PARTICLE_EMOJIS: Record<ParticleType, string> = {
  sparkle: '✨',
  heart: '💚',
  leaf: '🍃',
  water: '💧',
  sunlight: '☀️',
};

export function ParticleSystem({
  type,
  count = 20,
  duration = 1500,
  spread = 100,
  active = true,
}: ParticleSystemProps) {
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    // Initialize particles
    particles.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(1),
    }));

    // Animate each particle
    particles.current.forEach((particle, index) => {
      const angle = (Math.PI * 2 * index) / count;
      const distance = spread * (0.5 + Math.random() * 0.5);
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: endX,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: endY,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: 360,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: duration * 0.7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, [active, count, duration, spread]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle) => (
        <Animated.Text
          key={particle.id}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        >
          {PARTICLE_EMOJIS[type]}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 20,
  },
});
