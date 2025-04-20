import React, { useEffect, useState, useContext } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import {
  fetchUpcomingMovies,
  fetchTrendingMovies,
  fetchPopularTVShows,
  fetchMovieDetails,
  fetchTVDetails,
} from "../api/api";
import NavBar from "./NavigationBar";
import axios from "axios";
import { getRecommendations } from "../api/recommend";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import Header from './Header';

const SCREEN_WIDTH = Dimensions.get("window").width;
const isWeb = Platform.OS === "web";
const ITEM_WIDTH = SCREEN_WIDTH / (isWeb ? 8 : 2.7);

const DashboardScreen = ({ navigation }) => {
  const { userId, likedMovies } = useContext(UserContext);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [watchlistMovie, setWatchlistMovie] = useState([]);
  const [watchlistTV, setWatchlistTV] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcoming, trending, popularTV, watchlistResponse] =
          await Promise.all([
            fetchUpcomingMovies(),
            fetchTrendingMovies(),
            fetchPopularTVShows(),
            axios.get(`http://127.0.0.1:8000/watchlist/${userId}`),
          ]);

        setUpcomingMovies(upcoming.results || []);
        setTrendingMovies(trending.results || []);
        setPopularTVShows(popularTV.results || []);

        const watchlistData = watchlistResponse.data;
        const movies = watchlistData.filter((item) => item.media_type === "movie");
        const tvShows = watchlistData.filter((item) => item.media_type === "tv");

        setWatchlistMovie(movies);
        setWatchlistTV(tvShows);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      }
    };

    const fetchRecommendations = async () => {
      try {
        if (likedMovies && likedMovies.length >= 5) {
          const data = await getRecommendations(likedMovies);
          const recommendedIds = [...new Set(Object.values(data).flat())];
          const recommendedMovies = await Promise.all(
            recommendedIds.map((id) => fetchMovieDetails(id))
          );
          setRecommendations(recommendedMovies);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };

    const runAll = async () => {
      setLoading(true);
      await fetchData();
      await fetchRecommendations();
      setLoading(false);
    };

    runAll();
  }, [userId]);

  const fetchDetails = async (id, mediaType) => {
    try {
      const details =
        mediaType === "tv"
          ? await fetchTVDetails(id)
          : await fetchMovieDetails(id);
      navigation.navigate("Details", { item: details, mediaType });
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const renderSection = (title, data, keyPrefix, mediaType) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => `${keyPrefix}-${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchDetails(item.id, mediaType)}>
            <View style={styles.itemContainer}>
              <Image
                source={{
                  uri: item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placeholder.com/120x180?text=No+Image",
                }}
                style={styles.posterImage}
                resizeMode="cover"
              />
              <Text numberOfLines={1} style={styles.itemTitle}>
                {item.title || item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderWatchlist = (title, data) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => fetchDetails(item.movie_id, item.mediaType)}
          >
            <View style={styles.itemContainer}>
              <Image
                source={{
                  uri: item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placeholder.com/120x180?text=No+Image",
                }}
                style={styles.posterImage}
                resizeMode="cover"
              />
              <Text numberOfLines={1} style={styles.itemTitle}>
                {item.movie_title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const combinedWatchlist = [
    ...watchlistMovie.map((item) => ({ ...item, mediaType: "movie" })),
    ...watchlistTV.map((item) => ({ ...item, mediaType: "tv" })),
  ];

  return (
    <View style={styles.container}>
      <Header title="PandashBoard" />
      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => fetchDetails(trendingMovies[0].id, "movie")}
              style={styles.heroContainer}
            >
              <Image
                source={{
                  uri: trendingMovies[0]?.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path}`
                    : "https://via.placeholder.com/800x450",
                }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{trendingMovies[0]?.title || "Featured Movie"}</Text>
                <Text style={styles.heroGenres}>Trending Now</Text>
              </View>
            </TouchableOpacity>

            {recommendations.length > 0 &&
              renderSection("Recommended For You", recommendations, "recommend", "movie")}
            {renderSection("Trending Now", trendingMovies, "trending", "movie")}
            {renderSection("Upcoming Movies", upcomingMovies, "upcoming", "movie")}
            {renderSection("Popular TV Shows", popularTVShows, "popular", "tv")}
            {combinedWatchlist.length > 0 &&
              renderWatchlist("Your Watchlist", combinedWatchlist)}
          </>
        )}
      </ScrollView>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  heroContainer: {
    width: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: isWeb ? SCREEN_WIDTH * 0.35 : SCREEN_WIDTH * 0.55,
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 3,
  },
  heroGenres: {
    fontSize: 14,
    color: "#ccc",
  },
  sectionContainer: {
    marginBottom: 30,
    paddingLeft: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginRight: 12,
    alignItems: "center",
    width: ITEM_WIDTH,
  },
  posterImage: {
    width: "100%",
    height: ITEM_WIDTH * 1.45,
    borderRadius: 8,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default DashboardScreen;
