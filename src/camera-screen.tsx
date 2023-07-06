import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';

export default function CameraScreen({ navigation, route}) {
  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [permission, setPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraVisible, setCameraVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setPermission(cameraStatus.status === 'granted');
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const handleAddMarker = () => {
    if (currentLocation && capturedImage) {
      const newMarker = {
        id: markers.length.toString(),
        coordinate: currentLocation,
        imageUri: capturedImage,
      };
      setMarkers([...markers, newMarker]);
    }
    setCameraVisible(false)

  };

  async function takePicture() {
    if (camera) {
      const photo = await camera.takePictureAsync();
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      navigation.navigate('Map', photo.uri);
    }

    handleAddMarker()

  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        ratio={'1:1'}
      />
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          takePicture();
        }}
      >
        <MaterialIcons name="camera-alt" size={24} color="white" />
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
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: '#9E9E36',
    width: 40,
    height: 40,
    borderRadius: 50,
    position: 'absolute',
    bottom: 50,
  },
});
