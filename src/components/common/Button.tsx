import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  Animated,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

type ButtonColor = 'blue' | 'pink' | 'green' | 'purple';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'large' | 'medium' | 'small';
  color?: ButtonColor;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

const BUTTON_COLORS: Record<
  ButtonColor,
  { text: string; border: string; bg: string }
> = {
  blue: {
    text: '#1E40AF',
    border: 'rgba(78, 130, 255, 0.5)',
    bg: '#7FB1FF',
  },
  pink: {
    text: '#BE185D',
    border: 'rgba(236, 72, 153, 0.3)',
    bg: '#EC4899',
  },
  green: {
    text: '#15803D',
    border: 'rgba(34, 197, 94, 0.3)',
    bg: '#22C55E',
  },
  purple: {
    text: '#6B21A8',
    border: 'rgba(139, 92, 246, 0.3)',
    bg: '#8B5CF6',
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  color = 'blue',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  style,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
    onPressOut?.(e);
  };

  const buttonColors = BUTTON_COLORS[color];

  const textStyle = [
    styles.text,
    styles[`${size}Text`],
    variant === 'primary' && { color: '#FFFFFF' },
    variant === 'secondary' && { color: buttonColors.text },
    variant === 'tertiary' && styles.tertiaryText,
    disabled && styles.disabledText,
  ];

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? '#FFFFFF'
              : variant === 'tertiary'
              ? '#6B7280'
              : buttonColors.text
          }
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={textStyle}
            numberOfLines={1}
            allowFontScaling={false}
            {...(Platform.OS === 'android' && { includeFontPadding: false })}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </View>
  );

  const buttonStyle = [
    styles.button,
    styles[size],
    variant === 'primary' && {
      backgroundColor: buttonColors.bg,
      borderWidth: 0,
    },
    variant === 'secondary' && styles.secondary,
    variant === 'secondary' && { borderColor: buttonColors.border },
    variant === 'tertiary' && styles.tertiary,
    disabled && styles.disabled,
    style,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonStyle}
        activeOpacity={0.9}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: moderateScale(26),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        // Android에서는 elevation이 배경색에 영향을 줄 수 있어 제거
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sizes
  large: {
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(36),
    minWidth: scale(200),
    ...Platform.select({
      ios: {
        height: verticalScale(58),
      },
      android: {
        height: verticalScale(64),
        justifyContent: 'center',
      },
    }),
  },
  medium: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(32),
    minWidth: scale(180),
    height: verticalScale(54),
  },
  small: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    height: verticalScale(46),
  },
  // Variants
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    ...Platform.select({
      android: {
        height: verticalScale(64),
        justifyContent: 'center',
      },
    }),
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  largeText: {
    fontSize: moderateScale(16),
    letterSpacing: 0.3,
    lineHeight: moderateScale(22),
  },
  mediumText: {
    fontSize: moderateScale(15),
    letterSpacing: 0.2,
    lineHeight: moderateScale(21),
  },
  smallText: {
    fontSize: moderateScale(13),
    letterSpacing: 0.1,
    lineHeight: moderateScale(18),
  },
  tertiaryText: {
    color: '#64748B',
  },
  disabledText: {
    opacity: 0.6,
  },
  // Icons
  iconLeft: {
    marginRight: scale(6),
  },
  iconRight: {
    marginLeft: scale(6),
  },
});
