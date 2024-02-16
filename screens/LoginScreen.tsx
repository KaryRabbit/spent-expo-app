import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
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
    <ImageBackground
      source={require('../assets/images/bg-22.jpg')}
      style={styles.container}
    >
      <Ionicons style={styles.icon} name="wallet" size={60} />

      <View style={styles.authContent}>
        <Input
          label="Email"
          invalid={validationError.includes('email')}
          inputProps={{
            onChangeText: setEmail,
            value: email,
          }}
        />
        <PasswordInput
          label={'Password'}
          invalid={validationError.includes('Password')}
          onChangeText={setPassword}
          value={password}
        />
        <View style={styles.errorContainer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {validationError ? (
            <Text style={styles.error}>{validationError}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Log In"
            onPress={handleAuth.bind(this, true)}
            iconName="log-in-outline"
            color={colors.accentLight}
          />
          <Text style={styles.or}>or</Text>
          <CustomButton
            title="Sign Up"
            disabled={email.length < 1 || password.length < 6}
            onPress={handleAuth.bind(this, false)}
            iconName="person-add-outline"
            color={colors.accentLight}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.screenBackground,
  },
  icon: {
    color: colors.white,
    alignSelf: 'center',
    marginBottom: 16,
  },
  errorContainer: {
    height: '16%',
  },
  error: {
    textAlign: 'center',
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 8,
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 8,
    minHeight: 48,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'stretch',
  },
  or: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.white,
  },
  authContent: {
    padding: 16,
    borderRadius: 8,
    gap: 16,
    marginHorizontal: 16,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
