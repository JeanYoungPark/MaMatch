// 게임 기본 설정
export const GAME_CONFIG = {
  BOARD_SIZE: 8, // 8x8 보드
  MIN_MATCH: 3, // 최소 매칭 개수
  MAX_MATCH: 5, // 최대 매칭 개수
  MARBLE_TYPES: 5, // 구슬 종류 개수
} as const;

// 점수 설정
export const SCORE_CONFIG = {
  MATCH_3: 100,
  MATCH_4: 250,
  MATCH_5: 500,
  COMBO_MULTIPLIER: 1.5,
} as const;
