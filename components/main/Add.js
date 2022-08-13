import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker"

export default function App({ navigation }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null)
    const [image, setImage] = useState(null)

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');

        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            setImage(data.uri)
        }
    }

    if (hasCameraPermission === null || hasGalleryPermission === false) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.camera}
                    type={type}
                />
            </View>
            <View style={styles.imageContainer}>
                {
                    image && <Image style={{ flex: 1, transform: "scaleX(-1)" }} source={image} />
                }
            </View>
            <View>
                <Button
                    title="Flip Image"
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }}>
                </Button>
                <Button title="Take Picture" onPress={() => takePicture()}></Button>
                <Button title="Gallery" onPress={() => pickImage()}></Button>
                <Button title="Save" onPress={() => navigation.navigate("Save", { image })}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageContainer: {
        flex: 1
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    button: {
        flex: 1
    },
});
