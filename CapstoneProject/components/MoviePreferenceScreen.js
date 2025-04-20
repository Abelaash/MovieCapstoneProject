import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext'
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
import { Dimensions } from 'react-native';

export default function MoviePreferenceScreen({ route, navigation }) {
  const { formData } = route.params;
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, setUserId } = useContext(UserContext);
  const { likedMovies, setLikedMovies } = useContext(UserContext);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  // Fetch movies based on genre
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMoviesByGenre(formData.genreId);
        setMovies(data.results || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [formData.genreId]);

  useEffect(() => {
    const handleResize = () => {
      const { width } = Dimensions.get('window');
      setScreenWidth(width);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription?.remove?.(); // Cleanup listener
    };
  }, []);

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

  const cardWidth = screenWidth > 600 ? screenWidth / 4 - 30 : screenWidth / 2 - 30;

  // Render each movie as a selectable card
  const renderMovie = ({ item }) => {
    const isSelected = selectedMovies.some((movie) => movie.id === item.id);
    return (
      <TouchableOpacity
        style={[
          styles.movieCard,
          { width: cardWidth },
          isSelected && styles.selectedCard,
        ]}
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

  const handleSubmit = async () => {
    if (selectedMovies.length < 5) {
      Alert.alert(
        'Selection Incomplete',
        'Please select at least 5 movies before generating recommendations.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const likedMovieIds = selectedMovies.map((movie) => movie.id);
      const updatedFormData = {
        ...formData,
        likedMovieIds: likedMovieIds,
      };

      console.log(updatedFormData);

      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        // 🔥 Show the actual error message from Django
        throw new Error(result.error || 'Failed to submit preferences');
      }

      console.log('Preferences submitted successfully:', result);

      console.log('user id', result.user.user_id);

      setUserId(result.user.user_id);
      setLikedMovies(result.user.liked_movie_ids)

      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 200);

      // navigation.navigate('Dashboard', { user_id: result.user.user_id });

    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    }
  };

  // useEffect(() => {

  //   if (userId) {
  //     console.log('User ID changed to:', userId);
  //     navigation.navigate('Dashboard');
  //   }
  // }, [userId]);


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          color="red"
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
        onPress={handleSubmit}
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
    backgroundColor: '#000',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#1a1a1a',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
    textAlign: 'center',
    flex: 1, 
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieCard: {
    width: 280,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1a1a1a', 
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: '#ff0000',
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
    color: '#fff'
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
    backgroundColor: '#ff0000', 
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
