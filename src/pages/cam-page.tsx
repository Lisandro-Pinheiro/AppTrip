import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';


const CamPage = ({ navigation }: any) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<number>(Camera.Constants.Type['back']);
  const cameraRef = useRef<Camera | null>(null);


  const handleCaptureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      navigation.navigate('MapPage', { capturedImage: photo.uri });
    }
  };


  const toggleCameraType = () => {
    setCameraType((prevType) =>
      prevType === Camera.Constants.Type['back']
        ? Camera.Constants.Type['front']
        : Camera.Constants.Type['back']
    );
  };


  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={cameraType} />
      <TouchableOpacity style={styles.captureButton} onPress={handleCaptureImage}>
      <Ionicons name="radio-button-on-sharp" size={50} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
        <MaterialIcons name="flip-camera-android" size={40} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#transoarent',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'flex-end',
    backgroundColor: '#transparent',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
    right: 10,
  },
});

export default CamPage;