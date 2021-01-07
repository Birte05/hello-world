import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Speech from 'expo-speech';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';

//const firebase = require('firebase');
//require('firebase/firestore');

window.addEventListener = (x) => x;


// Creating the Chat component
export default class Chat extends React.Component {
constructor() {
  super();
  this.state = {
    messages: [], // 5.4. reference to "message" collection to save user messages in firestore
    user: {
      _id: '',
      name: '',
    },
  };

  // Task 5.4.
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

  // return (
  //   <View style={styles.container}>
  //     <Button title="Press to hear some words" onPress={speak} />
  //   </View>
  // );
}

componentDidMount() {
  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      this.authUnsubscribe = firebase  // 5.4. authenticate users
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

/**
 * Sends messages
 * @param {string} messages
 * @returns {state} GiftedChat
 */

onSend(messages = []) {
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }), () => {
    this.saveMessages();
  });
}


/**
 * Updates the state of the message with the input of the text.
 * @function onCollectionUpdate
 * @param {string} _id - message id
 * @param {string} text - text message
 * @param {string} image - uri
 * @param {number} location - geo coordinates
 * @param {string} user - user data
 * @param {date} createdAt - date/time of message creation
 */

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
      image: data.image || '',
      location: data.location || null,
    });
  });
  this.setState({
    messages,
  });
};


/**
 * Pushes messages to Firestore database
 * @function addMessages
 * @param {string} _id - message id
 * @param {string} text - message content
 * @param {date} cratedAt - date and time of message
 * @param {string} user - user data
 * @param {string} image
 * @param {number} location - geographical coordinates
 * @param {boolean} sent
*/

// 5.4. add messages
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

/**
* If user goes offline messages are stored in async storage
* @async
* @function getMessages
* @returns messages
*/

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

/**
* saves messages to asyncStorage
* @async
* @function saveMessages
* @await
* @returns {Promise<AsyncStorage>}
*/

async saveMessages() {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * deletes messages from asyncStorage. Currently not used but written incase it is needed
 * @async
 * @function deleteMessages
 * @param {string} messages
 * @return {AsyncStorage}
 */

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

/**
 * removes toolbar if not connected to internet
 * @function renderInputToolbar
 * @param {*} props
 * @return {InputToolbar}
 */

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

/**
 * shows location if coordinates are available
 * @function renderCustomView
 * @param {*} props
 * @returns {MapView}
 */


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

/**
 * Shows options to take photo, retrieve image from library, and share location options
 * @function renderCustomActions
 * @param {*} props
 * @returns {CustomActions}
 */

renderCustomActions = (props) => {
  return <CustomActions {...props} />;
};

render() {
  // Defining variables from StartScreen
  let { user, backgroundColor } = this.props.route.params;
  console.log(this.props.navigation)
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
      <Text>Hello {this.props.route.params.name}</Text>
      {this.state.image && (
        <Image
          source={{ uri: this.state.image.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}

      <GiftedChat
        renderCustomView={this.renderCustomView}
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
      {/* If the device OS is Android, adjust height when the keyboard pops up */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
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
