import { useState, useEffect, useContext } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, ActivityIndicator, Modal, FlatList, Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { UserContext } from './UserContext';
import NavBar from './NavigationBar';
import {
  fetchMovieDetails, fetchTVDetails, fetchCastAndCrew
} from '../api/api';
import Header from './Header';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MovieDetailsScreen({ route, navigation }) {
  const { item, mediaType } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [castCrew, setCastCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const { userId } = useContext(UserContext);
  const [watchlistMessage, setWatchlistMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
        setWatchlistMessage('✅ Added to watchlist');
      } else if (response.status === 200) {
        setWatchlistMessage('ℹ️ Already in your watchlist');
      }
    } catch (error) {
      setWatchlistMessage('❌ Could not add movie');
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
      <Header showBack={true} title="Details" />
      <ScrollView>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{movieDetails.title || movieDetails.name}</Text>
          <Text style={styles.subtitle}>
            {movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A'} · {movieDetails.genres.map(g => g.name).join(', ')}
          </Text>

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

          <Text style={styles.ratingLabel}>Watched it? Rate it below!</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon name="star" size={30} color={star <= rating ? '#FFD700' : '#555'} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{movieDetails.overview || 'No description available.'}</Text>

          {castCrew.length > 0 && (
            <View style={styles.castContainer}>
              <Text style={styles.detailsTitle}>Top Cast</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castScroll}
              >
                {castCrew.slice(0, 10).map((person) => (
                  person.profile_path && (
                    <View key={person.id} style={styles.castCard}>
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w185${person.profile_path}` }}
                        style={styles.castImage}
                      />
                      <Text style={styles.castName}>{person.name}</Text>
                      <Text style={styles.castRole}>{person.character}</Text>
                    </View>
                  )
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.toggleCastText}>View All Cast</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Full Cast</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={castCrew}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              item.profile_path && (
                <View style={styles.modalCastItem}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
                    style={styles.modalCastImage}
                  />
                  <View style={styles.modalCastInfo}>
                    <Text style={styles.castName}>{item.name}</Text>
                    <Text style={styles.castRole}>{item.character}</Text>
                  </View>
                </View>
              )
            )}
          />
        </View>
      </Modal>

      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: SCREEN_WIDTH * 9 / 16 },
  contentWrapper: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5, textAlign: 'center' },
  subtitle: { color: '#ccc', fontSize: 14, marginBottom: 10, textAlign: 'center' },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 },
  genreBadge: { backgroundColor: '#ff3c3c', color: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, marginHorizontal: 4, marginBottom: 6, fontSize: 12 },
  watchlistButton: { backgroundColor: '#FFD700', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginVertical: 10 },
  watchlistButtonText: { fontWeight: 'bold', fontSize: 14, color: '#000' },
  feedbackMessage: { color: '#fff', marginTop: 8, fontSize: 13 },
  ratingLabel: { color: '#ccc', fontSize: 14, marginTop: 20, marginBottom: 10 },
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 25, marginBottom: 10 },
  description: { color: '#ccc', fontSize: 14, textAlign: 'center', paddingHorizontal: 10 },
  castContainer: { marginTop: 25, marginBottom: 30 },
  detailsTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15, alignSelf: 'center' },
  castScroll: { flexDirection: 'row', paddingLeft: 10, paddingRight: 10 },
  castCard: { alignItems: "center", marginRight: 15, width: 90 },
  castImage: { width: 70, height: 70, borderRadius: 35 },
  castName: { color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 5, textAlign: "center" },
  castRole: { color: "#aaa", fontSize: 11, textAlign: "center" },
  toggleCastText: { color: '#1e90ff', fontSize: 14, textAlign: 'center', marginTop: 10, marginBottom: 10, textDecorationLine: 'underline' },

  modalContainer: { flex: 1, backgroundColor: '#000', paddingTop: 40, paddingHorizontal: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  modalClose: { color: '#fff', fontSize: 24, fontWeight: 'bold', paddingHorizontal: 10 },
  modalCastItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  modalCastImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  modalCastInfo: { flex: 1 },
});
