import { useState, useRef } from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from './NavigationBar'; 
import { Video } from 'expo-av';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MovieDetailsScreen({route, navigation }){
  const { item, mediaType } = route.params; 
  console.log('item',item)
  const scrollViewRef = useRef(null);
  const descriptionRef = useRef(null);
  const castCrewRef = useRef(null);
  const reviewsRef = useRef(null);
  const wheretoWatchRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    const y = sectionRef.current.offsetTop; 
    scrollViewRef.current.scrollTo({ x: 0, y, animated: true });
  };

  const [rating, setRating] = useState(0);

  const handlePress = (star) => {
    setRating(star);
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} ref={scrollViewRef}>

        <View style={styles.spotlightSection}>
          <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
              }}
              style={styles.spotlightImage}
            />
        </View>
        <View style={styles.movieInfoContainer}>
          <View style={styles.upperContentContianer}>
            <Text style={styles.boldFont}>{mediaType === 'movie'
            ? `${item.title}`
            : `${item.name}`}</Text>
            <Text style={styles.subDescription}>
              {mediaType === 'movie'
                ? `Released: ${item.release_date.replace(/-/g, '/')}`
                : `First Air Date: ${item.first_air_date.replace(/-/g, '/')}`}
            </Text>
            <View style={styles.genreContainer}>
              {item.genres.map((genre) => (
                <View key={genre.id} style={styles.genre}>
                  <Text>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.lowerContentContianer}>
            <Text style={styles.boldFont}>95%</Text>
            <Text style={{ marginBottom: 5 }}>
              matches with your preferences
            </Text>
            <Image
              source={require('../assets/IMDb_rating.png')}
              style={styles.ratingImage}
            />
            <TouchableOpacity style={styles.watchLaterButton}>
              <Text style={{ fontWeight: 'bold' }}>Watch Later</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rateContainer}>
          <Text>Watched it? Rate it below!</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handlePress(star)}>
                <Icon
                  name="star"
                  size={40}
                  color={star <= rating ? '#FFE6BC' : '#ECEAEA'}
                  style={styles.starStyle}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalButtonContainer}>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={() => scrollToSection(descriptionRef)}>
            <Text>Description</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={() => scrollToSection(castCrewRef)}>
            <Text>Cast & Crew</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={() => scrollToSection(wheretoWatchRef)}>
            <Text>Where to Watch</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.detailesContainer} ref={descriptionRef}>
          <Text style={styles.detailsTitle}>Description</Text>
          <Text>
            {item.overview}
          </Text>
        </View>

        <View style={styles.detailesContainer} ref={castCrewRef}>
          <Text style={styles.detailsTitle}>Cast & Crew</Text>
          <View style={styles.castCrewImageContainer}>
            <Image
              source={require('../assets/cast1.png')}
              style={styles.thumbnail}
            />
            <Image
              source={require('../assets/cast2.png')}
              style={styles.thumbnail}
            />
            <Image
              source={require('../assets/cast3.png')}
              style={styles.thumbnail}
            />
            <Image
              source={require('../assets/cast4.png')}
              style={styles.thumbnail}
            />
            <Image
              source={require('../assets/cast5.png')}
              style={styles.thumbnail}
            />
            <Image
              source={require('../assets/cast6.png')}
              style={styles.thumbnail}
            />
          </View>
        </View>

        <View style={styles.detailesContainer} ref={wheretoWatchRef}>
          <Text style={styles.detailsTitle}>Where to Watch</Text>
          <View style={styles.platformImageContainer}>
            <Image
              source={require('../assets/wheretowatch1.png')}
              style={styles.platformImage}
            />
            <Image
              source={require('../assets/wheretowatch2.png')}
              style={styles.platformImage}
            />
            <Image
              source={require('../assets/wheretowatch3.png')}
              style={styles.platformImage}
            />
            <Image
              source={require('../assets/wheretowatch4.png')}
              style={styles.platformImage}
            />
            <Image
              source={require('../assets/wheretowatch5.png')}
              style={styles.platformImage}
            />
            <Image
              source={require('../assets/wheretowatch6.png')}
              style={styles.platformImage}
            />
            <Image
              source={require('../assets/wheretowatch7.png')}
              style={styles.platformImage}
            />
          </View>
        </View>
      </ScrollView>
      <NavBar navigation={navigation}/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spotlightSection: {
    width: SCREEN_WIDTH,
    height: 200,
    marginBottom: 20,
  },
  spotlightImage: {
    width: "100%",
    height: "100%",
  },
  movieInfoContainer: {
    width: '90%',
    marginHorizontal: 'auto',
    marginVertical: 10,
    backgroundColor: '#ECEAEA',
    borderRadius: 5,
  },
  upperContentContianer: {
    width: '90%',
    marginHorizontal: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: '#ADA9A9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  boldFont: {
    fontWeight: 'bold',
  },
  subDescription: {},
  genreContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  genre: {
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginTop: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  lowerContentContianer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  ratingImage: {
    width: 70,
    height: 30,
    borderRadius: 5,
  },
  watchLaterButton: {
    marginTop: 5,
    backgroundColor: 'rgba(0, 174, 239, 0.55)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  horizontalButtonContainer: {
    width: '90%',
    marginHorizontal: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  horizontalButton: {
    backgroundColor: '#ECEAEA',
    marginHorizontal: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  rateContainer:{
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    paddingVertical: 20,
    width: '90%',
    marginHorizontal: 'auto',
  },
  detailesContainer: {
    borderTopColor: '#D9D9D9',
    borderTopWidth: 1,
    paddingVertical: 20,
    width: '90%',
    marginHorizontal: 'auto',
  },
  detailsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  castCrewImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: 4,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  starStyle: {
    width: 55,
  },
  platformImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  platformImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
});
