import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Platform,
  Dimensions,
  Button,
} from "react-native";
import { useSelector } from "react-redux";
import firebase from "firebase";

export default function Profile(props) {
  const { uid } = props.route.params;
  const [userPost, setUserPost] = useState([]);
  const [user, setUser] = useState(null);
  const [followingState, setFollowingState] = useState(false);
  const { posts, currentUser, following } = useSelector(
    (state) => state.userState
  );

  useLayoutEffect(() => {
    if (uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPost(posts);
    }
    else {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((result) => {
          if (result.exists) {
            setUser(result.data());
          }
          else {
            console.log("does not exist");
          }
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((result) => {
          let posts = result.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setUserPost(posts);
        });
    }
    if (following.indexOf(uid) > -1) {
      setFollowingState(true);
    }
    else {
      setFollowingState(false)
    }
  }, [uid, following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(uid)
      .set({});
  };

  const onUnFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  }

  if (user === null) {
    return (
      <View>
        <Text> User Bulunamadı </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text> {user?.name} </Text>
        <Text> {user?.email} </Text>
        {uid !== firebase.auth().currentUser.uid ? (
          <View>
            {followingState ? (
              <Button title="Following" onPress={() => onUnFollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : <Button title="Logout" onPress={() => onLogout()} />
        }
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPost}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  flatListStyle: {
    //flex: 1
  },
  containerImage: {
    width: width / 3,
    height: width / 3,
  },
  image: {
    flex: 1,
  },
});
