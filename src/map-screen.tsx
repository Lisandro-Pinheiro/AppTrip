import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

export default function MapScreen({ navigation }) {
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);


  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização não concedida');
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
    setCurrentLocation({ latitude, longitude });
  };

 
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
  
  const handleCameraPress = () => {
  navigation.navigate('Camera', {
    onPictureTaken: (imageUri) => setCapturedImage(imageUri),
  });
  };


  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                image={marker.imageUri}
              />
            ))}
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Carregando mapa...</Text>
        )}
      </View>

      <View style={styles.cameraButtonContainer}>
        <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  cameraButton: {
    backgroundColor: '#9E9E36',
    borderRadius: 50,
    padding: 8,
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    backgroundColor: '#fff'
    
  },
});
