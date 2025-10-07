import React, {useEffect} from 'react';
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
      {MARBLE_POSITIONS.map(marble => (
        <FallingMarble key={marble.id} marble={marble} />
      ))}
      <MaMatchText />
    </ScreenLayout>
  );
};
