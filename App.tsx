/**
 * MaMatch - 구슬 매칭 게임
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from './src/screens/SplashScreen';
import {IntroScreen} from './src/screens/IntroScreen';
import {PrivacyPolicyScreen} from './src/screens/PrivacyPolicyScreen';

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
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
                onStartGame={() => console.log('Start Game')}
                onHowToPlay={() => console.log('How to Play')}
                onPrivacyPolicy={() => navigation.navigate('PrivacyPolicy')}
              />
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
