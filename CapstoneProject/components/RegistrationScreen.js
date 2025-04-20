import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert as RNAlert,
} from 'react-native';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    RNAlert.alert(title, message);
  }
};

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

  const [validationErrors, setValidationErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/check-username/'; // Replace with your actual backend URL

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (field === 'username') {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username) return;

    try {
      const response = await fetch(`${API_URL}?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setUsernameAvailable(!data.is_taken);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    }
  };

  const isNumeric = (value) => /^\d+$/.test(value);

  const handleRegister = () => {
    const errors = {};
    const { username, password, retypePassword, firstName, day, month, year, country } = formData;

    if (!firstName) errors.firstName = 'First name is required.';
    if (!day || !month || !year) {
      errors.dob = 'Complete date of birth is required.';
    } else {
      if (!isNumeric(day) || +day < 1 || +day > 31) errors.day = 'Enter a valid day.';
      if (!isNumeric(month) || +month < 1 || +month > 12) errors.month = 'Enter a valid month.';
      if (!isNumeric(year) || +year < 1900 || +year > new Date().getFullYear()) errors.year = 'Enter a valid year.';
    }
    if (!country) errors.country = 'Country is required.';
    if (!username) errors.username = 'Username is required.';
    if (usernameAvailable === false) {
      errors.username = 'Username is already taken.';
    }
    if (!password) errors.password = 'Password is required.';
    if (!retypePassword) errors.retypePassword = 'Please retype your password.';
    if (password && retypePassword && password !== retypePassword) {
      errors.retypePassword = 'Passwords do not match.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      navigation.navigate('Genre', { formData });
    } else {
      showAlert('Validation Error', 'Please correct the highlighted fields.');
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

        <TextInput
          placeholder="First Name"
          placeholderTextColor="#888"
          style={[styles.input, validationErrors.firstName && styles.inputError]}
          onChangeText={(text) => handleChange('firstName', text)}
        />
        {validationErrors.firstName && <Text style={styles.errorText}>{validationErrors.firstName}</Text>}

        <TextInput
          placeholder="Last Name (optional)"
          placeholderTextColor="#888"
          style={styles.input}
          onChangeText={(text) => handleChange('lastName', text)}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.rowContainer}>
          <TextInput
            placeholder="DD"
            placeholderTextColor="#888"
            style={[styles.smallInput, validationErrors.day && styles.inputError]}
            keyboardType="numeric"
            onChangeText={(text) => handleChange('day', text)}
          />
          <TextInput
            placeholder="MM"
            placeholderTextColor="#888"
            style={[styles.smallInput, validationErrors.month && styles.inputError]}
            keyboardType="numeric"
            onChangeText={(text) => handleChange('month', text)}
          />
          <TextInput
            placeholder="YYYY"
            placeholderTextColor="#888"
            style={[styles.smallInput, validationErrors.year && styles.inputError]}
            keyboardType="numeric"
            onChangeText={(text) => handleChange('year', text)}
          />
        </View>
        {(validationErrors.dob || validationErrors.day || validationErrors.month || validationErrors.year) && (
          <Text style={styles.errorText}>
            {validationErrors.day || validationErrors.month || validationErrors.year || validationErrors.dob}
          </Text>
        )}

        <TextInput
          placeholder="Country"
          placeholderTextColor="#888"
          style={[styles.input, validationErrors.country && styles.inputError]}
          onChangeText={(text) => handleChange('country', text)}
        />
        {validationErrors.country && <Text style={styles.errorText}>{validationErrors.country}</Text>}

        <TextInput placeholder="Username" placeholderTextColor="#888" style={styles.input} onChangeText={(text) => handleChange('username', text)} />
        {formData.username.length > 0 && usernameAvailable !== null && (
          <Text style={{ color: usernameAvailable ? 'green' : '#E50914' }}>
            {usernameAvailable ? 'Username is available' : 'Username is taken'}
          </Text>
        )}
        {validationErrors.username && <Text style={styles.errorText}>{validationErrors.username}</Text>}

        <TextInput
          placeholder="Create Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={[styles.input, validationErrors.password && styles.inputError]}
          onChangeText={(text) => handleChange('password', text)}
        />
        {validationErrors.password && <Text style={styles.errorText}>{validationErrors.password}</Text>}

        <TextInput
          placeholder="Retype Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={[styles.input, validationErrors.retypePassword && styles.inputError]}
          onChangeText={(text) => handleChange('retypePassword', text)}
        />
        {validationErrors.retypePassword && <Text style={styles.errorText}>{validationErrors.retypePassword}</Text>}

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
    flexGrow: 1,
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
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#E50914',
    borderWidth: 1,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
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
  errorText: {
    color: '#E50914',
    fontSize: 13,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
});
