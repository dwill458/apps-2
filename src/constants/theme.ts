/**
 * Cozy Growth Design System - Main Theme
 * Combines all design tokens
 */

import { Colors } from './colors';
import { Typography } from './typography';
import Spacing, { BorderRadius, Shadow } from './spacing';

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadow: Shadow,

  // Animation timings
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: 375,
    md: 768,
    lg: 1024,
  },
};

export default Theme;
