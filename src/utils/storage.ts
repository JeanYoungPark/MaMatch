import AsyncStorage from '@react-native-async-storage/async-storage';
import {GameState} from '../types';

const KEYS = {
  HIGH_SCORE: '@MaMatch:highScore',
  GAME_STATE: '@MaMatch:gameState',
};

// 최고 점수 저장
export const saveHighScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.HIGH_SCORE, score.toString());
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

// 최고 점수 불러오기
export const getHighScore = async (): Promise<number> => {
  try {
    const score = await AsyncStorage.getItem(KEYS.HIGH_SCORE);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0;
  }
};

// 게임 상태 저장
export const saveGameState = async (state: GameState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// 게임 상태 불러오기
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const state = await AsyncStorage.getItem(KEYS.GAME_STATE);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};
