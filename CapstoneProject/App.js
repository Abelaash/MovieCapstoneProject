import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomSplashScreen from './components/CustomSplashScreen';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import GenreSelectionScreen from './components/GenreSelectionScreen';
import MoviePreferenceScreen from './components/MoviePreferenceScreen';
import SettingsScreen from './components/SettingsScreen';
import DashboardScreen from './components/DashboardScreen';
import CategoryScreen from './components/CategoryScreen';
import MovieDetailsScreen from './components/MovieDetailsScreen';
import SearchResultScreen from './components/SearchResultScreen';
import SearchScreen from './components/SearchScreen';
import AIChatScreen from './components/AIChatScreen';
import { UserProvider } from './components/UserContext';
import 'react-native-reanimated';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Splash" component={CustomSplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="Genre" component={GenreSelectionScreen} />
            <Stack.Screen name="MoviePreference" component={MoviePreferenceScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="SearchResult" component={SearchResultScreen} />
            <Stack.Screen name="Details" component={MovieDetailsScreen} />
            <Stack.Screen name="AIChat" component={AIChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
