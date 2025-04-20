import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, ActivityIndicator, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { UserContext } from './UserContext';
import NavBar from './NavigationBar';
import {
  fetchMovieDetails, fetchTVDetails, fetchCastAndCrew, fetchMovieTrailer
} from '../api/api';
import Header from './Header';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MovieDetailsScreen({ route, navigation }) {
  const { item, mediaType } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [castCrew, setCastCrew] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const { userId } = useContext(UserContext);
  const [watchlistMessage, setWatchlistMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = mediaType === 'movie'
          ? await fetchMovieDetails(item.id)
          : await fetchTVDetails(item.id);
        setMovieDetails(details);

        const castData = await fetchCastAndCrew(item.id, mediaType);
        setCastCrew(castData.cast || []);

        const trailerData = await fetchMovieTrailer(item.id, mediaType);
        setTrailer(trailerData);
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
      <Header showBack={true} title="Movie Details" />
      <ScrollView>
        {/* Hero Image */}
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` }}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Info Section */}
        <View style={styles.contentWrapper}>
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

          {/* Trailer */}
          {Platform.OS === 'web' && trailer && (
            <>
              <Text style={styles.sectionTitle}>Official Trailer</Text>
              <View style={styles.trailerContainer}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube trailer"
                />
              </View>
            </>
          )}


          {/* Watchlist Button */}
          <TouchableOpacity style={styles.watchlistButton} onPress={handleAddToWatchlist}>
            <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>
          {watchlistMessage !== '' && (
            <Text style={styles.feedbackMessage}>{watchlistMessage}</Text>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Watched it? Rate it below!</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon name="star" size={30} color={star <= rating ? '#FFD700' : '#555'} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cast */}
        {castCrew.length > 0 && (
          <View style={styles.castContainer}>
            <Text style={styles.sectionTitle}>Top Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {castCrew.slice(0, 10).map(person => (
                person.profile_path && (
                  <View key={person.id} style={styles.castCard}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w185${person.profile_path}` }} style={styles.castImage} />
                    <Text style={styles.castName}>{person.name}</Text>
                    <Text style={styles.castRole}>{person.character}</Text>
                  </View>
                )
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.4,  alignSelf: 'center' },
  contentWrapper: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { color: '#ccc', fontSize: 14, marginBottom: 10 },
  description: { color: '#eee', fontSize: 14, marginBottom: 15 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  genreBadge: {
    backgroundColor: '#ff3c3c',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 12,
  },
  trailerContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: '#000'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 25,
    marginBottom: 10,
  },
  watchlistButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 15,
  },
  watchlistButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  feedbackMessage: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
  ratingSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  ratingTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  castContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  castScroll: {
    paddingRight: 20,
    flexDirection: 'row',
  },
  castCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  castName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  castRole: {
    color: '#aaa',
    fontSize: 11,
    textAlign: 'center',
  },
});
