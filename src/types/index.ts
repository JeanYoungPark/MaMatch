// 구슬 타입
export type MarbleType = 0 | 1 | 2 | 3 | 4;

// 보드 위치
export interface Position {
  row: number;
  col: number;
}

// 구슬 객체
export interface Marble {
  type: MarbleType;
  position: Position;
}

// 게임 상태
export interface GameState {
  board: MarbleType[][];
  score: number;
  moves: number;
  isGameOver: boolean;
}
