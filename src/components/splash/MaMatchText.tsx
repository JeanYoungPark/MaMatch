import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {SPLASH_CONFIG} from '../../constants/splash';
import {moderateScale} from '../../utils/responsive';

export const MaMatchText: React.FC = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(SPLASH_CONFIG.TEXT_FADE_DELAY),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{translateY}],
        },
      ]}>
      <Text style={styles.text}>MaMatch</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '25%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(48),
    fontWeight: '700',
    letterSpacing: 2,
    color: '#334155',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
});
