import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// 기준 디자인 크기 (iPhone 14 Pro 기준)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// 화면 너비 기준 스케일
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

// 화면 높이 기준 스케일
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

// 중간 스케일 (너비와 높이의 평균)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// 화면 크기 정보
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;
