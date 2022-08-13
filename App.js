import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import firebase from "firebase";
import { StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
//----
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import RegisterScreen from "./components/auth/Register";
import LandingScreen from "./components/auth/Landing";
import LoginScreen from "./components/auth/Login";
import CommentScreen from "./components/main/Comment";
//----
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducers/index";
//----

const store = createStore(rootReducer, applyMiddleware(thunk));

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

const screenDefault = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "red",
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },
});

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export default function App(props) {
  const [loadedState, setLoadedState] = useState({ loaded: false });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoadedState({ loggedIn: false, loaded: true });
      }
      else {
        setLoadedState({ loggedIn: true, loaded: true });
      }
    });

  }, []);

  if (!loadedState.loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading</Text>
      </View>
    );
  }

  if (!loadedState.loggedIn) {
    return (
      <SafeAreaView style={screenDefault.droidSafeArea}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={screenDefault.droidSafeArea}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} />
            <Stack.Screen name="Save" component={SaveScreen} />
            <Stack.Screen name="Comment" component={CommentScreen} />
            {/* navigation={props.navigation)} */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}
