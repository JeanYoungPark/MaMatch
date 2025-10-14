import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenLayout} from '../components/layout/ScreenLayout';

interface PrivacyPolicyScreenProps {
  onClose: () => void;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  onClose: _onClose,
}) => {
  return (
    <ScreenLayout backgroundColor="#F8FAFC">
      <View style={styles.container} />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
