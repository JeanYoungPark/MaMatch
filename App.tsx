/**
 * MaMatch - 구슬 매칭 게임
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import mobileAds from 'react-native-google-mobile-ads';
import {SplashScreen} from './src/screens/SplashScreen';
import {IntroScreen} from './src/screens/IntroScreen';
import {PrivacyPolicyScreen} from './src/screens/PrivacyPolicyScreen';
import {HowToPlayScreen} from './src/screens/HowToPlayScreen';
import {GameScreen} from './src/screens/GameScreen';

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Game: undefined;
  HowToPlay: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  useEffect(() => {
    // AdMob 초기화
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('AdMob initialization failed:', error);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            presentation: 'card',
          }}>
          <Stack.Screen name="Splash">
            {({navigation}) => (
              <SplashScreen onFinish={() => navigation.replace('Intro')} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Intro">
            {({navigation}) => (
              <IntroScreen
                onStartGame={() => navigation.navigate('Game')}
                onHowToPlay={() => navigation.navigate('HowToPlay')}
                onPrivacyPolicy={() => navigation.navigate('PrivacyPolicy')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen
            name="HowToPlay"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}>
            {({navigation}) => (
              <HowToPlayScreen onClose={() => navigation.goBack()} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="PrivacyPolicy"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}>
            {({navigation}) => (
              <PrivacyPolicyScreen onClose={() => navigation.goBack()} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
