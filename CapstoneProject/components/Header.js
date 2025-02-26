import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Header = () => {
    return (
      <>
        <View style={styles.header}>
          
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
        </View>
      </>
    );
  };

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: 'white',
    justifyContent: 'space-between',  
    alignItems: 'center',      
    flexDirection: 'row',
  },
  logo: {
    marginLeft: 'auto',           
    marginRight: 'auto',
    width: 50, 
    height: 50
  }
});