import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../colors';
import spacing from '../../spacing';
import { PasswordInputProps } from '../../types';
import IconButton from './IconButton';
import Input from './Input';

const PasswordInput = ({ label, invalid, ...rest }: PasswordInputProps) => {
  const [isSecure, setIsSecure] = useState(true);
  return (
    <View>
      <Input
        invalid={invalid}
        label={label}
        inputProps={{
          secureTextEntry: isSecure,
          ...rest,
        }}
      />

      <IconButton
        style={styles.icon}
        onPress={() => setIsSecure(!isSecure)}
        iconName={isSecure ? 'eye-outline' : 'eye-off-outline'}
        color={colors.textSecondary}
        size={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default PasswordInput;
