# React Native Chat App
This project was build using react-native and expo.

## 1.	Install the required Libraries and tools 

##### Install dependencies with

`npm i`

##### Run local version with 

`expo start`

This will open the “Metro Bundler”, which is an HTTP server that transpiles your app’s JavaScript using Babel, then serves it to the Expo app so that ES6+ code can be used.

##### Install react native app with expo

Create an account and download the app on your smartphone

https://expo.io/


##### If you do not have the expo-client installed, install it by running

`npm install expo-cli –global`



## 2.	Run the App
Expo start will build the app and serve it on localhost. To run the app follow the instructions in the console. Your options include

### Running the App on a physical device:

* scan the QR-Code in the console with a smartphone that has the expo app installed
* Make sure that your phone and computer are on the same network (LAN or WiFi) 

### Running the App on an Android emulator

* you need to have an Android Emulator running beforehand
* either press a in the console or
* click "run with Android Emulator" in the expo browser tab


**Dependencies**
```
"@react-native-community/async-storage": "~1.12.0"
"@react-navigation/native": "^5.8.10"
"@react-navigation/stack": "^5.12.8"
"eslint": "^7.16.0"
"expo": "~40.0.0"
"expo-image-picker": "~9.2.0"
"expo-location": "~10.0.0"
"expo-permissions": "~10.0.0"
"expo-speech": "~8.5.0"
"expo-status-bar": "~1.0.3"
"react": "16.13.1"
"react-dom": "16.13.1"
"react-native": "https://github.com/expo/react-native/archive/sdk-40.0.1.tar.gz"
"react-native-gifted-chat": "^0.16.3"
"react-native-maps": "0.27.1"
"react-native-web": "~0.13.12"
"react-navigation": "^4.4.3"
react-native-gifted-chat is needed of the app to function
```

### Changing the Database to your own
The App is bound to my firebase/firestore databse. If you want to have a private chatroom you should include your own database. The easiest way would be to open one on firebase, as you would then only have to change the configuration.

*The Database must include a collection named messages*

Once you set up your Database, change the const firebaseConfig in Chat.js to your own credentials. The format should look similar to:
```
const firebaseConfig = {
    apiKey: "AIzaSyDdwCp0uzuyxlmY9EoUtjia9qxSBKbf-HQ",
    authDomain: "chatapp-fa950.firebaseapp.com",
    projectId: "chatapp-fa950",
    storageBucket: "chatapp-fa950.appspot.com",
    messagingSenderId: "831032587230",
    appId: "1:831032587230:web:e2fca0cd051182c25ce34f",
    measurementId: "G-5V25G8BF5S"
};
```
### Setting up the Database 

Google Firestore database was used for this app. 

##### 1. Take these steps to set it up:

* Go to Google Firebase and click on “Sign in”
* Click on the “Go to console” link and click on "Create Project"
* A form will appear asking for basic information.
* Give a project name.
* With the default settings selected, agree to the terms and click “Create Project.”
* Create a database, click on “Develop” from the menu on the left-hand side.
* From the additional menu that appears, select “Database”.
* Choose “Create database” in the Cloud Firestore section.
* Make sure to create a Firestore Database—not a “Realtime Database.”

##### 2. Set up a new Expo Project using

`expo init hello-world`

----------------
###### See details of the development process on my Kanban board
https://trello.com/b/LqrBxjGy/chat-app

