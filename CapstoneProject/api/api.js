const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '7abc5bd92ca1378c3ffb875e88befda7'; // Replace with your actual API key

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
// Fetch movies by genre
export const fetchMoviesByGenre = async (genreId) => {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
  return await fetchData(url);
};

// Fetch TV shows by genre
export const fetchTVShowsByGenre = async (genreId) => {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`;
  return await fetchData(url);
};

// Fetch genres (if you want to dynamically generate this list)
export const fetchGenres = async () => {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  return await fetchData(url);
};
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return await response.json();
};

export const fetchUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  return handleResponse(response);
};

export const fetchTrendingMovies = async () => {
  const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  return handleResponse(response);
};

export const fetchPopularTVShows = async () => {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  return handleResponse(response);
};
export const fetchMovieDetails = async (movieId) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  return handleResponse(response);
};

export const fetchTVDetails = async (tvId) => {
  const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`);
  return handleResponse(response);
};


export const fetchSearchResults = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return handleResponse(response);
};
// Fetch Cast & Crew
export const fetchCastAndCrew = async (id, mediaType) => {
  const url = `${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}`;
  return await fetchData(url);
};

// Fetch Where to Watch (Streaming Providers)
export const fetchWatchProviders = async (id, mediaType) => {
  const url = `${BASE_URL}/${mediaType}/${id}/watch/providers?api_key=${API_KEY}`;
  return await fetchData(url);
};
export const fetchMovieTrailer = async (id, mediaType) => {
  const url = `${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.find(video => video.type === "Trailer" && video.site === "YouTube") || null;
};
