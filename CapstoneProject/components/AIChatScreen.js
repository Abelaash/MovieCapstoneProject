import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import NavBar from "./NavigationBar";
import Header from './Header';


const AIChatScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const BACKEND_URL = "http://127.0.0.1:8000/chatbot/"; 

  const genres = [
    'Action',
    'Adventures',
    'Animation',
    'Mystery',
    'Biography',
    'Comedy',
    'Crime',
    'Fantasy',
    'Horror',
    'Romance',
  ];

  const handleSend = async () => {
    if (input.trim() === '') return;
    const newMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

      try {
        const response = await fetch(BACKEND_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
      
        const data = await response.json();
        const aiResponse = { type: 'ai', text: data.reply || "Sorry, I couldn't understand that." };
        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
          const aiResponse = { type: 'ai', text: "There was an error talking to Panda AI." };
          setMessages((prev) => [...prev, aiResponse]);
      } finally {
          setIsLoading(false);
      }
  };

  const handlePromptClick = async (genre) => {
    const prompt = `Can you recommend some good ${genre} movies?`;
    const newMessage = { type: 'user', text: prompt };
    setMessages([...messages, newMessage]);
    setIsLoading(true); // start loading

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
  
      const data = await response.json();
      const aiResponse = {
        type: 'ai',
        text: data.reply || "Sorry, I couldn't find recommendations.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const aiResponse = {
        type: 'ai',
        text: "There was an error retrieving movie recommendations.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.aiMessage,
      ]}>
      {item.type === 'ai' ? (
          <Markdown>{item.text}</Markdown>
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header showBack={true} title="Panda AI" />
      <Text style={styles.header1}>
        Can’t remember that movie? Need a show suggestion? Ask Panda AI
        anything, and let's roll the credits!
      </Text>
      <View style={styles.promptContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={styles.promptButton}
            onPress={() => handlePromptClick(genre)}>
            <Text style={styles.promptButtonText}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Panda AI is typing...</Text>
        </View>
      )}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message PandaAI"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#000',
  //   width: '100%',
  //   height: 50,
  //   marginBottom: 20
  // },
  // backIcon: {
  //   position: 'absolute',
  //   left: 10,
  //   color: '#f7f8fa',
  // },
  // title: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#f7f8fa',
  // },
  container: {
    flex: 1,
    backgroundColor: '#000',
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  header1: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  promptContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  promptButton: {
    backgroundColor: '#f8d9aa',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  promptButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#d9f7be',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default AIChatScreen;
