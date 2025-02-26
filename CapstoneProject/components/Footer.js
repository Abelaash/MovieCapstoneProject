import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';
  
  
  const Footer = () => {
      return (
        <>
          <View style={styles.footer}>
            <Text style={styles.footerText}>© Panda Picks. All rights reserved.</Text>
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress>
                <Text style={styles.linkText}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      );
    };
  
  export default Footer;
  
  const styles = StyleSheet.create({
    footer: {
      padding: 16,
      paddingBottom: 25,
      borderTopWidth: 1,
      borderTopColor: '#FFE6BC',
      backgroundColor: '#FFE6BC',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#555',
      textAlign: 'center',
    },
    linksContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    linkText: {
      color: '#555',
      fontSize: 12,
      paddingHorizontal: 5,
    }
  });