import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setPermission(cameraStatus.status === 'granted');
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  async function takePicture() {
    if (camera) {
      const photo = await camera.takePictureAsync();
      console.log(photo.uri);
      setImage(photo.uri);
      await MediaLibrary.saveToLibraryAsync(photo.uri);
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        type={CameraType.back}
        ratio={'1:1'}
      />
      {image && (
        <Image
          style={styles.image}
          source={{ uri: image }}
          resizeMode="cover"
          transition={1000}
        />
      )}
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          takePicture();
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>Capture</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    aspectRatio: 1,
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: '#9E9E36',
    width: 80,
    height: 40,
    borderRadius: 30,
    position: 'absolute',
    bottom: 50,
  },
});
