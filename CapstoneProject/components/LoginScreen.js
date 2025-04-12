import React, { useState, useContext,useEffect } from 'react';
import { UserContext } from './UserContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { userId, setUserId } = useContext(UserContext);
  const { likedMovies, setLikedMovies} = useContext(UserContext);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }
      
      console.log('result', result);
      // set user id
      setUserId(result.user.user_id);

      // Set likedMovies
      setLikedMovies();

      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 200); 
      // navigation.navigate('Dashboard', { user_id: result.user.user_id });

    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong.');
    }
  };

  // useEffect(() => {
  //     if (userId) {
  //       navigation.navigate('Dashboard');
  //     }
  //   }, [userId]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.loginBox}>
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 180,
    height: 90,
    marginBottom: 20,
  },
  loginBox: {
    width: '85%',
    padding: 25,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    elevation: 5,
    shadowColor: '#ff0000',
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    color: '#fff',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#ff0000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createAccountButton: {
    height: 50,
    borderColor: '#ff0000',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#ff0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
