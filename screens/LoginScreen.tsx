import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import shadows from '../shadows';
import spacing, { radius } from '../spacing';
import { textStyles } from '../typography';
import CustomButton from '../components/UI/CustomButton';
import Input from '../components/UI/Input';
import PasswordInput from '../components/UI/PasswordInput';
import { login, register } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.auth);
  const [validationError, setValidationError] = useState('');

  const handleAuth = async (isLogin = true) => {
    if (!emailValidation(email)) {
      setValidationError('Invalid email.');
      return;
    }
    if (password.length < 7) {
      setValidationError('Password should be at least 6 characters.');
      return;
    }

    setValidationError('');
    if (isLogin) {
      dispatch(login({ email, password }));
    } else {
      dispatch(register({ email, password }));
    }
  };

  const emailValidation = (email: string) => {
    const expression: RegExp = /@.*\./;

    return expression.test(email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>SpentBuddy</Text>
          <Text style={styles.subtitle}>Track every euro with less effort</Text>
        </View>

        <View style={styles.authContent}>
          <Input
            label="Email"
            invalid={validationError.includes('email')}
            inputProps={{
              onChangeText: setEmail,
              value: email,
              keyboardType: 'email-address',
              autoCapitalize: 'none',
              autoCorrect: false,
            }}
          />
          <PasswordInput
            label={'Password'}
            invalid={validationError.includes('Password')}
            onChangeText={setPassword}
            value={password}
          />

          {(error || validationError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error || validationError}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Log In"
              onPress={handleAuth.bind(this, true)}
              iconName="log-in-outline"
              color={colors.primary}
            />
            <Text style={styles.or}>or</Text>
            <CustomButton
              title="Sign Up"
              disabled={email.length < 1 || password.length < 6}
              onPress={handleAuth.bind(this, false)}
              iconName="person-add-outline"
              color={colors.accentGreen}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  title: {
    fontSize: textStyles.displayMedium.fontSize,
    fontWeight: textStyles.displayMedium.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: textStyles.body.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  authContent: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.base,
  },
  errorContainer: {
    paddingVertical: spacing.xs,
  },
  error: {
    textAlign: 'center',
    color: colors.error,
    fontSize: textStyles.small.fontSize,
    fontWeight: textStyles.smallMedium.fontWeight,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
    alignItems: 'stretch',
    marginTop: spacing.sm,
  },
  or: {
    fontSize: textStyles.small.fontSize,
    fontWeight: textStyles.smallMedium.fontWeight,
    textAlign: 'center',
    color: colors.textMuted,
  },
});

export default LoginScreen;
