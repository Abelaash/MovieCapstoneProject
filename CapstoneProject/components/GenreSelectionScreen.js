import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
  } from 'react-native';
  
  const genres = [
    {
      id: '35',
      name: 'Comedy',
      image:
        'https://www.usmagazine.com/wp-content/uploads/2021/09/The-Hangover-Cast-Where-Are-They-Now-Feature.jpg?quality=40&strip=all',
    },
    {
      id: '28',
      name: 'Action',
      image:
        'https://www.themanual.com/wp-content/uploads/sites/9/2021/07/watch-the-tomorrow-war-online.jpeg?resize=1000%2C600&p=1',
    },
    {
      id: '53',
      name: 'Thriller',
      image:
        'https://images.nightcafe.studio/jobs/EqhqlkrTqIgmOGQk3LU7/EqhqlkrTqIgmOGQk3LU7--1--yzwc2.jpg?tr=w-1600,c-at_max',
    },
    {
      id: '878',
      name: 'Sci-Fi',
      image:
        'https://lumiere-a.akamaihd.net/v1/images/hb_disneyplus_skywalkersaga_mobile_19267_e964ed2c.jpeg?region=0,0,640,400',
    },
    {
      id: '10749',
      name: 'Romance',
      image:
        'https://i.cbc.ca/1.6690550.1671412533!/fileImage/httpImage/image.jpg_gen/derivatives/original_780/titanic.jpg',
    },
    {
      id: '27',
      name: 'Horror',
      image:
        'https://m.media-amazon.com/images/M/MV5BNDRjZmZhZTEtMzdlYi00MmE0LTgyZGMtZDc5ZWI0MjcxZTliXkEyXkFqcGc@._V1_.jpg',
    },
    {
      id: '99',
      name: 'Documentary',
      image:
        'https://m.media-amazon.com/images/M/MV5BNWY1ZTZiNWEtZDViYS00ZDVhLWI4NDEtZDgwNWZhZWRhMTgzXkEyXkFqcGc@._V1_.jpg',
    },
    {
      id: '80',
      name: 'Crime',
      image:
        'https://static1.srcdn.com/wordpress/wp-content/uploads/2019/08/Sherlock-Holmes.jpg',
    },
  ];
  
  export default function GenreSelectionScreen({ navigation }) {
    // Navigate to MoviePreferenceScreen with genreId
    const handleGenreSelect = (genreId) => {
      navigation.navigate('MoviePreference', { genreId });
    };
  
    const renderGenre = ({ item }) => (
      <TouchableOpacity
        style={styles.genreContainer}
        onPress={() => handleGenreSelect(item.id)} // Pass the genreId
      >
        <Image source={{ uri: item.image }} style={styles.genreImage} />
        <Text style={styles.genreText}>{item.name}</Text>
      </TouchableOpacity>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick your favorite genre!</Text>
        </View>
  
        <FlatList
          data={genres}
          renderItem={renderGenre}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF8E1',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: StatusBar.currentHeight,
    },
    header: {
      width: '100%',
      backgroundColor: '#FFE0B2',
      paddingVertical: 30,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    flatListContent: {
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
    },
    genreContainer: {
      alignItems: 'center',
      margin: 10,
      width: 120,
    },
    genreImage: {
      width: 100,
      height: 100,
      borderRadius: 60,
      marginBottom: 10,
      backgroundColor: '#ccc',
    },
    genreText: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
  