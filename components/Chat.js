import React, { Component } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firebase from "firebase";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Button, Keyboard } from 'react-native';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

import {Platform, Alert, View, Text} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      isConnected: false,
      uid: 0,
      backGround: '#474056',
      name: '',
      messages: [],
      loggedInText: 'Please wait for authentication',
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      image: null,
      location: null,
    };

    const firebaseConfig = {
      apiKey: "AIzaSyDdwCp0uzuyxlmY9EoUtjia9qxSBKbf-HQ",
      authDomain: "chatapp-fa950.firebaseapp.com",
      projectId: "chatapp-fa950",
      storageBucket: "chatapp-fa950.appspot.com",
      messagingSenderId: "831032587230",
      appId: "1:831032587230:web:e2fca0cd051182c25ce34f",
      measurementId: "G-5V25G8BF5S"
    }

    // Firebase initialization
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceMessages =
      firebase.firestore().collection('messages');
  };

  componentDidMount() {
    let { name, backGround } = this.props.route.params;

    // Set a default username
    if (!name || name === '') name = 'User';

    // login message
    this.id = uuidv4();

    // Displays background color and username in navbar
    this.props.navigation.setOptions({ title: name });

    this.setState({
      name: name,
      backGround: backGround,
    })

    // Retrieves chat messages from asyncStorage
    this.getMessages();

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {

        // Firebase user authentication
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log(`Sign-in denied: ${error.message}`);
              }
            }

            // Update user state with currently active user data
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: name,
                avatar: '',
              },

              // Blank the authentication message
              loggedInText: '',
              messages: [
                {
                  _id: this.id,
                  text: `${name} has entered the chat`,
                  createdAt: new Date(),
                  system: true,
                }
              ],
            });

            this.unsubscribe = this.referenceMessages
              // Order by ensures correct chronological order
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
          loggedInText: 'Offline',
        });

        // retrieve chat messages from asyncStorage
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || "",
        location: data.location
      });
    });
    this.setState({
      messages,
    });

    // If no messages
    if (!messages.length > 0) {
      Alert.alert('You have no messages');
    }
  };

  // update messages from local storage
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Save messages state to local storage as 'messages' key
  saveMessages = async () => {
    try {
      await AsyncStorage
        .setItem(
          'messages',
          JSON.stringify(this.state.messages)
        );
    } catch (error) {
      console.log(error.message);
    }
  }

  // To delete the locally stored 'messages' key
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Messages added to Firestore from state
  addMessages = () => {
    // Find the newest (ie first ) message of messages state
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
      sent: true,
    });
  };

  // Developer use - Clears Firestore, leaves placeholder to maintain collection
  deleteMessagesFirestore = async () => {
    collectionPlaceholder =
    {
      _id: 1,
      text: 'Hello, let\'s start the chat',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Creator',
        avatar: '',
      },
      sent: true,
    }
    try {
      this.referenceMessages.get()
        .then(res => {
          res.forEach(doc => {
            doc.ref.delete();
          })
          this.referenceMessages.add(collectionPlaceholder);
        })
    } catch (error) {
      console.log(error);
    }
  };

  // Adds new messages
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();

        // Call function to save to local storage
        this.saveMessages();
        // Hide keyboard after message sent
        Keyboard.dismiss();
      }
    );
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#bdbdbd',   // Grey
          },
          right: {
            backgroundColor: '#081721'    // Midnight blue
          }
        }} />
    )
  }

  // To render message toolbar only if user is online
  renderInputToolbar = (props) => {
    if (props.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let { backGround } = this.state;
    let { /* isConnected, */ loggedInText } = this.state;
    return (

      <View
        // Flex: 1 prop essential to ensure View fills entire available space
        style={{
          flex: 1,
          backgroundColor: backGround
        }}
      >
        <Text>{loggedInText}</Text>

        {/* GiftedChat renders chat progress */}
        <GiftedChat
          renderBubble={this.renderBubble}
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderUsernameOnMessage={true}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />

        {/* Cures Android keyboard overlap issue */}
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}

      </View>
    )
  }
}
