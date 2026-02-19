import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../colors';
import shadows from '../../shadows';
import spacing, { radius } from '../../spacing';
import { textStyles } from '../../typography';
import { SwitchProps } from '../../types';

const ToggleSwitch = ({
  onSwitch,
  isEnabled,
  textOff,
  textOn,
}: SwitchProps) => {
  return (
    <TouchableOpacity
      onPress={onSwitch}
      style={styles.container}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: isEnabled }}
    >
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.text,
            !isEnabled ? styles.textDisabled : styles.textActive,
          ]}
        >
          {textOff}
        </Text>

        <View
          style={[styles.slider, !isEnabled ? styles.sliderOn : styles.sliderOff]}
        />
        <Text
          style={[
            styles.text,
            isEnabled ? styles.textDisabled : styles.textActive,
          ]}
        >
          {textOn}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '84%',
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  slider: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: colors.primary,
  },
  sliderOn: {
    left: '50%',
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  sliderOff: {
    left: 0,
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    zIndex: 1,
    fontSize: textStyles.smallMedium.fontSize,
    fontWeight: textStyles.smallMedium.fontWeight,
  },
  textActive: {
    color: colors.textInverse,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});

export default ToggleSwitch;
