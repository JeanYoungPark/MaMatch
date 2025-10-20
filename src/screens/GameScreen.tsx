import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { Button } from '../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// AdMob 배너 광고 유닛 ID (테스트용)
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy', // 실제 iOS 광고 ID로 교체
      android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy', // 실제 Android 광고 ID로 교체
    });

type MarbleColor = 'blue' | 'pink' | 'green' | 'purple' | 'yellow' | 'cyan';
type SpecialType = 'horizontal' | 'vertical' | 'bomb' | null;

interface Marble {
  color: MarbleColor;
  id: string;
  specialType?: SpecialType; // 특수 아이템 타입
  animatedValue?: Animated.Value;
  scaleValue?: Animated.Value;
  translateX?: Animated.Value;
  translateY?: Animated.Value;
  opacityValue?: Animated.Value;
}

const MARBLE_COLORS: Record<MarbleColor, string[]> = {
  blue: ['#7FB1FF', '#4E82FF'],
  pink: ['#FFA3BF', '#FF6B9D'],
  green: ['#8FF3CC', '#5EDCA8'],
  purple: ['#C4A3FF', '#9370FF'],
  yellow: ['#FFE794', '#FFC83D'],
  cyan: ['#7DD3FC', '#22D3EE'],
};

const GRID_SIZE = 7;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = (SCREEN_WIDTH - scale(80)) / GRID_SIZE; // 여백 80 제외하고 균등 분배
const MARBLE_SIZE = CELL_SIZE * 0.9; // 셀 크기의 90%

const getRandomColor = (): MarbleColor => {
  const colors: MarbleColor[] = [
    'blue',
    'pink',
    'green',
    'purple',
    'yellow',
    'cyan',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const initializeGrid = (): (Marble | null)[][] => {
  const grid: (Marble | null)[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = {
        color: getRandomColor(),
        id: `${row}-${col}-${Date.now()}`,
        animatedValue: new Animated.Value(0),
        scaleValue: new Animated.Value(1),
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        opacityValue: new Animated.Value(1),
      };
    }
  }
  return grid;
};

// 3개 이상 매칭된 구슬 찾기 (4개 이상 매칭 시 특수 아이템 생성 정보 포함)
const findMatches = (
  grid: (Marble | null)[][],
): {
  matchedIds: Set<string>;
  specialItems: Array<{ row: number; col: number; type: SpecialType; color: MarbleColor }>;
  matchedSpecialItems: Array<{ row: number; col: number; type: SpecialType }>;
} => {
  const matchedIds = new Set<string>();
  const specialItems: Array<{ row: number; col: number; type: SpecialType; color: MarbleColor }> = [];
  const matchedSpecialItems: Array<{ row: number; col: number; type: SpecialType }> = [];

  // 가로 방향 체크
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 2; col++) {
      const marble1 = grid[row][col];
      const marble2 = grid[row][col + 1];
      const marble3 = grid[row][col + 2];

      if (
        marble1 &&
        marble2 &&
        marble3 &&
        marble1.color === marble2.color &&
        marble2.color === marble3.color
      ) {
        const matchStart = col;
        let matchEnd = col + 2;

        // 3개 이상 연속인 경우 계속 추가
        let extraCol = col + 3;
        while (extraCol < GRID_SIZE) {
          const extraMarble = grid[row][extraCol];
          if (extraMarble && extraMarble.color === marble1.color) {
            matchEnd = extraCol;
            extraCol++;
          } else {
            break;
          }
        }

        // 매칭된 구슬들 추가 및 특수 아이템 확인
        for (let c = matchStart; c <= matchEnd; c++) {
          const marble = grid[row][c]!;
          matchedIds.add(marble.id);

          // 매칭된 구슬이 특수 아이템이면 추적
          if (marble.specialType) {
            matchedSpecialItems.push({
              row,
              col: c,
              type: marble.specialType,
            });
          }
        }

        // 4개 이상 매칭 시 특수 아이템 생성
        const matchCount = matchEnd - matchStart + 1;
        if (matchCount >= 5) {
          // 5개 이상 → 폭탄 (주변 3x3 파괴)
          const centerCol = Math.floor((matchStart + matchEnd) / 2);
          specialItems.push({
            row,
            col: centerCol,
            type: 'bomb',
            color: marble1.color,
          });
        } else if (matchCount === 4) {
          // 4개 → 세로 파괴 아이템 (가로 매칭)
          const centerCol = Math.floor((matchStart + matchEnd) / 2);
          specialItems.push({
            row,
            col: centerCol,
            type: 'vertical',
            color: marble1.color,
          });
        }

        // 이미 처리한 부분은 건너뛰기
        col = matchEnd;
      }
    }
  }

  // 세로 방향 체크
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      const marble1 = grid[row][col];
      const marble2 = grid[row + 1][col];
      const marble3 = grid[row + 2][col];

      if (
        marble1 &&
        marble2 &&
        marble3 &&
        marble1.color === marble2.color &&
        marble2.color === marble3.color
      ) {
        const matchStart = row;
        let matchEnd = row + 2;

        // 3개 이상 연속인 경우 계속 추가
        let extraRow = row + 3;
        while (extraRow < GRID_SIZE) {
          const extraMarble = grid[extraRow][col];
          if (extraMarble && extraMarble.color === marble1.color) {
            matchEnd = extraRow;
            extraRow++;
          } else {
            break;
          }
        }

        // 매칭된 구슬들 추가 및 특수 아이템 확인
        for (let r = matchStart; r <= matchEnd; r++) {
          const marble = grid[r][col]!;
          matchedIds.add(marble.id);

          // 매칭된 구슬이 특수 아이템이면 추적
          if (marble.specialType) {
            matchedSpecialItems.push({
              row: r,
              col,
              type: marble.specialType,
            });
          }
        }

        // 4개 이상 매칭 시 특수 아이템 생성
        const matchCount = matchEnd - matchStart + 1;
        if (matchCount >= 5) {
          // 5개 이상 → 폭탄 (주변 3x3 파괴)
          const centerRow = Math.floor((matchStart + matchEnd) / 2);
          specialItems.push({
            row: centerRow,
            col,
            type: 'bomb',
            color: marble1.color,
          });
        } else if (matchCount === 4) {
          // 4개 → 가로 파괴 아이템 (세로 매칭)
          const centerRow = Math.floor((matchStart + matchEnd) / 2);
          specialItems.push({
            row: centerRow,
            col,
            type: 'horizontal',
            color: marble1.color,
          });
        }

        // 이미 처리한 부분은 건너뛰기
        row = matchEnd;
      }
    }
  }

  return { matchedIds, specialItems, matchedSpecialItems };
};

