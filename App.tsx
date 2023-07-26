import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Button,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Keyboard } from 'react-native';
import { app, db } from './firebase-config';
import { onValue, ref } from 'firebase/database';
import * as  firebaseStorage from '@firebase/storage';

export interface MarkerEntity {
  id: string;
  coords: { latitude: number; longitude: number };
  imagePath: string;
  title: string;
  description: string;
  photodate: string;
}

const App = () => {
  const [markers, setMarkers] = useState<MarkerEntity[]>([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [markerImageUri, setMarkerImageUri] = useState(null);
  const [markerTitle, setMarkerTitle] = useState('');
  const [markerDescription, setMarkerDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }; 

  async function getPlace(){
    return onValue (ref(db,'/places'), (snapshot) =>{
     try{
      setMarkers([]);
      if (snapshot !== undefined) {
        snapshot.forEach((childSnapshot)=>{

          const childkey = childSnapshot.key;
          let childValue = childSnapshot.val();
          childValue.id = childkey;
          setMarkers((places)=>[...places, (childValue as MarkerEntity)])

        })
      }
     } catch (e) {
      console.log(e);
     }
    });
  }

  const cameraRef = useRef(null);
  const [cameraType, setCameraType] = useState(CameraType.back);

  useEffect(() => {
    getLocationPermission();
    getPlace();
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
      const newMarker: MarkerEntity = {
        id: markers.length.toString(),
        coords: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        imagePath: capturedImage,
        title: '',
        description: '',
        photoDate: new Date().toString(),
      };
      setMarkers([...markers, newMarker]);
    }
    setCameraVisible(false);
  };

  const saveToGallery = async (photoUri) => {
    try {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      console.log('Imagem salva na galeria');
    } catch (error) {
      console.log('Erro ao salvar imagem na galeria:', error);
    }
  };

  const handleOpenCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão da câmera não concedida');
    } else {
      setCameraVisible(true);
    }
  };

  const handleSwitchCamera = () => {
    setCameraType(
      cameraType === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };

  async function uploadImage(imageUrl): Promise<string>{
    setIsUploading(true);
    const response = await fetch (imageUrl)
    const blob = await response.blob();

    const storage = firebaseStorage.getStorage(app);
    const storageRef = firebaseStorage.ref(
      storage,
      'images/' + imageUrl.replace(/^.*[\\\/]/, '')
    ); 

    const upload = await firebaseStorage.uploadBytes(storageRef, blob);
    const uploadedImageUrl = await firebaseStorage.getDownloadURL (storageRef);
    console.log(uploadedImageUrl);
    setIsUploading(false);
    return uploadedImageUrl;
    }

  const handleCaptureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      await saveToGallery(photo.uri);

      const newMarker: MarkerEntity = {
        id: markers.length.toString(),
        coords: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        imagePath: await uploadImage(photo.uri),
        title: '',
        description: '',
        photodate: new Date().toString(),
      };
      setMarkers([...markers, newMarker]);

      setCapturedImage(photo.uri);
      setCameraVisible(false);
      handleAddMarker();
    }
  };

  const renderMarkerCallout = (marker: MarkerEntity) => (
    <TouchableOpacity onPress={dismissKeyboard}>
      <Image source={{ uri: marker.imagePath }} style={styles.markerImage} />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic', color: '#303F9F' }}>{marker.title}</Text>
    </TouchableOpacity>
  );

  const handleMarkerPress = (marker: MarkerEntity) => {
    setMarkerImageUri(marker.imagePath);
    setMarkerTitle(marker.title);
    setMarkerDescription(marker.description);
    setModalVisible(true);
  };

  const handleSaveMarker = () => {
    const updatedMarkers = markers.map((marker) => {
      if (marker.imagePath === markerImageUri) {
        return {
          ...marker,
          title: markerTitle,
          description: markerDescription,
        };
      }
      return marker;
    });

    setMarkers(updatedMarkers);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleGoBackToMap = () => {
    setCameraVisible(false);
  };

  return (
    <View style={styles.container}>
      {isCameraVisible ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            type={cameraType}
            onCameraReady={() => console.log('Câmera pronta')}
            onMountError={(error) => console.log('Erro ao montar a câmera:', error)}
          >

            {
              isUploading? 
              <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: 0.8, 
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Image style={{width: 100, height: 80}}
                  source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADKCAMAAADXTv+nAAAAJ1BMVEX///8oKChWVlaQkJAzMzOmpqbLy8tpaWm3t7dFRUV/f3/c3Nzq6urM8SFYAAAEwklEQVR4nO3a4XbaMAyG4dAA2Sj3f71baEOT2JY+yZLtpH5/tuCj56gsGTAMvV6v11v3+Kr2GLk93tWeJK/HutrDZPQ4J+S4ksdZIYeVdEhrdUjBxv+xD5JDpmmymA5uXKIfJoRMS3aDMo0jJpFBpqm0ZBxBiQgyTaUl44hKJJBpKi0ZzwohJALItM9+8H3nhaQlOCRwHBQSOqpAkpLDQVISFBJxnAbiNf06XAJC6ixkELxK9BC/4dfBK8Eg1RaCSyBIRYc7xHf6daAEgdRcyIC+3pUQ7+HXYSsBIJUXAq5EB/Effh20Eh5SfSGYhIU04DgPBJFwkCYcyOudgTTiAFZyEAgvoSHNOM4DYSUkpCEH+3qXQjxGvM2xj2JWQkE0C/l4JWYgFlMIxBBZbjdUQq+EgIgX8rFJ7uAopCQNyXRgkltQEYiEoYVQFEqShMgWEjIgSMxBUYwgIkYOJCkhVpKCCBYSZ0CSFCRJwVey/NjAkQVJUPCVpB1xSJqRC4Ely69QiIODkcQo6L/Ay88wCMWwgMQoBCT2NVPEQTPASzsnCSgUJPK9X97BMdCbrXwJeTwHYRn4DTAr2VMkDu5bDoYORLKl5EAcGQqKxLGVCB1CBkZJSICzEw7zdeRQwLMjDi+GnJKVJ2MoKHF2DIqLSpuMOX9JEcact6SUQ3FHLKoYY85TUpAxKP7niFeSMVcBYjJ3pMIQk5kTFYSYzEtUCGIyK525Q/vebn7uEIMZwWwdO4nBeYJMHWuJyXGiDBlz1Ry9Xq9XvT+SnGb4Kylf4WQRKRIUhcNcIneEFJXDGKJy7CU6iK3EAqJ0mEKUjq1EC7GUdEiHdEiH4JDTXEeauLIrJbtDWoCoJMEh9RkqSeyU6gw5xWmIXq/Xa7n7K7Pjrq/MjoO7vzM57vrO5Di4+zqD867rDM4Du+/KPvC6y2BGpL3DHlJEEjDyJYGjACXGcIH4UuIMJ4gjJeXwgjhJkgw/iAeFYHhCzCmeDhpiKiEZHtcRHwrDMLhFYSA2FI5hctPISrIpLMPqPt5Z4uq4yCQZFCHj8xWq+KoEhWdsHJ9LAoZYoqAIGT8OhHJZ50sRMjYOFnJJQqz/vqSMrYOVXPIkOEXK2DsYyGXf7vdmErEjgGwkzzkJxOqiImaEjhXkuURAQglLyYfEnkFAns9QgkAMbonFjIjjDXk+I5IQIpdkQuLPAB1vSQQSlZCUHEjiCehCxCshKXpI6vERxwJ54pCUJOMdFqFDsBDq5Z6EpCQ8RPhWIrEQESQtUb8RKWGQC0lDhJIIBYHsJeRjKYcdRPl2fZ4Dgoglyk9QQAazEFOI9kMtiMEshIJoJI4fM9IOc4hbzEJISEsSzkFDGpJwjqNA2IUwkGYkrOMgEH4hHKQRCe9gIaK7YK+AhaggpSWIg4c0sBLEoYOUlUALASDVJZADgVT+48IWooUUlGAOCFJVAi6keQjqwCAVJaijdQi8EBBSTQI7GofgC0EhlSS4A4bUuSrijl8IAT+Nsw13/EYI8JG1ebhDAgkkxlPHKgIxnjke6hBB0t8Ycgx0yCBDecePhHmYDDKUd8zxDDHkm2IxnXFiSKt1SGt1SHN1SHOdxTGcxbGW1J4ku5Mwer1erxftHwo2E70CZdZ8AAAAAElFTkSuQmCC'}}/> 
                  <Text style={{color: 'white'}}> Aguarde...</Text>
                
              </View> : <></>
            }
            <TouchableOpacity style={styles.captureButton} onPress={handleCaptureImage}>
              <Text style={styles.captureButtonText}>
                <MaterialCommunityIcons name="circle-slice-8" size={60} color="white" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchCameraButton} onPress={handleSwitchCamera}>
              <Text style={styles.switchCameraButtonText}>
              <MaterialIcons name="flip-camera-android" size={60} color="white" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBackToMap}>
              <Text style={styles.goBackButtonText}>
                <MaterialIcons name="arrow-back" size={60} color="white" />
              </Text>
            </TouchableOpacity>
          </Camera>
        </View>
      ) : (
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
                  coordinate={marker.coords}
                  onPress={() => handleMarkerPress(marker)}
                >
                  {renderMarkerCallout(marker)}
                </Marker>
              ))}
            </MapView>
          ) : (
            <Text style={styles.loadingText}>Carregando mapa...</Text>
          )}

          <TouchableOpacity style={styles.buttonContainer} onPress={handleOpenCamera}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="camera-marker-outline" size={30} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={dismissKeyboard}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {markerImageUri && (
                <Image source={{ uri: markerImageUri }} style={styles.modalImage} />
              )}
              <TextInput
                style={styles.input}
                placeholder="Título"
                value={markerTitle}
                onChangeText={setMarkerTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={markerDescription}
                onChangeText={setMarkerDescription}
                multiline={true}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 60 }}>
                <Button title="Salvar" onPress={handleSaveMarker} color='#000' />
                <Button title="Fechar" onPress={handleCloseModal} color='#000' />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    backgroundColor: '#fff8e1'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#000',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#transparent',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#transparent',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
    marginLeft: 10,
  },
  captureButtonText: {
    color: '#FFFFFF',
  },
  switchCameraButton: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    backgroundColor: '#transparent',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
    marginStart: 10,
  },
  switchCameraButtonText: {
    color: '#FFFFFF',
  },
  goBackButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#transparent',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
    left: 16,
  },
  goBackButtonText: {
    color: '#FFFFFF',
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
