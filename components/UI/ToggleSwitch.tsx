import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../colors';
import { lightenHexColor } from '../../service/tools';
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

        <LinearGradient
          colors={[colors.primary, lightenHexColor(colors.primary1, 15)]}
          style={[
            styles.slider,
            !isEnabled ? styles.sliderOn : styles.sliderOff,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        {/* <View
          style={[
            styles.slider,
            !isEnabled ? styles.sliderOn : styles.sliderOff,
          ]}
        /> */}
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
    width: '70%',
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center', // Aligns text to the sides
  },
  slider: {
    position: 'absolute',
    width: '50%',
    height: '100%',
  },
  sliderOn: {
    left: '50%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  sliderOff: {
    left: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.disabled,
    borderRadius: 16,
  },
  text: {
    opacity: 0,
    flex: 1,
    textAlign: 'center',
    zIndex: 1,
  },
  textActive: {
    opacity: 1,
    color: colors.white,
  },
  textDisabled: {
    opacity: 0.5,
  },
});

export default ToggleSwitch;
