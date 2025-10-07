import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, RadialGradient, Stop, G} from 'react-native-svg';
import {MarblePosition, MARBLE_GRADIENTS} from '../../constants/splash';

interface FallingMarbleProps {
  marble: MarblePosition;
}

export const FallingMarble: React.FC<FallingMarbleProps> = ({marble}) => {
  const translateY = useRef(new Animated.Value(marble.startY)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(marble.delay),
      Animated.parallel([
        // Fall animation
        Animated.timing(translateY, {
          toValue: marble.endY,
          duration: marble.duration,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        // Scale bounce
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: marble.duration * 0.8,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        // Slight rotation
        Animated.timing(rotation, {
          toValue: Math.random() > 0.5 ? 10 : -10,
          duration: marble.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [marble, translateY, scale, rotation]);

  const gradient = MARBLE_GRADIENTS[marble.color];

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: marble.endX - marble.size,
        transform: [
          {translateY},
          {scale},
          {
            rotate: rotation.interpolate({
              inputRange: [-10, 10],
              outputRange: ['-10deg', '10deg'],
            }),
          },
        ],
      }}>
      <Svg
        width={marble.size * 2}
        height={marble.size * 2}
        viewBox={`0 0 ${marble.size * 2} ${marble.size * 2}`}>
        <Defs>
          <LinearGradient id={`gradient-${marble.id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={gradient.start} />
            <Stop offset="100%" stopColor={gradient.end} />
          </LinearGradient>
          <RadialGradient id={`gloss-${marble.id}`} cx="32%" cy="28%" r="60%">
            <Stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <Stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <G>
          <Circle
            cx={marble.size}
            cy={marble.size}
            r={marble.size}
            fill={`url(#gradient-${marble.id})`}
          />
          <Circle
            cx={marble.size - marble.size * 0.25}
            cy={marble.size - marble.size * 0.35}
            r={marble.size * 0.5}
            fill={`url(#gloss-${marble.id})`}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};
