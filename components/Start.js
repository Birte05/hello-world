import React from 'react';
import { StyleSheet, ImageBackground, View, Text, TextInput, Button } from 'react-native';

const backgroundImage = require('../assets/Background_Image.png');

export default class Start extends React.Component {
  constructor() {
    super();

    // Initializing the state of the app
    this.state = {
      name: '',
      // Setting a default background color in case the user doesn't select one
      color: '',
    };
  }

  render() {
    return (
      // adding background image
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>

        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Hello World!</Text>
          <TextInput
           style={{height: 40, borderColor: 'gray', borderWidth: 1}}
           onChangeText={(name) => this.setState({name})}
           value={this.state.name}
           placeholder='Enter your name ...'
         />
          <Button
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
            title="Go to Chat"
          />
        </View>

      </ImageBackground>
    )
  }
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '700',
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 44,
  },
  loginBox: {
    flex: 1,
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: '2%',
  },
  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    borderWidth: 1.5,
    borderColor: '#757083',
    borderRadius: 3,
    width: '88%',
    height: '21%',
    marginBottom: '5%',
    marginTop: '5%',
    paddingLeft: 30,
  },
  chooseColorBox: {
    alignSelf: 'flex-start',
    flex: 1,
    width: '88%',
    paddingLeft: 24,
    paddingBottom: '2%',
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },
  backgroundColorOptions: {
    flex: 4,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: '80%',
    justifyContent: 'space-around',
    paddingLeft: 16,
    marginTop: '2%',
  },
  colorSelector: {
    position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 50,
    margin: 2,
    borderColor: 'white',
  },
  startButton: {
    backgroundColor: '#757083',
    alignItems: 'center',
    width: '88%',
    height: '18%',
    marginBottom: '5%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
});

