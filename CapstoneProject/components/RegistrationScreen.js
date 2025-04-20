import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    retypePassword: '',
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    country: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = () => {
    const { username, password, retypePassword, firstName, day, month, year, country } = formData;
    if (!username || !password || !retypePassword || !firstName || !day || !month || !year || !country) {
      Alert.alert('Error', 'All fields except Last Name are required.');
    } else if (password !== retypePassword) {
      Alert.alert('Error', 'Passwords do not match.');
    } else {
      navigation.navigate('Genre', { formData });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false} 
        bounces={false}
      >
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Create Your Account</Text>

        <TextInput placeholder="First Name" placeholderTextColor="#888" style={styles.input} onChangeText={(text) => handleChange('firstName', text)} />
        <TextInput placeholder="Last Name (optional)" placeholderTextColor="#888" style={styles.input} onChangeText={(text) => handleChange('lastName', text)} />

        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.rowContainer}>
          <TextInput placeholder="DD" placeholderTextColor="#888" style={styles.smallInput} keyboardType="numeric" onChangeText={(text) => handleChange('day', text)} />
          <TextInput placeholder="MM" placeholderTextColor="#888" style={styles.smallInput} keyboardType="numeric" onChangeText={(text) => handleChange('month', text)} />
          <TextInput placeholder="YYYY" placeholderTextColor="#888" style={styles.smallInput} keyboardType="numeric" onChangeText={(text) => handleChange('year', text)} />
        </View>

        <TextInput placeholder="Country" placeholderTextColor="#888" style={styles.input} onChangeText={(text) => handleChange('country', text)} />
        <TextInput placeholder="Username" placeholderTextColor="#888" style={styles.input} onChangeText={(text) => handleChange('username', text)} />
        <TextInput placeholder="Create Password" placeholderTextColor="#888" secureTextEntry style={styles.input} onChangeText={(text) => handleChange('password', text)} />
        <TextInput placeholder="Retype Password" placeholderTextColor="#888" secureTextEntry style={styles.input} onChangeText={(text) => handleChange('retypePassword', text)} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  scrollContainer: {
    flexGrow: 1, // Prevents unnecessary scrolling
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 140,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: -50,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  smallInput: {
    width: '30%',
    height: 50,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#E50914',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backText: {
    color: '#E50914',
    marginTop: 15,
    fontSize: 16,
  },
});
