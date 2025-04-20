import { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, ActivityIndicator, Platform, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { UserContext } from './UserContext';
import NavBar from './NavigationBar';
import {
  fetchMovieDetails, fetchTVDetails, fetchCastAndCrew
} from '../api/api';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MovieDetailsScreen({ route, navigation }) {
  const { item, mediaType } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [castCrew, setCastCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const { userId } = useContext(UserContext);
  const [watchlistMessage, setWatchlistMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    window.scrollTo(0, 0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = mediaType === 'movie'
          ? await fetchMovieDetails(item.id)
          : await fetchTVDetails(item.id);
        setMovieDetails(details);

        const castData = await fetchCastAndCrew(item.id, mediaType);
        setCastCrew(castData.cast || []);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [item.id, mediaType]);

  const handleAddToWatchlist = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/add-to-watchlist/', {
        user_id: userId,
        movie_id: item.id,
        movie_title: item.name || item.title,
        poster_path: item.poster_path,
        media_type: mediaType,
      });

      if (response.status === 201) {
        setWatchlistMessage('✅ Movie added to watchlist!');
      } else if (response.status === 200) {
        setWatchlistMessage('ℹ️ Movie is already in the watchlist.');
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setWatchlistMessage('❌ Failed to add movie to watchlist.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` }}
            style={[styles.spotlightImage, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movieDetails.title || movieDetails.name}</Text>
          <Text style={styles.subtitle}>
            {movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A'} · {movieDetails.genres.map(g => g.name).join(', ')}
          </Text>
          <Text style={styles.description}>{movieDetails.overview || 'No description available.'}</Text>

          <View style={styles.genreRow}>
            {movieDetails.genres.map(genre => (
              <Text key={genre.id} style={styles.genreBadge}>{genre.name}</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.watchlistButton} onPress={handleAddToWatchlist}>
            <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>

          {watchlistMessage !== '' && (
            <Text style={styles.feedbackMessage}>{watchlistMessage}</Text>
          )}

          {castCrew.length > 0 && (
            <View style={styles.castContainer}>
              <Text style={styles.detailsTitle}>Top Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
                {castCrew.map(person =>
                  person.profile_path && (
                    <View key={person.id} style={styles.castCard}>
                      <Image source={{ uri: `https://image.tmdb.org/t/p/w185${person.profile_path}` }} style={styles.castImage} />
                      <Text style={styles.castName}>{person.name}</Text>
                      <Text style={styles.castRole}>{person.character}</Text>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Watched it? Rate it below!</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon name="star" size={36} color={star <= rating ? '#FFD700' : '#555'} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  spotlightImage: { width: '100%', height: '100%' },
  infoContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5, textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  subtitle: { color: '#ccc', fontSize: 14, marginBottom: 10 },
  description: { color: '#eee', fontSize: 14, marginBottom: 15 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 },
  genreBadge: { backgroundColor: '#ff3c3c', color: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6, marginBottom: 6, fontSize: 12 },
  watchlistButton: { backgroundColor: '#FFD700', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, width: '100%', alignItems: 'center' },
  watchlistButtonText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  feedbackMessage: { marginTop: 8, color: '#fff', textAlign: 'center', fontSize: 14 },
  ratingSection: { alignItems: 'center', marginVertical: 20, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 20 },
  ratingTitle: { color: '#fff', fontSize: 16, marginBottom: 10 },
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  castContainer: { paddingTop: 20 },
  detailsTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 10 },
  castScroll: { paddingRight: 20, paddingLeft: 5 },
  castCard: { alignItems: 'center', marginRight: 15, width: 100 },
  castImage: { width: 80, height: 80, borderRadius: 40 },
  castName: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 5, textAlign: 'center' },
  castRole: { color: '#aaa', fontSize: 11, textAlign: 'center' },
});
