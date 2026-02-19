import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';
import CustomButton from '../components/UI/CustomButton';
import PasswordInput from '../components/UI/PasswordInput';
import { changePassword, clearErrors } from '../store/authSlice';
import { clearExpenses } from '../store/expensesSlice';
import { AppDispatch, RootState } from '../store/store';

const Settings = () => {
  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const { error, status } = useSelector((state: RootState) => state?.auth);

  const handlePasswordChange = () => {
    dispatch(changePassword({ newPassword, currentPassword }));
  };

  const handleCurrentPasswordChange = (password: string) => {
    setCurrentPassword(password);
  };

  const handleNewPasswordChange = (password: string) => {
    setNewPassword(password);
  };

  const handleClearData = () => {
    Alert.alert('Are you sure?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => dispatch(clearExpenses()) },
    ]);
  };

  return status === 'loading' ? (
    <ActivityIndicator
      size="large"
      color={colors.headerBackground}
      style={styles.loader}
    />
  ) : (
    <View style={styles.container}>
      <PasswordInput
        label={'Current password'}
        onChangeText={handleCurrentPasswordChange}
        value={currentPassword}
      />

      <PasswordInput
        label={'New password'}
        onChangeText={handleNewPasswordChange}
        value={newPassword}
      />
      <View>
        <CustomButton
          title="Change Password"
          disabled={
            currentPassword.length < 6 ||
            newPassword.length < 6 ||
            currentPassword === newPassword
          }
          onPress={handlePasswordChange}
          iconName="key"
          color={colors.primary}
        />
        <CustomButton
          title="Clear Data"
          onPress={handleClearData}
          iconName="trash"
          color={colors.error}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default Settings;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: spacing.base,
    margin: spacing.base,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.base,
  },
  error: {
    textAlign: 'center',
    color: colors.error,
    fontSize: textStyles.small.fontSize,
    fontWeight: textStyles.smallMedium.fontWeight,
    marginTop: spacing.xs,
    marginHorizontal: spacing.base,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
