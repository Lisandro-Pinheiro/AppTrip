import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({navigation}) {
 
  const handleCameraPress = () => {
    navigation.navigate('Camera');
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Marcadores do mapa */}
          <Marker
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
            title="Marker 1"
          />
          <Marker
            coordinate={{
              latitude: 37.7896386,
              longitude: -122.421646,
            }}
            title="Marker 2"
          />
        </MapView>
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
});
