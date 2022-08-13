import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";

function Search(props) {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((result) => {
        let users = result.docs
          .filter((doc) => doc.id !== firebase.auth().currentUser.uid)
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        setUsers(users);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Search"
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            <Text> {item.name} </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Search;
