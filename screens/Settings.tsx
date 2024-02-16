import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
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
          color={colors.accent}
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
    gap: 16,
    margin: 16,
    flex: 1,
  },
  error: {
    textAlign: 'center',
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: 24,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
