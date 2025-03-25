import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchMovieDetails, fetchTVDetails, fetchCastAndCrew, fetchWatchProviders, fetchMovieTrailer, fetchMovieReviews, fetchSimilarMovies } from '../api/api';
const SCREEN_WIDTH = Dimensions.get('window').width;
import axios from 'axios';
import NavBar from './NavigationBar'; 

export default function MovieDetailsScreen({ route, navigation }) {
  const { item, mediaType } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [castCrew, setCastCrew] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = mediaType === 'movie' 
          ? await fetchMovieDetails(item.id) 
          : await fetchTVDetails(item.id);
        setMovieDetails(details);
        
        const castData = await fetchCastAndCrew(item.id, mediaType);
        setCastCrew(castData.cast || []);
        
        const watchData = await fetchWatchProviders(item.id, mediaType);
        const countryCode = 'US'; 
        const providers = watchData.results?.[countryCode]?.flatrate || [];
        setWatchProviders(providers);
        
        const trailerData = await fetchMovieTrailer(item.id, mediaType);
        setTrailer(trailerData);
        
        const reviewData = await fetchMovieReviews(item.id, mediaType);
        setReviews(reviewData);
        
        const similarData = await fetchSimilarMovies(item.id, mediaType);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [item.id, mediaType]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  const handleAddToWatchlist = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/add-to-watchlist/', {
            user_id: 1, 
            movie_id: item.id,
            movie_title: item.name || item.title,
            poster_path: item.poster_path,
            media_type: mediaType,
        }, {
            headers: {
                // 'Authorization': `Bearer YOUR_ACCESS_TOKEN`, 
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            Alert.alert("Success", "Movie added to watchlist!");
        } else if (response.status === 200) {
            Alert.alert("Info", "Movie is already in the watchlist.");
        }
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        Alert.alert("Error", "Failed to add movie to watchlist.");
    }
};


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` }} style={styles.spotlightImage} />
      
      {trailer && Platform.OS !== 'web' ? (
        <View style={styles.trailerContainer}>
          <WebView style={styles.trailer} source={{ uri: `https://www.youtube.com/embed/${trailer.key}` }} />
        </View>
      ) : Platform.OS === 'web' && trailer ? (
        <TouchableOpacity onPress={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}>
          <Text style={styles.webWarning}>Watch the trailer on YouTube</Text>
        </TouchableOpacity>
      ) : null}
      
      <View style={styles.movieInfoContainer}>
        <Text style={styles.title}>{movieDetails.title || movieDetails.name}</Text>
        <View style={styles.genreContainer}>
          {movieDetails.genres.map(genre => (
            <View key={genre.id} style={styles.genre}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.watchlistButton} onPress={handleAddToWatchlist}>
          <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rateContainer}>
        <Text style={styles.ratingTitle}>Watched it? Rate it below!</Text>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Icon name="star" size={40} color={star <= rating ? '#FFD700' : '#D3D3D3'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Description</Text>
        <Text style={styles.descriptionText}>{movieDetails.overview}</Text>
      </View>
      
      {castCrew.length > 0 && (
        <View style={styles.castContainer}>
          <Text style={styles.detailsTitle}>Top Cast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {castCrew.map((person) => (
              person.profile_path && (
                <View key={person.id} style={styles.castCrewItem}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w185${person.profile_path}` }} style={styles.castImage} />
                  <Text style={styles.castName}>{person.name}</Text>
                  <Text style={styles.characterName}>{person.character}</Text>
                </View>
              )
            ))}
          </ScrollView>

        </View>
      )}
      
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  spotlightImage: { width: SCREEN_WIDTH, height: 250 },
  movieInfoContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  genreContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  genre: { backgroundColor: '#FF6347', padding: 5, margin: 5, borderRadius: 5 },
  genreText: { color: '#FFFFFF' },
  watchlistButton: { backgroundColor: '#FFD700', padding: 10, borderRadius: 5, marginTop: 10 },
  watchlistButtonText: { fontWeight: 'bold', color: '#000' },
  rateContainer: { alignItems: 'center', marginVertical: 20 },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  detailsContainer: { padding: 20 },
  detailsTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  descriptionText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
  castContainer: { padding: 20 },
  castCrewItem: { alignItems: 'center', marginRight: 15 },
  castImage: { width: 80, height: 80, borderRadius: 40 },
  castName: { color: '#FFFFFF', fontWeight: 'bold', marginTop: 5 },
  characterName: { color: '#A9A9A9' }
});