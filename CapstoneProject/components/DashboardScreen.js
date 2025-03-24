import React, { useEffect, useState } from "react";
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
import { fetchUpcomingMovies, fetchTrendingMovies, fetchPopularTVShows, fetchMovieDetails, fetchTVDetails } from "../api/api";
import NavBar from "./NavigationBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const isWeb = Platform.OS === "web";
const ITEM_WIDTH = SCREEN_WIDTH / (isWeb ? 5 : 2.5);

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("John");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistTVShows, setWatchlistTVShows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcoming, trending, popularTV, watchlistResponse] = await Promise.all([
          fetchUpcomingMovies(),
          fetchTrendingMovies(),
          fetchPopularTVShows(),
          fetch('http://127.0.0.1:8000/watchlist/1', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        ]);

        setUpcomingMovies(upcoming.results || []);
        setTrendingMovies(trending.results || []);
        setPopularTVShows(popularTV.results || []);
        
        const watchlistData = await watchlistResponse.json();

        if (watchlistData.length > 0) {
          const moviePromises = watchlistData.filter(item => item.media_type === 'movie').map(async (item) => {
            return await fetchMovieDetails(item.movie_id);
          });

          const tvPromises = watchlistData.filter(item => item.media_type === 'tv').map(async (item) => {
            return await fetchTVDetails(item.movie_id); // You might want to change movie_id to tv_id based on your API response
          });

          const [watchlistMoviesData, watchlistTVShowsData] = await Promise.all([
            Promise.all(moviePromises),
            Promise.all(tvPromises),
          ]);

          setWatchlistMovies(watchlistMoviesData);
          setWatchlistTVShows(watchlistTVShowsData);
        } else {
          setWatchlistMovies([]);
          setWatchlistTVShows([]);
        }


      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchDetails = async (id, mediaType) => {
    try {
      let details;
      if (mediaType === "tv") {
        details = await fetchTVDetails(id);
        navigation.navigate("Details", { item: details, mediaType: "tv" });
      } else if (mediaType === "movie") {
        details = await fetchMovieDetails(id);
        navigation.navigate("Details", { item: details, mediaType: "movie" });
      }
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
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.posterImage}
                resizeMode="cover"
              />
              <Text style={styles.itemTitle}>{item.title || item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
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
            <View style={styles.heroContainer}>
              <Image
                source={{ uri: trendingMovies[0]?.backdrop_path ? `https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path}` : "https://via.placeholder.com/800x450" }}
                style={styles.heroImage}
              />
            </View>
            {renderSection("Trending Now", trendingMovies, "trending", "movie")}
            {renderSection("Upcoming Movies", upcomingMovies, "upcoming", "movie")}
            {renderSection("Popular TV Shows", popularTVShows, "popular", "tv")}
            {watchlistMovies.length > 0 && renderSection("Watchlist Movies", watchlistMovies, "watchlist", "movie")}
            {watchlistTVShows.length > 0 && renderSection("Watchlist TV Shows", watchlistTVShows, "watchlist", "tv")}

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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  itemContainer: {
    marginHorizontal: 5,
    alignItems: "center",
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  itemTitle: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
  },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 400,
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
});

export default DashboardScreen;
