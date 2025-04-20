// SettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import NavBar from './NavigationBar'; // Add this
import Header from './Header';



const SettingsScreen = () => {
  const navigation = useNavigation();

  const renderOption = (text) => (
    <TouchableOpacity style={styles.option}>
      <Text style={styles.optionText}>{text}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="#333" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
    <ScrollView style={styles.container}>
    <Header showBack={true} title="Settings" />
      <Text style={styles.memberText}>Member since October 2023</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        {renderOption('Change account email')}
        {renderOption('Change password')}
        {renderOption('Change phone number')}
        {renderOption('Verify phone number')}
        {renderOption('Change personal information')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        {renderOption('Manage access and devices')}
        {renderOption('Privacy and data settings')}
        {renderOption('Sign out of all devices')}
        {renderOption('Delete account')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other</Text>
        {renderOption('Delete history')}
        {renderOption('About & Legal')}
        {renderOption('Help & Feedback')}
      </View>
    </ScrollView>
    <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#111',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  memberText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 8,
  },
  section: {
    backgroundColor: '#111',
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default SettingsScreen;
