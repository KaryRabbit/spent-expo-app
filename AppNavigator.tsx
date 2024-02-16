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
      colors: { text: colors.accent },
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
      <StatusBar style="auto" />
      <NavigationContainer theme={MyTheme}>
        {storedUser ? (
          <Bottom.Navigator
            screenOptions={({ navigation, route }) => ({
              headerRight: ({ tintColor }) => (
                <IconButton
                  iconName="log-out-outline"
                  color={tintColor || colors.white}
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
                backgroundColor: colors.headerBackground,
              },
              headerTintColor: colors.secondary,
              tabBarStyle: { backgroundColor: colors.headerBackground },
              tabBarActiveTintColor: colors.secondary,
              tabBarInactiveTintColor: colors.screenBackground,
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
