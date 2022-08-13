import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import firebase from "firebase";

export default function Feed(props) {
    const [posts, setPosts] = useState([]);
    const { currentUser, following } = useSelector((state) => state.userState);
    const { feed, usersLoaded } = useSelector((state) => state.usersState);

    useEffect(() => {
        if (usersLoaded == following.length && following.length !== 0) {
            feed.sort(function (x, y) {
                return x.creation - y.creation
            })
            setPosts(feed)
        }
    }, [usersLoaded, feed]);

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts || []}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Text> {item.user?.name} </Text>
                            {/* <Image style={styles.image} source={{ uri: item.downloadURL }} />
                            <Text
                                onPress={() => {
                                    props.navigation.navigate("Comment", {
                                        postId: item.id,
                                        uid: item.user.uid
                                    })
                                }}>
                                comments
                            </Text> */}
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
        width: width,
        height: width / 1.5,
    },
    image: {
        flex: 1,
    },
});
