import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Animated } from 'react-native';

export default function CustomSplashScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds
      useNativeDriver: true,
    }).start();

    // Navigate to LoginScreen after the splash screen duration
    setTimeout(() => {
      navigation.replace('Login'); // Replace splash screen with login screen
    }, 3000); // Wait for 3 seconds before navigating
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      {/* Fade-in animated logo */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('../assets/logo.png')} // Your logo file path
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      {/* Loading indicator */}
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Netflix-style black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 450,
  },
  loader: {
    marginTop: 40,
  },
});
