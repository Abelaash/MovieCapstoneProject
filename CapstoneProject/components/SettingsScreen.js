// SettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const renderOption = (text) => (
    <TouchableOpacity style={styles.option}>
      <Text style={styles.optionText}>{text}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="#333" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Settings</Text>
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F6E5C9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  memberText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  section: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
    color: '#333',
  },
});

export default SettingsScreen;
