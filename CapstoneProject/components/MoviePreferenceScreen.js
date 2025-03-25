import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { fetchMoviesByGenre } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function MoviePreferenceScreen({ route, navigation }) {
  const { genreId } = route.params; // Get the genreId passed from the previous screen
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies based on genre
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMoviesByGenre(genreId);
        setMovies(data.results || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [genreId]);

  // Handle movie selection
  const handleMovieSelect = (movie) => {
    const isSelected = selectedMovies.some((item) => item.id === movie.id);
    if (isSelected) {
      // Deselect the movie
      setSelectedMovies(selectedMovies.filter((item) => item.id !== movie.id));
    } else {
      // Select the movie
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  // Render each movie as a selectable card
  const renderMovie = ({ item }) => {
    const isSelected = selectedMovies.some((movie) => movie.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.movieCard, isSelected && styles.selectedCard]}
        onPress={() => handleMovieSelect(item)}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.movieImage}
        />
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>
          Select at least 5 movies you like!
        </Text>
      </View>

      {/* Movie List */}
      {loading ? (
        <ActivityIndicator size="large" color="#87CEEB" />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      <TouchableOpacity
        style={[
          styles.recommendationButton,
          selectedMovies.length >= 5 ? {} : { opacity: 0.6 }, // Button enabled only when at least 5 movies are selected
        ]}
        onPress={() => {
          if (selectedMovies.length < 5) {
            Alert.alert(
              'Selection Incomplete',
              'Please select at least 5 movies before generating recommendations.',
              [{ text: 'OK' }]
            );
          } else {
            const likedMovieIds = selectedMovies.map(movie => movie.id);
            navigation.navigate('Dashboard', { likedMovieIds });
          }
        }}
        disabled={selectedMovies.length < 5} // Disable button if less than 5 movies are selected
      >
        <Text style={styles.recommendationButtonText}>
          Generate Recommendations
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row', // Align children horizontally (row direction)
    alignItems: 'center', // Vertically center the items
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFE0B2',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1, // Optional: ensures the text takes available space (can be useful for larger headers)
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  movieCard: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    width: 150,
  },
  selectedCard: {
    borderColor: '#87CEEB',
    borderWidth: 2,
  },
  movieImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // buttonContainer: {
  //   flex: 1,
  //   justifyContent: 'flex-end', // Position the button towards the bottom
  //   marginBottom: 40, // Adds space between the button and bottom edge
  //   paddingHorizontal: 15,
  // },
  // backButton: {
  //   height: 40,
  //   backgroundColor: '#D3D3D3',
  //   borderRadius: 25,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '25%',
  // },
  // backButtonText: {
  //   color: '#333',
  //   fontSize: 30,
  //   fontWeight: 'bold',
  // },
  recommendationButton: {
    height: 50,
    backgroundColor: '#87CEEB',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  recommendationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
