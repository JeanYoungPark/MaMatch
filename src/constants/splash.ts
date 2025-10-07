import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const SPLASH_CONFIG = {
  ANIMATION_DURATION: 3000,
  MARBLE_FALL_DURATION: 800,
  TEXT_FADE_DELAY: 2000,
  AUTO_NAVIGATE_DELAY: 3000,
} as const;

export interface MarblePosition {
  id: number;
  color: 'blue' | 'pink' | 'yellow' | 'mint' | 'violet' | 'amber' | 'cyan';
  startY: number;
  endY: number;
  endX: number;
  delay: number;
  duration: number;
  size: number;
}

export const MARBLE_POSITIONS: MarblePosition[] = [
  {
    id: 1,
    color: 'blue',
    startY: -300,
    endY: SCREEN_HEIGHT * 0.25,
    endX: SCREEN_WIDTH * 0.22,
    delay: 0,
    duration: 800,
    size: 24,
  },
  {
    id: 2,
    color: 'pink',
    startY: -250,
    endY: SCREEN_HEIGHT * 0.3,
    endX: SCREEN_WIDTH * 0.5,
    delay: 100,
    duration: 850,
    size: 24,
  },
  {
    id: 3,
    color: 'yellow',
    startY: -400,
    endY: SCREEN_HEIGHT * 0.22,
    endX: SCREEN_WIDTH * 0.78,
    delay: 150,
    duration: 900,
    size: 26,
  },
  {
    id: 4,
    color: 'mint',
    startY: -320,
    endY: SCREEN_HEIGHT * 0.38,
    endX: SCREEN_WIDTH * 0.33,
    delay: 200,
    duration: 850,
    size: 24,
  },
  {
    id: 5,
    color: 'violet',
    startY: -280,
    endY: SCREEN_HEIGHT * 0.4,
    endX: SCREEN_WIDTH * 0.67,
    delay: 250,
    duration: 800,
    size: 24,
  },
  {
    id: 6,
    color: 'amber',
    startY: -350,
    endY: SCREEN_HEIGHT * 0.33,
    endX: SCREEN_WIDTH * 0.44,
    delay: 300,
    duration: 900,
    size: 24,
  },
  {
    id: 7,
    color: 'cyan',
    startY: -290,
    endY: SCREEN_HEIGHT * 0.28,
    endX: SCREEN_WIDTH * 0.61,
    delay: 350,
    duration: 850,
    size: 24,
  },
];

export const MARBLE_GRADIENTS = {
  blue: {start: '#7FB1FF', end: '#4E82FF'},
  pink: {start: '#FFA3BF', end: '#FF5B8C'},
  yellow: {start: '#FFE794', end: '#FFC83D'},
  mint: {start: '#8FF3CC', end: '#34D399'},
  violet: {start: '#C4B5FD', end: '#8B5CF6'},
  amber: {start: '#FFD58A', end: '#F59E0B'},
  cyan: {start: '#67E8F9', end: '#22D3EE'},
} as const;
