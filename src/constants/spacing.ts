/**
 * Cozy Growth Design System - Spacing
 * Consistent spacing scale
 */

export const Spacing = {
  // Base spacing unit: 4px
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,

  // Specific use cases
  screenPadding: 20,
  cardPadding: 16,
  buttonPadding: 12,
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  },
};

export const BorderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999, // Fully rounded pills
};

export const Shadow = {
  // Soft, diffused shadows for cozy feel
  sm: {
    shadowColor: '#4A4036',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#4A4036',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#4A4036',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#4A4036',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default Spacing;
