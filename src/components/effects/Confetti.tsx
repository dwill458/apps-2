/**
 * Confetti Component
 * Celebration animation for achievements
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  color: string;
  emoji: string;
}

interface ConfettiProps {
  active?: boolean;
  count?: number;
  duration?: number;
  emojis?: string[];
}

export function Confetti({
  active = true,
  count = 40,
  duration = 3000,
  emojis = ['🌱', '✨', '💚', '🌿', '🍃'],
}: ConfettiProps) {
  const pieces = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) return;

    // Initialize confetti pieces
    pieces.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * 100 - 50),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(Math.random() * 360),
      opacity: new Animated.Value(1),
      color: ['#8BA888', '#FFD166', '#EF8354', '#5C7A58'][Math.floor(Math.random() * 4)],
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    // Animate each piece
    pieces.current.forEach((piece) => {
      const fallDistance = 400 + Math.random() * 200;
      const drift = (Math.random() - 0.5) * 100;

      Animated.parallel([
        Animated.timing(piece.y, {
          toValue: fallDistance,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(piece.x, {
          toValue: parseFloat(piece.x._value as any) + drift,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(piece.rotation, {
            toValue: parseFloat(piece.rotation._value as any) + 720,
            duration: duration,
            useNativeDriver: true,
          })
        ),
        Animated.timing(piece.opacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [active, count, duration, emojis]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.current.map((piece) => (
        <Animated.Text
          key={piece.id}
          style={[
            styles.piece,
            {
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                { rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                },
              ],
              opacity: piece.opacity,
            },
          ]}
        >
          {piece.emoji}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  piece: {
    position: 'absolute',
    fontSize: 24,
    top: 0,
  },
});
