import React, { useState } from 'react';
import Header from './Header.js';
import NavBar from './NavigationBar'; 
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { fetchMovieDetails } from '../api/api';
import {fetchTVDetails} from '../api/api';

 
const renderCard = (item, index, totalItems, navigation) => {
  const fetchDetails = async (id, mediaType) => {
    console.log('Key Extractor ID:', id);

    try {
      let details;
      if (mediaType === 'tv') {
        details = await fetchTVDetails(id); // Fetch TV detail
        console.log('TV Details:', details);
        navigation.navigate('Details', { item: details, mediaType: 'tv'  });
      } else if (mediaType === 'movie') {
        details = await fetchMovieDetails(id); // Fetch Movie details
        console.log('Movie Details:', details);
        navigation.navigate('Details', { item: details, mediaType: 'movie'  });
      } else {
        console.error('Unknown media type:', mediaType);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        index === totalItems - 1 && { borderBottomWidth: 0 },
      ]}
      onPress={() => fetchDetails(item.id, item.media_type)} // Fetch details on clic
    >
      
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.thumbnail}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>
          {item.media_type === 'movie'
            ? `${item.title} (${item.release_date.substring(0, 4)})`
            : `${item.name} (${item.first_air_date.substring(0, 4)})`}
        </Text>
        
      </View>
    </TouchableOpacity>
  );
};


export default function SearchResultScreen({ route, navigation }){
  const [visibleCount, setVisibleCount] = useState(5);
  const { searchResults, searchQuery } = route.params;
  const [filter, setFilter] = useState('All');

  const showMore = () => {
    setVisibleCount(visibleCount + 5);
  };

  const filteredResults = (type) => {
    if (type === 'Movies')
      return searchResults.results.filter(
        (item) => item.media_type === 'movie'
      );
    if (type === 'TVShows')
      return searchResults.results.filter((item) => item.media_type === 'tv');
    return searchResults.results;
  };


  const getMoviesCount = () => filteredResults('Movies').length;
  const getTVShowsCount = () => filteredResults('TVShows').length;
  const getAllCount = () => getMoviesCount() + getTVShowsCount();


  return (
    <View style={{ flex: 1 }}>
      <Header showBack={true} title="Search Result" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}>


        <View style={styles.results}>
          <Text style={[styles.searchResult, { color: 'white' }]}>
            Search Results for: {searchQuery}
          </Text>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'All' && styles.activeFilter,
              ]}
              onPress={() => setFilter('All')}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'All' && styles.activeFilterText,
                ]}>
                All ({getAllCount()})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'Movies' && styles.activeFilter,
              ]}
              onPress={() => setFilter('Movies')}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'Movies' && styles.activeFilterText,
                ]}>
                Movies ({getMoviesCount()})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'TVShows' && styles.activeFilter,
              ]}
              onPress={() => setFilter('TVShows')}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'TVShows' && styles.activeFilterText,
                ]}>
                TV Shows ({getTVShowsCount()})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display Results Based on Filter */}
          {(filter === 'All' || filter === 'Movies') && (
            <View>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.verticalLine} />
                <Text style={styles.sectionTitle}>Movies</Text>
              </View>
              <FlatList
                data={filteredResults('Movies').slice(0, visibleCount)}
                renderItem={({ item, index }) =>
                  renderCard(
                    item,
                    index,
                    filteredResults('Movies').length,
                    navigation
                  )
                }
                keyExtractor={(item) => item.id}
                horizontal={false}
              />
              {filteredResults('Movies').length > 5 &&
                filteredResults('Movies').length > visibleCount && (
                  <View style={styles.moreButtonContainer}>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={showMore}>
                      <Text style={styles.moreButtonText}>More Movies</Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          )}
          {(filter === 'All' || filter === 'TVShows') && (
            <View>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.verticalLine} />
                <Text style={styles.sectionTitle}>TV Shows</Text>
              </View>
              <FlatList
                data={filteredResults('TVShows').slice(0, visibleCount)}
                renderItem={({ item, index }) =>
                  renderCard(
                    item,
                    index,
                    filteredResults('TVShows').length,
                    navigation
                  )
                }
                keyExtractor={(item) => item.id.toString()}
                horizontal={false}
              />
              {filteredResults('TVShows').length > 5 &&
                filteredResults('TVShows').length > visibleCount && (
                  <View style={styles.moreButtonContainer}>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={showMore}>
                      <Text style={styles.moreButtonText}>More TV Shows</Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          )}
        </View>
      </ScrollView>
       <NavBar navigation={navigation} />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
  },
  results: {
    padding: 16,
    color:'white',
  },
  searchResult: {},
  sectionTitleContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    color:'white',
  },
  verticalLine: {
    width: 1.5,
    height: 24,
    backgroundColor: '#FA1010',
    marginRight: 5,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    position: 'absolute',
    fontWeight: 'bold',
    left: 8,
    top: 0.1,
    marginBottom: 8,
    color:'white',
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: 'rgb(0, 175, 239)',
  },
  filterText: {
    color: '#000',
  },
  activeFilterText: {
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  thumbnail: {
    width: 70,
    height: 100,
    borderRadius: 4,
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  match: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  matchText: {
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'white',
  },
  moreButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  moreButton: {
    marginVertical: 2,
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRadius: 15,
    backgroundColor: 'rgb(0, 175, 239)',
    width: 100,
    justifyContent: 'right',
  },
  moreButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    color:'white',
  },
});
