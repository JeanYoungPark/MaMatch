import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';

interface ScreenLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
  edges?: Edge[];
  style?: ViewStyle;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  backgroundColor = '#ffffff',
  edges = ['top', 'bottom'],
  style,
}) => {
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor}, style]}
      edges={edges}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
