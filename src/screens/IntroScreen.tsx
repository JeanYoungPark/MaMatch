import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenLayout } from '../components/layout/ScreenLayout';
import { Button } from '../components/common/Button';
import { BouncingBalls } from '../components/animations/BouncingBalls';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

interface IntroScreenProps {
  onStartGame: () => void;
  onHowToPlay: () => void;
  onPrivacyPolicy: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartGame,
  onHowToPlay,
  onPrivacyPolicy,
}) => {
  return (
    <ScreenLayout backgroundColor="#F8FAFC">
      <LinearGradient
        colors={['#E0F2FE', '#FCE7F3', '#F0FDFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Bouncing Balls Animation */}
        <BouncingBalls />

        <View style={styles.container}>
          {/* Title Section with Glass Effect */}
          <View style={styles.titleSection}>
            <View style={styles.glassCard}>
              <Text style={styles.title}>MaMatch</Text>
              <Text style={styles.subtitle}>구슬 매칭 게임</Text>
              <Text style={styles.description}>
                같은 색의 구슬을 3개 이상 맞춰보세요!
              </Text>
            </View>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonsSection}>
            <Button
              title="게임 시작"
              variant="primary"
              size="large"
              color="blue"
              onPress={onStartGame}
            />

            <Button
              title="게임 방법"
              variant="secondary"
              size="large"
              color="blue"
              onPress={onHowToPlay}
            />
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Button
              title="개인정보 취급방침"
              variant="tertiary"
              size="small"
              onPress={onPrivacyPolicy}
            />
          </View>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(24),
    gap: verticalScale(48),
  },
  titleSection: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: moderateScale(28),
    paddingVertical: verticalScale(32),
    paddingHorizontal: scale(40),
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        // Android에서는 elevation이 배경색에 영향을 줄 수 있어 제거
      },
    }),
  },
  title: {
    fontSize: moderateScale(44),
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: verticalScale(10),
    textShadowColor: 'rgba(15, 23, 42, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: moderateScale(17),
    color: '#475569',
    fontWeight: '600',
    marginBottom: verticalScale(8),
    letterSpacing: 0.3,
  },
  description: {
    fontSize: moderateScale(14),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  buttonsSection: {
    alignItems: 'center',
    gap: verticalScale(12),
    zIndex: 1,
    width: '100%',
  },
  footerSection: {
    alignItems: 'center',
    zIndex: 1,
    marginTop: verticalScale(24),
  },
});
