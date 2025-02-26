import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { fetchMoviesByGenre } from "../api/api";

const CategoryScreen = ({ route, navigation }) => {
  const { genreId, genreName } = route.params;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchMoviesByGenre(genreId);
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
      }
    };

    fetchMovies();
  }, [genreId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{genreName}</Text>
      <ScrollView>
        {movies.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            onPress={() => navigation.navigate("Details", { movie })}
          >
            <View style={styles.movieContainer}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                style={styles.posterImage}
              />
              <Text style={styles.movieTitle}>{movie.title || movie.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff", margin: 15 },
  movieContainer: { margin: 10, alignItems: "center" },
  posterImage: { width: 120, height: 180, borderRadius: 8, marginBottom: 5 },
  movieTitle: { color: "#fff", fontSize: 14, textAlign: "center" },
});

export default CategoryScreen;
