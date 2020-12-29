import React from 'react';
import { StyleSheet, View, Image, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

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
        avatar: '',
      },
      sent: false,
    };
    loggedInText: 'Please wait, you are getting logged in',
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
  }
  this.referenceMessages = firebase.firestore().collection('messages');

  // Initializing state for messages, user, user ID, image and location
  this.state = {
    messages: [
      {
        _id: 1,
        text: 'Hello {this.props.navigation.state.params.name}',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ],
  };
}

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
    });
  } catch (error) {
    console.log(error.message);
  }
}


componentDidMount() {
  NetInfo.fetch().then(connection => {
    if (connection.isConnected) {
      console.log('online');
    } else {
      console.log('offline');
    }
  });
  this.authUnsubscribe = firebase
    .auth()
    .onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
        }
      })
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
        .onSnapshot(this.onCollectionUpdate);
    this.getMessages();
};


componentWillUnmount() {
  this.authUnsubscribe();
  this.unsubscribe();
};


onSend(messages = []) {
  this.setState(
    (previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
    this.addMessages();
    this.saveMessages();
    },
  );
};

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
        avatar: data.user.avatar,
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
    sent: true,
  });
};

getMessages = async () => {
  let messages = [];
  try {
    messages = (await AsyncStorage.getItem('messages')) || [];
    this.setState({
      messages: JSON.parse(messages),
    });
  } catch (error) {
    console.log(error.message);
  }
};

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
};

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

render() {
  // Defining variables from StartScreen
  let { user, backgroundColor } = this.props.route.params;

  // Displaying username on the navbar in place of the title
  this.props.navigation.setOptions({ title: user });

  return (
    // Rendering chat layout
    <View style={[ styles.chatBackground, { backgroundColor }]}>
      {this.state.image && (
        <Image
          source={{ uri: this.state.image.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}

    <GiftedChat
      renderInputToolbar={this.renderInputToolbar}
      renderBubble={this.renderBubble.bind(this)}
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      user={{
        _id: 1,
      }}
    />
      {/* If the device OS is Android, adjust height when the keyboard pops up */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};



// styling

const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