// 가능한 이동이 있는지 체크
const hasPossibleMoves = (grid: (Marble | null)[][]): boolean => {
  // 1. 특수 아이템이 있는지 확인
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col]?.specialType) {
        return true; // 특수 아이템이 있으면 항상 이동 가능
      }
    }
  }

  // 2. 스왑으로 매칭을 만들 수 있는지 확인
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      // 오른쪽과 스왑
      if (col < GRID_SIZE - 1) {
        const testGrid = grid.map(r => [...r]);
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row][col + 1];
        testGrid[row][col + 1] = temp;

        const { matchedIds } = findMatches(testGrid);
        if (matchedIds.size > 0) {
          return true;
        }
      }

      // 아래쪽과 스왑
      if (row < GRID_SIZE - 1) {
        const testGrid = grid.map(r => [...r]);
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row + 1][col];
        testGrid[row + 1][col] = temp;

        const { matchedIds } = findMatches(testGrid);
        if (matchedIds.size > 0) {
          return true;
        }
      }
    }
  }

  return false; // 가능한 이동이 없음
};

export const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore] = useState(0);
  const [grid, setGrid] = useState<(Marble | null)[][]>(initializeGrid);
  const [gameKey, setGameKey] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [comboPosition, setComboPosition] = useState({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const comboOpacity = useRef(new Animated.Value(0)).current;
  const comboScale = useRef(new Animated.Value(0.5)).current;

  // 비동기 작업 추적
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 모든 timeout 취소
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // 1단계: 구슬 낙하 준비 (Animated.Value만 설정, 애니메이션 시작 안 함)
  const prepareDropMarbles = (
    currentGrid: (Marble | null)[][],
  ): (Marble | null)[][] => {
    const newGrid = currentGrid.map(row => [...row]);

    // 각 열에 대해 처리
    for (let col = 0; col < GRID_SIZE; col++) {
      // 아래에서 위로 올라가면서 null이 아닌 구슬들을 수집
      const marblesInColumn: { marble: Marble; fromRow: number }[] = [];
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col] !== null) {
          marblesInColumn.push({ marble: newGrid[row][col]!, fromRow: row });
        }
      }

      // 열을 다시 채우기 (아래부터 구슬, 위는 null)
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const marbleIndex = GRID_SIZE - 1 - row;
        if (marbleIndex < marblesInColumn.length) {
          const { marble, fromRow } = marblesInColumn[marbleIndex];
          const dropDistance = row - fromRow; // 떨어지는 거리

          // 애니메이션 값 설정 (시작은 안 함)
          if (dropDistance > 0) {
            marble.animatedValue = new Animated.Value(
              -dropDistance * CELL_SIZE,
            );
            marble.scaleValue = new Animated.Value(1);
            marble.translateX = new Animated.Value(0);
            marble.translateY = new Animated.Value(0);
            marble.opacityValue = new Animated.Value(1);
          } else {
            marble.animatedValue = new Animated.Value(0);
            marble.scaleValue = new Animated.Value(1);
            marble.translateX = new Animated.Value(0);
            marble.translateY = new Animated.Value(0);
            marble.opacityValue = new Animated.Value(1);
          }

          newGrid[row][col] = marble;
        } else {
          newGrid[row][col] = null;
        }
      }
    }

    return newGrid;
  };

  // 2단계: 낙하 애니메이션 시작
  const startDropAnimations = (currentGrid: (Marble | null)[][]) => {
    currentGrid.forEach(row => {
      row.forEach(marble => {
        if (marble && marble.animatedValue) {
          const currentValue = (marble.animatedValue as any)._value;
          // 초기 위치가 0이 아니면 (떨어져야 하면) 애니메이션 시작
          if (currentValue !== 0) {
            Animated.timing(marble.animatedValue, {
              toValue: 0,
              duration: 400,
              easing: Easing.bounce,
              useNativeDriver: true,
            }).start();
          }
        }
      });
    });
  };

  // 빈 공간을 새 구슬로 채우기
  const fillEmptySpaces = (
    currentGrid: (Marble | null)[][],
  ): (Marble | null)[][] => {
    const newGrid = currentGrid.map(row => [...row]);

    // 각 열에서 빈 공간 개수를 세고 위에서부터 애니메이션
    for (let col = 0; col < GRID_SIZE; col++) {
      let emptyCount = 0;

      for (let row = 0; row < GRID_SIZE; row++) {
        if (newGrid[row][col] === null) {
          emptyCount++;

          // 위에서 떨어지는 애니메이션
          const animValue = new Animated.Value(-CELL_SIZE * (emptyCount + 2));
          const opacityValue = new Animated.Value(0);

          newGrid[row][col] = {
            color: getRandomColor(),
            id: `${row}-${col}-${Date.now()}-${Math.random()}`,
            animatedValue: animValue,
            scaleValue: new Animated.Value(1),
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
            opacityValue: opacityValue,
          };

          // 탄성 있는 애니메이션 + 페이드인 실행
          Animated.parallel([
            Animated.timing(animValue, {
              toValue: 0,
              duration: 450,
              easing: Easing.bounce,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: 1,
              duration: 300,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    }

    return newGrid;
  };

  // 콤보 애니메이션 표시
  const showComboAnimation = () => {
    comboOpacity.setValue(0);
    comboScale.setValue(0.5);

    // 빠르게 나타나고 구슬과 함께 사라지기
    Animated.sequence([
      // 페이드인 (100ms)
      Animated.parallel([
        Animated.timing(comboOpacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(comboScale, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
      // 구슬 pop 총 시간(250ms) - 이미 100ms 지났으므로 150ms 페이드 아웃
      Animated.timing(comboOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 매칭된 구슬 제거 및 점수 계산
  const checkAndRemoveMatches = (
    currentGrid: (Marble | null)[][],
    currentCombo: number = 0,
  ) => {
    const { matchedIds, specialItems, matchedSpecialItems } = findMatches(currentGrid);

    // 매칭된 특수 아이템들의 효과를 추가로 적용
    const additionalRemoveIds = new Set<string>();
    matchedSpecialItems.forEach(({ row, col, type }) => {
      if (type === 'horizontal') {
        // 가로 줄 전체 추가 제거
        for (let c = 0; c < GRID_SIZE; c++) {
          if (currentGrid[row][c]) {
            additionalRemoveIds.add(currentGrid[row][c]!.id);
          }
        }
      } else if (type === 'vertical') {
        // 세로 줄 전체 추가 제거
        for (let r = 0; r < GRID_SIZE; r++) {
          if (currentGrid[r][col]) {
            additionalRemoveIds.add(currentGrid[r][col]!.id);
          }
        }
      } else if (type === 'bomb') {
        // 주변 3x3 영역 추가 제거
        for (let r = Math.max(0, row - 1); r <= Math.min(GRID_SIZE - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(GRID_SIZE - 1, col + 1); c++) {
            if (currentGrid[r][c]) {
              additionalRemoveIds.add(currentGrid[r][c]!.id);
            }
          }
        }
      }
    });

    // 기존 매칭과 특수 아이템 효과 합치기
    additionalRemoveIds.forEach(id => matchedIds.add(id));

    if (matchedIds.size > 0) {
      // 콤보 증가
      const newCombo = currentCombo + 1;
      setComboCount(newCombo);

      // 점수 계산 (콤보가 3 이상이면 x2)
      const baseScore = matchedIds.size * 10;
      const scoreMultiplier = newCombo >= 3 ? 2 : 1;
      const finalScore = baseScore * scoreMultiplier;

      setCurrentScore(prev => prev + finalScore);

      // 매칭된 구슬들의 평균 위치 계산
      let totalRow = 0;
      let totalCol = 0;
      let count = 0;

      currentGrid.forEach((row, rowIndex) => {
        row.forEach((marble, colIndex) => {
          if (marble && matchedIds.has(marble.id)) {
            totalRow += rowIndex;
            totalCol += colIndex;
            count++;
          }
        });
      });

      if (count > 0) {
        const avgRow = totalRow / count;
        const avgCol = totalCol / count;
        setComboPosition({
          x: avgCol * CELL_SIZE + CELL_SIZE / 2,
          y: avgRow * CELL_SIZE + CELL_SIZE / 2,
        });
      }

      // 콤보 3 이상이면 콤보 애니메이션 표시
      if (newCombo >= 3) {
        showComboAnimation();
      }

      // Pop 애니메이션 실행
      currentGrid.forEach(row => {
        row.forEach(marble => {
          if (marble && matchedIds.has(marble.id) && marble.scaleValue) {
            Animated.sequence([
              Animated.timing(marble.scaleValue, {
                toValue: 1.3,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(marble.scaleValue, {
                toValue: 0,
                duration: 150,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
            ]).start();
          }
        });
      });

      // 매칭된 구슬 제거 (pop 애니메이션 완료 후)
      requestAnimationFrame(() => {
        setTimeout(() => {
          let newGrid = currentGrid.map(row =>
            row.map(marble =>
              marble && matchedIds.has(marble.id) ? null : marble,
            ),
          );

          // 특수 아이템 생성 (4개 이상 매칭 시)
          specialItems.forEach(({ row, col, type, color }) => {
            if (newGrid[row][col] === null) {
              newGrid[row][col] = {
                color,
                id: `special-${row}-${col}-${Date.now()}`,
                specialType: type,
                animatedValue: new Animated.Value(0),
                scaleValue: new Animated.Value(0.5), // 작게 시작
                translateX: new Animated.Value(0),
                translateY: new Animated.Value(0),
                opacityValue: new Animated.Value(0), // 투명하게 시작
              };

              // 특수 아이템 등장 애니메이션
              const specialMarble = newGrid[row][col]!;
              Animated.parallel([
                Animated.spring(specialMarble.scaleValue!, {
                  toValue: 1.2, // 일반 구슬보다 약간 큼
                  friction: 5,
                  tension: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(specialMarble.opacityValue!, {
                  toValue: 1,
                  duration: 300,
                  easing: Easing.out(Easing.ease),
                  useNativeDriver: true,
                }),
              ]).start();
            }
          });

          requestAnimationFrame(() => {
            setTimeout(() => {
              setGrid(newGrid);
            }, 100);
          });

          // 구슬 낙하
          requestAnimationFrame(() => {
            setTimeout(() => {
              newGrid = prepareDropMarbles(newGrid);
              setGrid(newGrid);

              // 렌더링 완료 후 애니메이션 시작
              requestAnimationFrame(() => {
                startDropAnimations(newGrid);

                // drop 애니메이션 완료 후 빈 공간 채우기
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    newGrid = fillEmptySpaces(newGrid);
                    setGrid(newGrid);

                    // fill 애니메이션 완료 후 재매칭
                    requestAnimationFrame(() => {
                      setTimeout(() => {
                        checkAndRemoveMatches(newGrid, newCombo);
                      }, 100);
                    });
                  }, 400);
                });
              });
            }, 100);
          });
        }, 100);
      });
    } else {
      // 매칭이 없으면 콤보 초기화
      if (currentCombo > 0) {
        setComboCount(0);
      }

      // 가능한 이동이 있는지 체크
      if (!hasPossibleMoves(currentGrid)) {
        setIsGameOver(true);
      }
    }
  };

  useEffect(() => {
    // gameKey가 변경될 때마다 새 그리드 생성
    const newGrid = initializeGrid();
    setGrid(newGrid);
    setComboCount(0);

    requestAnimationFrame(() => {
      setTimeout(() => {
        checkAndRemoveMatches(newGrid, 0);
      }, 500);
    });
  }, [gameKey]);

  const handleNewGame = () => {
    // 진행 중인 모든 비동기 작업 취소
    clearAllTimeouts();

    // 상태 초기화
    setCurrentScore(0);
    setSelectedCell(null);
    setComboCount(0);
    setIsGameOver(false);
    comboOpacity.setValue(0);

    // gameKey만 변경하면 useEffect에서 자동으로 새 그리드 생성
    setGameKey(prev => prev + 1);
  };

  // 특수 아이템 효과를 연쇄적으로 수집하는 함수
  const collectSpecialItemEffects = (
    currentGrid: (Marble | null)[][],
    row: number,
    col: number,
    visited: Set<string>,
  ): { itemsToRemove: Set<string>; activatedCount: number } => {
    const marble = currentGrid[row][col];
    if (!marble || !marble.specialType || visited.has(marble.id)) {
      return { itemsToRemove: new Set(), activatedCount: 0 };
    }

    visited.add(marble.id);
    let activatedCount = 1;
    const itemsToRemove = new Set<string>();

    // 현재 특수 아이템 효과 적용
    if (marble.specialType === 'horizontal') {
      // 가로 줄 전체 제거
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentGrid[row][c]) {
          itemsToRemove.add(currentGrid[row][c]!.id);
        }
      }
    } else if (marble.specialType === 'vertical') {
      // 세로 줄 전체 제거
      for (let r = 0; r < GRID_SIZE; r++) {
        if (currentGrid[r][col]) {
          itemsToRemove.add(currentGrid[r][col]!.id);
        }
      }
    } else if (marble.specialType === 'bomb') {
      // 주변 3x3 영역 제거
      for (let r = Math.max(0, row - 1); r <= Math.min(GRID_SIZE - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(GRID_SIZE - 1, col + 1); c++) {
          if (currentGrid[r][c]) {
            itemsToRemove.add(currentGrid[r][c]!.id);
          }
        }
      }
    }

    // 제거될 구슬 중 특수 아이템 찾아서 재귀 호출 (연쇄 반응)
    currentGrid.forEach((rowArray, r) => {
      rowArray.forEach((m, c) => {
        if (m && itemsToRemove.has(m.id) && m.specialType && !visited.has(m.id)) {
          const chainResult = collectSpecialItemEffects(currentGrid, r, c, visited);
          chainResult.itemsToRemove.forEach(id => itemsToRemove.add(id));
          activatedCount += chainResult.activatedCount;
        }
      });
    });

    return { itemsToRemove, activatedCount };
  };

  // 특수 아이템 조합 효과 (아이템 + 아이템)
  const activateComboEffect = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
    currentGrid: (Marble | null)[][],
  ) => {
    const marble1 = currentGrid[row1][col1];
    const marble2 = currentGrid[row2][col2];

    if (!marble1?.specialType || !marble2?.specialType) return;

    const newGrid = currentGrid.map(r => [...r]);
    const itemsToRemove = new Set<string>();

    // 가로 + 세로 = 십자가 모양
    if (
      (marble1.specialType === 'horizontal' && marble2.specialType === 'vertical') ||
      (marble1.specialType === 'vertical' && marble2.specialType === 'horizontal')
    ) {
      // 첫 번째 아이템 위치 기준으로 십자가
      // 가로줄
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[row1][c]) {
          itemsToRemove.add(newGrid[row1][c]!.id);
        }
      }
      // 세로줄
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newGrid[r][col1]) {
          itemsToRemove.add(newGrid[r][col1]!.id);
        }
      }
    }
    // 폭탄 + 폭탄 = 5x5 범위
    else if (marble1.specialType === 'bomb' && marble2.specialType === 'bomb') {
      // 첫 번째 폭탄 위치 기준으로 5x5
      for (let r = Math.max(0, row1 - 2); r <= Math.min(GRID_SIZE - 1, row1 + 2); r++) {
        for (let c = Math.max(0, col1 - 2); c <= Math.min(GRID_SIZE - 1, col1 + 2); c++) {
          if (newGrid[r][c]) {
            itemsToRemove.add(newGrid[r][c]!.id);
          }
        }
      }
    }

    // 제거 애니메이션
    itemsToRemove.forEach(id => {
      newGrid.forEach(row => {
        row.forEach(marble => {
          if (marble && marble.id === id && marble.scaleValue) {
            Animated.timing(marble.scaleValue, {
              toValue: 0,
              duration: 200,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        });
      });
    });

    // 제거 후 처리
    setTimeout(() => {
      const clearedGrid = newGrid.map(row =>
        row.map(marble => (marble && itemsToRemove.has(marble.id) ? null : marble))
      );

      // 점수 추가 (조합 효과는 더 높은 점수)
      setCurrentScore(prev => prev + itemsToRemove.size * 20);

      setGrid(clearedGrid);

      // 구슬 낙하 및 재매칭
      requestAnimationFrame(() => {
        setTimeout(() => {
          let newGrid = prepareDropMarbles(clearedGrid);
          setGrid(newGrid);

          requestAnimationFrame(() => {
            startDropAnimations(newGrid);

            requestAnimationFrame(() => {
              setTimeout(() => {
                newGrid = fillEmptySpaces(newGrid);
                setGrid(newGrid);

                requestAnimationFrame(() => {
                  setTimeout(() => {
                    checkAndRemoveMatches(newGrid, 0);
                  }, 100);
                });
              }, 400);
            });
          });
        }, 100);
      });
    }, 200);
  };

  // 특수 아이템 활성화 (연쇄 반응 포함)
  const activateSpecialItem = (row: number, col: number, currentGrid?: (Marble | null)[][]) => {
    const gridToUse = currentGrid || grid;
    const marble = gridToUse[row][col];
    if (!marble || !marble.specialType) return;

    const newGrid = gridToUse.map(r => [...r]);
    const visited = new Set<string>();

    // 연쇄 반응 포함하여 모든 효과 수집
    const { itemsToRemove, activatedCount } = collectSpecialItemEffects(newGrid, row, col, visited);

    // 제거 애니메이션
    itemsToRemove.forEach(id => {
      newGrid.forEach(row => {
        row.forEach(marble => {
          if (marble && marble.id === id && marble.scaleValue) {
            Animated.timing(marble.scaleValue, {
              toValue: 0,
              duration: 200,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        });
      });
    });

    // 제거 후 처리
    setTimeout(() => {
      const clearedGrid = newGrid.map(row =>
        row.map(marble => (marble && itemsToRemove.has(marble.id) ? null : marble))
      );

      // 점수 추가 (각 활성화된 아이템마다 점수)
      setCurrentScore(prev => prev + activatedCount * 15);

      setGrid(clearedGrid);

      // 구슬 낙하 및 재매칭
      requestAnimationFrame(() => {
        setTimeout(() => {
          let newGrid = prepareDropMarbles(clearedGrid);
          setGrid(newGrid);

          requestAnimationFrame(() => {
            startDropAnimations(newGrid);

            requestAnimationFrame(() => {
              setTimeout(() => {
                newGrid = fillEmptySpaces(newGrid);
                setGrid(newGrid);

                requestAnimationFrame(() => {
                  setTimeout(() => {
                    checkAndRemoveMatches(newGrid, 0);
                  }, 100);
                });
              }, 400);
            });
          });
        }, 100);
      });
    }, 200);
  };

  const handleCellPress = (row: number, col: number) => {
    if (!selectedCell) {
      // 첫 번째 구슬 선택
      setSelectedCell({ row, col });
    } else {
      // 두 번째 구슬 선택 - 인접한지 확인
      const rowDiff = Math.abs(selectedCell.row - row);
      const colDiff = Math.abs(selectedCell.col - col);

      if (
        (rowDiff === 1 && colDiff === 0) ||
        (rowDiff === 0 && colDiff === 1)
      ) {
        // 인접한 구슬 - 스왑
        swapMarbles(selectedCell.row, selectedCell.col, row, col);
      }

      // 선택 해제
      setSelectedCell(null);
    }
  };

  const swapMarbles = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ) => {
    const newGrid = [...grid.map(row => [...row])];
    const marble1 = newGrid[row1][col1];
    const marble2 = newGrid[row2][col2];

    if (!marble1 || !marble2) return;

    // 이동 거리 계산
    const deltaX = (col2 - col1) * CELL_SIZE;
    const deltaY = (row2 - row1) * CELL_SIZE;

    // 애니메이션 실행
    if (
      marble1.translateX &&
      marble1.translateY &&
      marble2.translateX &&
      marble2.translateY
    ) {
      // marble1을 marble2 위치로
      Animated.parallel([
        Animated.timing(marble1.translateX, {
          toValue: deltaX,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(marble1.translateY, {
          toValue: deltaY,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        // marble2를 marble1 위치로
        Animated.timing(marble2.translateX, {
          toValue: -deltaX,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(marble2.translateY, {
          toValue: -deltaY,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 애니메이션 완료 후 먼저 그리드 위치 교환
        newGrid[row1][col1] = marble2;
        newGrid[row2][col2] = marble1;

        setGrid([...newGrid]);

        // 다음 프레임에서 translate 값 리셋
        requestAnimationFrame(() => {
          marble1.translateX?.setValue(0);
          marble1.translateY?.setValue(0);
          marble2.translateX?.setValue(0);
          marble2.translateY?.setValue(0);
        });

        // 스왑 후 매칭 확인 (매칭 우선, 없으면 아이템 실행)
        setTimeout(() => {
          const swappedMarble1 = newGrid[row2][col2]; // marble1이 이동한 위치
          const swappedMarble2 = newGrid[row1][col1]; // marble2가 이동한 위치

          // 1. 먼저 아이템 + 아이템 조합 체크
          if (swappedMarble1?.specialType && swappedMarble2?.specialType) {
            setComboCount(0);
            activateComboEffect(row2, col2, row1, col1, newGrid);
            return;
          }

          // 2. 매칭 체크
          const { matchedIds } = findMatches(newGrid);

          if (matchedIds.size > 0) {
            // 매칭이 있으면 콤보 리셋하고 제거 프로세스 시작 (매칭된 특수 아이템도 자동 실행됨)
            setComboCount(0);
            checkAndRemoveMatches(newGrid, 0);
          } else {
            // 3. 매칭이 없으면 스왑한 구슬에 특수 아이템이 있는지 확인
            const hasSpecialItem = swappedMarble1?.specialType || swappedMarble2?.specialType;

            if (hasSpecialItem) {
              // 특수 아이템이 있으면 해당 아이템만 활성화
              setComboCount(0);

              if (swappedMarble1?.specialType) {
                activateSpecialItem(row2, col2, newGrid);
              } else if (swappedMarble2?.specialType) {
                activateSpecialItem(row1, col1, newGrid);
              }
            } else {
              // 매칭도 없고 특수 아이템도 없으면 원래대로 복구
              swapBack(row1, col1, row2, col2, newGrid);
            }
          }
        }, 100);
      });
    }
  };

  const swapBack = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
    currentGrid: (Marble | null)[][],
  ) => {
    const marble1 = currentGrid[row1][col1];
    const marble2 = currentGrid[row2][col2];

    if (!marble1 || !marble2) return;

    // 이동 거리 계산 (원래대로 돌아가기)
    const deltaX = (col2 - col1) * CELL_SIZE;
    const deltaY = (row2 - row1) * CELL_SIZE;

    // 복구 애니메이션 실행
    if (
      marble1.translateX &&
      marble1.translateY &&
      marble2.translateX &&
      marble2.translateY
    ) {
      Animated.parallel([
        Animated.timing(marble1.translateX, {
          toValue: -deltaX,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(marble1.translateY, {
          toValue: -deltaY,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(marble2.translateX, {
          toValue: deltaX,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(marble2.translateY, {
          toValue: deltaY,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 애니메이션 완료 후 먼저 그리드 위치 복구
        const restoredGrid = [...currentGrid.map(row => [...row])];
        restoredGrid[row1][col1] = marble2;
        restoredGrid[row2][col2] = marble1;

        setGrid(restoredGrid);

        // 다음 프레임에서 translate 값 리셋
        requestAnimationFrame(() => {
          marble1.translateX?.setValue(0);
          marble1.translateY?.setValue(0);
          marble2.translateX?.setValue(0);
          marble2.translateY?.setValue(0);
        });
      });
    }
  };

  return (
    <ScreenLayout backgroundColor="#F8FAFC">
      <LinearGradient
        colors={['#E0F2FE', '#FCE7F3', '#F0FDFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Svg
                width={moderateScale(24)}
                height={moderateScale(24)}
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M15 18L9 12L15 6"
                  stroke="#1E40AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Score Section */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>현재 점수</Text>
              <Text style={styles.scoreValue}>{currentScore}</Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>최고 점수</Text>
              <Text style={styles.scoreValue}>{bestScore}</Text>
            </View>
          </View>

          {/* New Game Button */}
          <View style={styles.buttonSection}>
            <Button
              title="새 게임"
              variant="primary"
              size="medium"
              color="blue"
              onPress={handleNewGame}
            />
          </View>

          {/* Game Board */}
          <View style={styles.gameBoard}>
            <View style={styles.gridContainer} key={gameKey}>
              {grid.map((row, rowIndex) =>
                row.map((marble, colIndex) => (
                  <TouchableOpacity
                    key={`${gameKey}-${rowIndex}-${colIndex}`}
                    style={[
                      styles.gridCell,
                      selectedCell?.row === rowIndex &&
                        selectedCell?.col === colIndex &&
                        styles.selectedCell,
                    ]}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                    activeOpacity={0.7}
                  >
                    {marble && (
                      <Animated.View
                        style={{
                          opacity: marble.opacityValue || 1,
                          transform: [
                            {
                              translateX: marble.translateX || 0,
                            },
                            {
                              translateY: Animated.add(
                                marble.animatedValue || 0,
                                marble.translateY || 0,
                              ),
                            },
                            {
                              scale: marble.scaleValue || 1,
                            },
                          ],
                        }}
                      >
                        <Svg
                          width={MARBLE_SIZE}
                          height={MARBLE_SIZE}
                          viewBox="0 0 40 40"
                        >
                          <Defs>
                            <SvgLinearGradient
                              id={`gradient-${marble.id}`}
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <Stop
                                offset="0%"
                                stopColor={MARBLE_COLORS[marble.color][0]}
                              />
                              <Stop
                                offset="100%"
                                stopColor={MARBLE_COLORS[marble.color][1]}
                              />
                            </SvgLinearGradient>
                            <RadialGradient
                              id={`gloss-${marble.id}`}
                              cx="30%"
                              cy="25%"
                              r="50%"
                            >
                              <Stop
                                offset="0%"
                                stopColor="#fff"
                                stopOpacity="0.7"
                              />
                              <Stop
                                offset="70%"
                                stopColor="#fff"
                                stopOpacity="0"
                              />
                            </RadialGradient>
                          </Defs>
                          <G>
                            <Circle
                              cx="20"
                              cy="20"
                              r="18"
                              fill={`url(#gradient-${marble.id})`}
                            />
                            <Circle
                              cx="16"
                              cy="14"
                              r="8"
                              fill={`url(#gloss-${marble.id})`}
                            />
                            {/* 특수 아이템 화살표 표시 */}
                            {marble.specialType === 'horizontal' && (
                              <G>
                                {/* 좌측 화살표 */}
                                <Path
                                  d="M12 20 L7 20 L10 17 M7 20 L10 23"
                                  stroke="#FFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                                {/* 우측 화살표 */}
                                <Path
                                  d="M28 20 L33 20 L30 17 M33 20 L30 23"
                                  stroke="#FFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </G>
                            )}
                            {marble.specialType === 'vertical' && (
                              <G>
                                {/* 상단 화살표 */}
                                <Path
                                  d="M20 12 L20 7 L17 10 M20 7 L23 10"
                                  stroke="#FFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                                {/* 하단 화살표 */}
                                <Path
                                  d="M20 28 L20 33 L17 30 M20 33 L23 30"
                                  stroke="#FFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </G>
                            )}
                            {marble.specialType === 'bomb' && (
                              <G>
                                {/* 폭탄 아이콘 - 별모양 폭발 */}
                                {/* 중앙 원 */}
                                <Circle
                                  cx="20"
                                  cy="20"
                                  r="4"
                                  fill="#FFF"
                                  opacity="0.9"
                                />
                                {/* 폭발 선들 (8방향) */}
                                <Path
                                  d="M20 12 L20 8 M20 28 L20 32 M12 20 L8 20 M28 20 L32 20 M14 14 L11 11 M26 26 L29 29 M26 14 L29 11 M14 26 L11 29"
                                  stroke="#FFF"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  opacity="0.9"
                                />
                                {/* 작은 폭발 점들 */}
                                <Circle cx="20" cy="6" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="20" cy="34" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="6" cy="20" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="34" cy="20" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="9" cy="9" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="31" cy="31" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="31" cy="9" r="1.5" fill="#FFF" opacity="0.8" />
                                <Circle cx="9" cy="31" r="1.5" fill="#FFF" opacity="0.8" />
                              </G>
                            )}
                          </G>
                        </Svg>
                      </Animated.View>
                    )}
                  </TouchableOpacity>
                )),
              )}

              {/* Combo Display */}
              {comboCount >= 3 && (
                <Animated.View
                  style={[
                    styles.comboContainer,
                    {
                      position: 'absolute',
                      left: comboPosition.x + scale(10),
                      top: comboPosition.y - verticalScale(20),
                      opacity: comboOpacity,
                      transform: [{ scale: comboScale }, { rotate: '-15deg' }],
                      zIndex: 100,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#FFA3BF', '#C4A3FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.comboGradient}
                  >
                    <View style={styles.comboContent}>
                      <Text style={styles.comboText}>COMBO</Text>
                      <Text style={styles.comboNumber}>x{comboCount}</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Ad Banner */}
          <View style={styles.adContainer}>
            <BannerAd
              unitId={adUnitId!}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>

        {/* Game Over Modal */}
        {isGameOver && (
          <View style={styles.gameOverOverlay}>
            <View style={styles.gameOverModal}>
              <Text style={styles.gameOverTitle}>게임 오버!</Text>
              <Text style={styles.gameOverMessage}>
                더 이상 이동할 수 있는 조합이 없습니다
              </Text>
              <View style={styles.gameOverScore}>
                <Text style={styles.gameOverScoreLabel}>최종 점수</Text>
                <Text style={styles.gameOverScoreValue}>{currentScore}</Text>
              </View>
              <View style={styles.gameOverButtons}>
                <Button
                  title="새 게임"
                  variant="primary"
                  size="medium"
                  color="blue"
                  onPress={handleNewGame}
                />
                <View style={{ height: verticalScale(12) }} />
                <Button
                  title="메인으로"
                  variant="secondary"
                  size="medium"
                  color="blue"
                  onPress={() => navigation.goBack()}
                />
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: scale(20),
  },
  header: {
    marginBottom: verticalScale(20),
  },
  backButton: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    alignSelf: 'flex-start',
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
    gap: scale(12),
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    minWidth: scale(120),
  },
  scoreLabel: {
    fontSize: moderateScale(12),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  scoreValue: {
    fontSize: moderateScale(24),
    color: '#1E293B',
    fontWeight: '800',
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  gameBoard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    position: 'relative',
  },
  comboContainer: {
    shadowColor: '#C4A3FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  comboGradient: {
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  comboContent: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comboText: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(107, 33, 168, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  comboNumber: {
    fontSize: moderateScale(18),
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(107, 33, 168, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginTop: verticalScale(-1),
  },
  adContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  gridContainer: {
    width: CELL_SIZE * GRID_SIZE,
    height: CELL_SIZE * GRID_SIZE,
    backgroundColor: 'transparent',
    borderRadius: moderateScale(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    overflow: 'visible',
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'transparent',
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: 'rgba(255, 200, 100, 0.3)',
    borderColor: '#FFC83D',
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  gameOverModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(24),
    padding: scale(32),
    alignItems: 'center',
    width: scale(300),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  gameOverTitle: {
    fontSize: moderateScale(32),
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: verticalScale(12),
  },
  gameOverMessage: {
    fontSize: moderateScale(14),
    color: '#64748B',
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  gameOverScore: {
    backgroundColor: '#F1F5F9',
    borderRadius: moderateScale(16),
    padding: scale(20),
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  gameOverScoreLabel: {
    fontSize: moderateScale(12),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  gameOverScoreValue: {
    fontSize: moderateScale(36),
    fontWeight: '900',
    color: '#1E40AF',
  },
  gameOverButtons: {
    width: '100%',
  },
});
