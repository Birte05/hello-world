import React from 'react';
import { StyleSheet, View, Image, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// Creating the Chat component
export default class Chat extends React.Component {
  constructor() {
    super();

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

  // Upon loading the app
  componentDidMount() {
    // Function called upon sending a message
    onSend(messages = []) {
    // "previousState" references the component's state at the time the change is applied
      this.setState((previousState) => ({
          // Appends the new messages to the messages object/state
          messages: GiftedChat.append(previousState.messages, messages),
      }));
    };
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
  }
}

/**
* styling
*/

const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
import { View, Text} from 'react-native';

