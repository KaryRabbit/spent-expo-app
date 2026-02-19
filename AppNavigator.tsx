import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import colors from './colors';
import IconButton from './components/UI/IconButton';
import { auth } from './firebaseConfig';
import Dashboard from './screens/Dashboard';
import ExpensesScreen from './screens/ExpensesScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import Settings from './screens/Settings';
import { logout } from './store/authSlice';
import { AppDispatch } from './store/store';
import { User } from './types';

const AppNavigator = () => {
  const Bottom = createBottomTabNavigator();
  const AuthStack = createStackNavigator();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.screenBackground,
      text: colors.textPrimary,
      card: colors.surface,
      border: colors.border,
      primary: colors.primary,
    },
  };

  const AuthNavigator = () => {
    return (
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AuthStack.Screen name="LoginPage" component={LoginScreen} />
      </AuthStack.Navigator>
    );
  };

  const [storedUser, setUser] = useState<User | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkUserAuth = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userData: User | null = {
            email: user.email,
            uid: user.uid,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      });
    };

    checkUserAuth();
  }, [dispatch]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={MyTheme}>
        {storedUser ? (
          <Bottom.Navigator
            screenOptions={({ navigation, route }) => ({
              headerRight: ({ tintColor }) => (
                <IconButton
                  iconName="log-out-outline"
                  color={tintColor || colors.textInverse}
                  onPress={logOut}
                />
              ),
              tabBarIcon: ({ focused, color, size }) => {
                type IconName =
                  | 'alert-circle-outline'
                  | 'stats-chart'
                  | 'stats-chart-outline'
                  | 'wallet'
                  | 'wallet-outline'
                  | 'time'
                  | 'time-outline'
                  | 'settings-sharp'
                  | 'settings-outline';

                let iconName: IconName = 'alert-circle-outline';

                switch (route.name) {
                  case 'Dashboard':
                    iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    break;
                  case 'Expenses':
                    iconName = focused ? 'wallet' : 'wallet-outline';
                    break;
                  case 'History':
                    iconName = focused ? 'time' : 'time-outline';
                    break;
                  case 'Settings':
                    iconName = focused ? 'settings-sharp' : 'settings-outline';
                    break;
                }
                return (
                  <Ionicons
                    name={iconName as IconName}
                    size={size}
                    color={color}
                  />
                );
              },

              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: '700',
              },
              headerTintColor: colors.textInverse,
              headerShadowVisible: false,
              tabBarStyle: {
                position: 'absolute',
                left: 12,
                right: 12,
                bottom: 16,
                borderRadius: 16,
                height: 68,
                paddingBottom: 8,
                paddingTop: 8,
                backgroundColor: colors.primary,
                borderTopWidth: 0,
                borderWidth: 1,
                borderColor: colors.borderStrong,
              },
              sceneStyle: { backgroundColor: colors.background },
              tabBarActiveTintColor: colors.textInverse,
              tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
            })}
          >
            <Bottom.Screen name="Dashboard" component={Dashboard} />
            <Bottom.Screen name="Expenses" component={ExpensesScreen} />
            <Bottom.Screen
              options={{ title: 'Transactions History' }}
              name="History"
              component={HistoryScreen}
            />
            <Bottom.Screen name="Settings" component={Settings} />
          </Bottom.Navigator>
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
