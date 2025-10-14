import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FallingMarble} from '../components/splash/FallingMarble';
import {MaMatchText} from '../components/splash/MaMatchText';
import {ScreenLayout} from '../components/layout/ScreenLayout';
import {MARBLE_POSITIONS, SPLASH_CONFIG} from '../constants/splash';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, SPLASH_CONFIG.AUTO_NAVIGATE_DELAY);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <ScreenLayout backgroundColor="#F8FAFC">
      <LinearGradient
        colors={['#E0F2FE', '#FCE7F3', '#F0FDFA']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        {MARBLE_POSITIONS.map(marble => (
          <FallingMarble key={marble.id} marble={marble} />
        ))}
        <MaMatchText />
      </LinearGradient>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
});
