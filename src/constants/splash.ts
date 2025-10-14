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
  blue: {start: '#A5C9FF', end: '#7FB1FF'},
  pink: {start: '#FFC4D6', end: '#FFA3BF'},
  yellow: {start: '#FFF3C4', end: '#FFE794'},
  mint: {start: '#B4F5DF', end: '#8FF3CC'},
  violet: {start: '#DDD6FE', end: '#C4B5FD'},
  amber: {start: '#FFE5B4', end: '#FFD58A'},
  cyan: {start: '#A5F3FC', end: '#7DD3FC'},
} as const;
