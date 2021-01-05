import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Alert, Button, ScrollView } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import image function
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

// import communications features
import CustomActions from './components/CustomActions';


// build the buttons to take image or choose pic from library
// constructor() {
//   super();
//   state = {
//     image: null,
//   }
// };

{/* <View style={{flex: 1, justifyContent: 'center'}}>
  <Button
    title="Pick an image from the library"
    onPress={this.pickImage}
  />

  <Button
    title="Take a photo"
    onPress={this.takePhoto}
  />
</View> */}



// Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {

 render() {
   return (
    <NavigationContainer>
     <View style={{flex:1, justifyContent:'center'}}>
     <Stack.Navigator
        initialRouteName="SplashScreen"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
        />

      </Stack.Navigator>

      </View>
      </NavigationContainer>
   );
 }
}
