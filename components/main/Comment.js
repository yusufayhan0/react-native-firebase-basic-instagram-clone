import React, { useEffect, useState } from 'react'
import { View, FlatList, Text, TextInput, Button } from 'react-native'
import firebase from 'firebase'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersData } from '../../redux/actions';

function Comment(props) {
    const { postId: propsPostId, uid } = props.route.params;
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    const { users, usersLoaded } = useSelector((state) => state.usersState);
    const dispatch = useDispatch()

    useEffect(() => {
        function matchUserToComment(comments) {
            comments.forEach(comment => {
                if (comment.hasOwnProperty("user")) {
                    return//döngü durmaz sadece o sırayı atlar continue ile aynı işlevi görür
                }
                const user = users.find(x => x.uid === comment.creator)
                if (user) {
                    comment.user = user
                }
                else {
                    dispatch(fetchUsersData(comment.creator, false))
                }
            })
            setComments(comments)
        }
        if (propsPostId !== postId) {
            firebase.firestore()
                .collection("posts")
                .doc(uid)
                .collection("userPosts")
                .doc(propsPostId)
                .collection("comments")
                .get()
                .then(result => {
                    let comments = result.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    matchUserToComment(comments)
                })
            setPostId(propsPostId)
        }
        else {
            matchUserToComment(comments)
        }
    }, [propsPostId, users])

    const onCommentSend = () => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(propsPostId)
            .collection("comments")
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
            .then(() => {
                setText("")
            })

    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={comments}
                    renderItem={({ item }) => (
                        <View>
                            <Text>
                                {item.user.name}------
                            </Text>
                            <Text> {item.text} </Text>
                        </View>
                    )}
                />
            </View>
            <View>
                <TextInput
                    placeholder="Yorumunuzu giriniz"
                    value={text}
                    onChangeText={(text) => setText(text)}
                />
                <Button
                    onPress={() => onCommentSend()}
                    title="Gönder"
                />
            </View>
        </>
    )
}

export default Comment
