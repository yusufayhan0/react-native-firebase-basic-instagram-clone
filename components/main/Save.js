import React, { useState } from 'react'
import { Button, Image, TextInput, View } from 'react-native'
import firebase from 'firebase'

function Save(props) {
    const { image } = props.route.params
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`//`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    const [caption, setCaption] = useState("")
    const uploadImage = async () => {
        const uri = image
        const response = await fetch(uri)
        const blob = await response.blob()
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob)
        const taskProgress = snapshot => {
            console.log(`transferred : ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = snapshot => {
            task.snapshot.ref.getDownloadURL()
                .then((snapshot) => {
                    savePostData(snapshot)
                })
        }
        const taskError = snapshot => {
        }

        task.on("state_change", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()//serverdaki zaman bilgisini alır
            })
            .then(() => {
                props.navigation.popToTop()
            })
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={image} style={{ flex: 1, transform: "scaleX(-1)" }}></Image>
            <TextInput
                placeholder="Write  Caption"
                onChangeText={(captionText) => setCaption(captionText)}
            />
            <Button
                title="Save"
                onPress={() => uploadImage()}
            />
        </View>
    )
}

export default Save
