import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import {screenWidth, screenHeight, moderateScale} from '../../utils/responsive';

const SCREEN_WIDTH = screenWidth;
const SCREEN_HEIGHT = screenHeight;

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colors: string[];
}

const BALL_COLORS = [
  ['#7FB1FF', '#4E82FF'], // Blue
  ['#FFA3BF', '#FF6B9D'], // Pink
  ['#8FF3CC', '#5EDCA8'], // Green
  ['#C4A3FF', '#9370FF'], // Purple
];

// 최소 속도 보장 함수
const getRandomVelocity = () => {
  const velocity = (Math.random() - 0.5) * 3; // -1.5 ~ 1.5
  // 너무 느린 속도 방지: 최소 절대값 0.8
  return Math.abs(velocity) < 0.8 ? (velocity > 0 ? 0.8 : -0.8) : velocity;
};

export const BouncingBalls: React.FC = () => {
  const animationRef = useRef<number | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const [, setUpdateCount] = useState(0);

  // 구슬 초기화 (5개) - ref로 관리
  useEffect(() => {
    ballsRef.current = Array.from({length: 5}, (_, i) => ({
      id: i,
      x: Math.random() * (SCREEN_WIDTH - 100) + 50,
      y: Math.random() * (SCREEN_HEIGHT - 100) + 50,
      vx: getRandomVelocity(),
      vy: getRandomVelocity(),
      size: moderateScale(60) + Math.random() * moderateScale(40), // 반응형 크기: 60-100px
      colors: BALL_COLORS[i % BALL_COLORS.length],
    }));

    const animate = () => {
      ballsRef.current.forEach(ball => {
        // 새 위치 계산
        let newX = ball.x + ball.vx;
        let newY = ball.y + ball.vy;

        // 벽 충돌 감지 및 반사
        if (newX <= ball.size / 2) {
          newX = ball.size / 2;
          ball.vx = Math.abs(ball.vx) * 0.98;
        } else if (newX >= SCREEN_WIDTH - ball.size / 2) {
          newX = SCREEN_WIDTH - ball.size / 2;
          ball.vx = -Math.abs(ball.vx) * 0.98;
        }

        if (newY <= ball.size / 2) {
          newY = ball.size / 2;
          ball.vy = Math.abs(ball.vy) * 0.98;
        } else if (newY >= SCREEN_HEIGHT - ball.size / 2) {
          newY = SCREEN_HEIGHT - ball.size / 2;
          ball.vy = -Math.abs(ball.vy) * 0.98;
        }

        // 속도가 너무 느려지면 다시 증가
        if (Math.abs(ball.vx) < 0.5) {
          ball.vx = ball.vx > 0 ? 0.8 : -0.8;
        }
        if (Math.abs(ball.vy) < 0.5) {
          ball.vy = ball.vy > 0 ? 0.8 : -0.8;
        }

        // 위치 업데이트
        ball.x = newX;
        ball.y = newY;
      });

      // 리렌더링 트리거
      setUpdateCount(prev => prev + 1);

      animationRef.current = requestAnimationFrame(animate);
    };

    // 애니메이션 시작
    animate();

    // 클린업
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {ballsRef.current.map(ball => (
        <View
          key={ball.id}
          style={[
            styles.ballContainer,
            {
              width: ball.size,
              height: ball.size,
              left: ball.x - ball.size / 2,
              top: ball.y - ball.size / 2,
            },
          ]}>
          <Svg
            width={ball.size}
            height={ball.size}
            viewBox={`0 0 ${ball.size} ${ball.size}`}>
            <Defs>
              <SvgLinearGradient
                id={`gradient-${ball.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1">
                <Stop offset="0%" stopColor={ball.colors[0]} />
                <Stop offset="100%" stopColor={ball.colors[1]} />
              </SvgLinearGradient>
              <RadialGradient
                id={`gloss-${ball.id}`}
                cx="32%"
                cy="28%"
                r="60%">
                <Stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
                <Stop offset="60%" stopColor="#fff" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <G opacity="0.4">
              <Circle
                cx={ball.size / 2}
                cy={ball.size / 2}
                r={ball.size / 2}
                fill={`url(#gradient-${ball.id})`}
              />
              <Circle
                cx={ball.size / 2 - ball.size * 0.15}
                cy={ball.size / 2 - ball.size * 0.2}
                r={ball.size * 0.3}
                fill={`url(#gloss-${ball.id})`}
              />
            </G>
          </Svg>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  ballContainer: {
    position: 'absolute',
  },
});
