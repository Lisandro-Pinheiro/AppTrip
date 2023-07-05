import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Marker {
  id: number;
  title: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const Map: React.FC = () => {
  const markers: Marker[] = [
    {
      id: 1,
      title: 'Marker 1',
      coordinates: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
    },
    {
      id: 2,
      title: 'Marker 2',
      coordinates: {
        latitude: 37.7896386,
        longitude: -122.421646,
      },
    },
  ];

  return (
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
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinates}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;
