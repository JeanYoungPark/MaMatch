/**
 * MaMatch - 구슬 매칭 게임
 */

import React, {useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  FeDropShadow,
  Filter,
  G,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import {ScreenLayout} from './src/components/layout/ScreenLayout';
import {SplashScreen} from './src/screens/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScreenLayout backgroundColor="#ffffff" style={styles.container}>
        <Logo />
      </ScreenLayout>
    </SafeAreaProvider>
  );
}

function Logo() {
  return (
    <Svg width={256} height={256} viewBox="0 0 256 256">
      <Defs>
        {/* Soft shadow */}
        <Filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <FeDropShadow
            dx="0"
            dy="3"
            stdDeviation="5"
            floodColor="#0f172a"
            floodOpacity="0.18"
          />
        </Filter>

        {/* Color gradients */}
        <LinearGradient id="cBlue" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#7FB1FF" />
          <Stop offset="100%" stopColor="#4E82FF" />
        </LinearGradient>
        <LinearGradient id="cPink" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFA3BF" />
          <Stop offset="100%" stopColor="#FF5B8C" />
        </LinearGradient>
        <LinearGradient id="cYellow" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFE794" />
          <Stop offset="100%" stopColor="#FFC83D" />
        </LinearGradient>
        <LinearGradient id="cMint" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#8FF3CC" />
          <Stop offset="100%" stopColor="#34D399" />
        </LinearGradient>
        <LinearGradient id="cViolet" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#C4B5FD" />
          <Stop offset="100%" stopColor="#8B5CF6" />
        </LinearGradient>
        <LinearGradient id="cAmber" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFD58A" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
        <LinearGradient id="cCyan" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#67E8F9" />
          <Stop offset="100%" stopColor="#22D3EE" />
        </LinearGradient>

        {/* Gloss highlight */}
        <RadialGradient id="gloss" cx="32%" cy="28%" r="60%">
          <Stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <Stop offset="60%" stopColor="#fff" stopOpacity="0" />
          <Stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </RadialGradient>

        {/* Trail gradient */}
        <LinearGradient id="trailFade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#0F172A" stopOpacity="0" />
          <Stop offset="100%" stopColor="#0F172A" stopOpacity="0.12" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect width="256" height="256" rx="28" fill="#ffffff" />

      {/* Trails */}
      <G>
        <G transform="translate(128,76) rotate(-2)">
          <Rect x="-3" y="-36" width="6" height="40" rx="3" fill="url(#trailFade)" />
        </G>
        <G transform="translate(170,92) rotate(3)">
          <Rect x="-3" y="-34" width="6" height="36" rx="3" fill="url(#trailFade)" />
        </G>
        <G transform="translate(86,92) rotate(-4)">
          <Rect x="-3" y="-30" width="6" height="32" rx="3" fill="url(#trailFade)" />
        </G>
        <G transform="translate(170,152) rotate(1)">
          <Rect x="-3" y="-24" width="6" height="26" rx="3" fill="url(#trailFade)" />
        </G>
        <G transform="translate(86,152) rotate(-1)">
          <Rect x="-3" y="-20" width="6" height="22" rx="3" fill="url(#trailFade)" />
        </G>
      </G>

      {/* Honeycomb balls */}
      <G filter="url(#softShadow)">
        {/* Center */}
        <G transform="translate(128,132)">
          <Circle cx="0" cy="0" r="26" fill="url(#cYellow)" />
          <Circle cx="-7" cy="-9" r="14" fill="url(#gloss)" />
        </G>

        {/* Top */}
        <G transform="translate(128,78)">
          <Circle cx="0" cy="0" r="24" fill="url(#cBlue)" />
          <Circle cx="-6" cy="-8" r="12" fill="url(#gloss)" />
        </G>

        {/* Upper-right */}
        <G transform="translate(170,98)">
          <Circle cx="0" cy="0" r="24" fill="url(#cPink)" />
          <Circle cx="-6" cy="-8" r="12" fill="url(#gloss)" />
        </G>

        {/* Lower-right */}
        <G transform="translate(170,154)">
          <Circle cx="0" cy="0" r="24" fill="url(#cMint)" />
          <Circle cx="-6" cy="-8" r="12" fill="url(#gloss)" />
        </G>

        {/* Bottom */}
        <G transform="translate(128,176)">
          <Circle cx="0" cy="0" r="24" fill="url(#cViolet)" />
          <Circle cx="-6" cy="-8" r="12" fill="url(#gloss)" />
        </G>

        {/* Lower-left */}
        <G transform="translate(86,154)">
          <Circle cx="0" cy="0" r="24" fill="url(#cAmber)" />
          <Circle cx="-6" cy="-8" r="12" fill="url(#gloss)" />
        </G>

        {/* Upper-left */}
        <G transform="translate(86,98)">
          <Circle cx="0" cy="0" r="24" fill="url(#cCyan)" />
          <Circle cx="-6" cy="-8" r="12" fill="url(#gloss)" />
        </G>
      </G>

      {/* Landing spark */}
      <G transform="translate(128,196)" opacity="0.15">
        <Ellipse cx="0" cy="0" rx="28" ry="6" fill="#0F172A" />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
