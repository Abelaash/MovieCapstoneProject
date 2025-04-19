import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import NavBar from './NavigationBar'; 
import { fetchSearchResults } from '../api/api';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
  if (!query.trim()) return;
  setLoading(true); // Start loading indicator
  try {
    const searchResults = await fetchSearchResults(query.trim());
    setLoading(false); // Stop loading indicator
    navigation.navigate('SearchResult', { searchResults, searchQuery: query.trim() });
  } catch (error) {
    console.error('Error fetching search results:', error);
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for movies or TV shows..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}  // Trigger search when the user hits Enter
      />
    </View>
    <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  }
});
