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

const AIChatScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

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

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMessage = { type: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate an AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        text: `You asked about: "${input}". Here's what I found!`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handlePromptClick = (genre) => {
    const newMessage = { type: 'user', text: genre };
    setMessages([...messages, newMessage]);

    // Simulate an AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        text: `Looking into "${genre}" movies and shows for you!`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.aiMessage,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="person-outline" // This is the robot icon
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <Text style={styles.title}>AI Chat</Text>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    width: '100%',
    height: 50,
    marginBottom: 20
  },
  backIcon: {
    position: 'absolute',
    left: 10,
    color: '#f7f8fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7f8fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header1: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
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
});

export default AIChatScreen;
