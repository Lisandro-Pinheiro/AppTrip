// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CamPage from './src/pages/cam-page';
import MapPage from './src/pages/map-page';
import MarkerPage from './src/pages/marker-image-page.tsx';
import LoginPage from './src/pages/login-page';
import ChatPage from './src/pages/chat-page';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginPage' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="CamPage" component={CamPage} />
        <Stack.Screen name="MapPage" component={MapPage} initialParams={{ capturedImage: null }} />
        <Stack.Screen name="Marker" component={MarkerPage} />
        <Stack.Screen options= {({route}) => ({
          headerShown: true
        })}  name="chat" component={ChatPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;