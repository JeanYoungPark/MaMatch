import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {ScreenLayout} from '../components/layout/ScreenLayout';
import {scale, verticalScale, moderateScale} from '../utils/responsive';
import Svg, {Path} from 'react-native-svg';

interface HowToPlayScreenProps {
  onClose: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onClose,
}) => {
  return (
    <ScreenLayout backgroundColor="#F8FAFC">
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Svg
            width={moderateScale(24)}
            height={moderateScale(24)}
            viewBox="0 0 24 24"
            fill="none">
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
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
  },
  backButton: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    alignSelf: 'flex-start',
  },
});
