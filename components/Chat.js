import React, { Component } from 'react';
import { StyleSheet, View, Image, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Speech from 'expo-speech';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

window.addEventListener = (x) => x;

// Creating the Chat component
export default class Chat extends React.Component {
constructor() {
  super();
  this.state = {
    messages: [],
    user: {
      _id: '',
      name: '',
    },
  };

  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyDdwCp0uzuyxlmY9EoUtjia9qxSBKbf-HQ",
      authDomain: "chatapp-fa950.firebaseapp.com",
      projectId: "chatapp-fa950",
      storageBucket: "chatapp-fa950.appspot.com",
      messagingSenderId: "831032587230",
      appId: "1:831032587230:web:e2fca0cd051182c25ce34f",
      measurementId: "G-5V25G8BF5S"
    });
    this.referenceMessages = firebase.firestore().collection('messages');
    }

  return (
    <View style={styles.container}>
      <Button title="Press to hear some words" onPress={speak} />
    </View>
  );
}


componentDidMount() {
  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      this.authUnsubscribe = firebase
        .auth()
        .onAuthStateChanged(async (user) => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.log(`Unable to sign in: ${error.message}`);
            }
          }
          this.setState({
            isConnected: true,
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.name,
            },
            loggedInText:
              `Hello ${this.props.navigation.state.params.name
              }`,
            messages: [],
          });
          this.unsubscribe = this.referenceMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
    } else {
      this.setState({
        isConnected: false,
      });
      this.getMessages();
    }
  });
}

componentWillUnmount() {
  this.authUnsubscribe();
  this.unsubscribe();
}

onSend(messages = []) {
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }), () => {
    this.saveMessages();
  });
}

onCollectionUpdate = (querySnapshot) => {
  const messages = [];
  // loop through documents
  querySnapshot.forEach((doc) => {
    // get data snapshot
    const data = doc.data();
    messages.push({
      _id: data._id,
      text: data.text.toString(),
      createdAt: data.createdAt.toDate(),
      user: {
        _id: data.user._id,
        name: data.user.name,
      },
    });
  });
  this.setState({
    messages,
  });
};

addMessages = () => {
  const message = this.state.messages[0];
  this.referenceMessages.add({
    _id: message._id,
    text: message.text || '',
    createdAt: message.createdAt,
    user: message.user,
    image: message.image || '',
    location: message.location || null,
    sent: true,
  });
};

async getMessages() {
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

async saveMessages() {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  } catch (error) {
    console.log(error.message);
  }
}

async deleteMessages() {
  try {
    await AsyncStorage.removeItem('messages');
    this.setState({
      messages: []
    })
  } catch (error) {
    console.log(error.message);
  }
}

renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#6d81a0',
        },
        left: {
          backgroundColor: '#f6dd7e',
        },
      }}
    />
  );
}

renderInputToolbar(props) {
  if (this.state.isConnected == false) {
  } else {
    return(
      <InputToolbar
      {...props}
      />
    );
  }
}
//checks wether message contains location data.
renderCustomView (props) {
  const { currentMessage} = props;
  if (currentMessage.location) {
    return (
        <MapView
          style={{width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3}}
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

renderCustomActions = (props) => {
  return <CustomActions {...props} />;
};

render() {
  // Defining variables from StartScreen
  let { user, backgroundColor } = this.props.route.params;

  // Displaying username on the navbar in place of the title
  this.props.navigation.setOptions({ title: user });
  return (
    // Rendering chat layout
    <View style={[styles.chatBackground, { backgroundColor }]}>
      {this.state.image && (
        <Image
          source={{ uri: this.state.image.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}

      </Text>
      {this.state.image && (
        <Image
          source={{ uri: this.state.image.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}

      <GiftedChat
        renderActions={this.renderCustomActions}
        renderInputToolbar={this.renderInputToolbar}
        renderBubble={this.renderBubble}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        image={this.state.image}
        user={{
          _id: 1,
        }}
      />
      //If the device OS is Android, adjust height when the keyboard pops up
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}      </View>
  );
}
}
const styles = StyleSheet.create({
container: {
  flex: 1,
},
userName: {
  fontSize: 10,
  color: '#fff',
  alignSelf: 'center',
  opacity: 0.5,
  marginTop: 25,
},
});
