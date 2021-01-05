import PropTypes from 'prop-types';
import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as firebase from 'firebase';
require('firebase/firestore');
import NetInfo from '@react-native-community/netinfo';
import * as Speech from 'expo-speech';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';


export default class CustomActions extends React.Component {
  state = {
    image: null,
  }

/**
 * asks for permission and allows to pick image from library
 * @async
 * @function pickImage
 */

// pick image and ask for permission
  pickImage = async () => {
    try{
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if(status === 'granted'){
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch(error => console.log(error));

      if (!result.cancelled){
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl})
      }
    }
  } catch (error){
    console.log(error.message)
  }
}

/**
 * allows user to take a pic and send it to others, stores pic
 * @async
 * @function takePhoto
 * @returns {Promise<string>}
 */

  takePhoto = async () => {
    try{
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
      if(status === 'granted'){
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        if (!result.cancelled){
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl})
        }
      }
    } catch(error){
      console.log(error.message)
    }
  }


  // gets users current location
  getLocation = async () => {
    try{
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if(status === 'granted'){
      let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));
      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);
      if(result) {
        this.props.onSend({
          location:{
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          }
        })
      }
    }
  } catch(error){
    console.log(error)
  }
}

  /**
   * When +-button is pressed user can choose next action
   * @function onActionPress
   * @returns {actionSheet}
   */

  onActionsPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return;
          case 1:
            console.log('user wants to take a photo');
            return;
          case 2:
            console.log('user wants to get his location');
          default:
        }
      },
    );
  };

/**
 * uploads pic as blob to cloud storage (firebase)
 * @async
 * @function uploadImage
 * @param {string}
 * @returns {string} url
 */

// turning a file into a blob
uploadImage = async(uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child('myimage');

  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
}

// upload image to Storage with fetch() and blob()
uploadImageFetch = async(uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase
    .storage()
    .ref()
    .child("my-image");

    const snapshot = await ref.put(blob);

  return await snapshot.ref.getDownloadURL();
}


  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionsPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
  <Button
    title="Pick an image from the library"
    onPress={this.pickImage}
  />

  <Button
    title="Take a photo"
    onPress={this.takePhoto}
  />
</View>
      </TouchableOpacity>
    );
  }

}

// styles

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};


