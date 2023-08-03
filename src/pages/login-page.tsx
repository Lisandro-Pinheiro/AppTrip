// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [nome, setNome] = useState('');

  const handleLogin = () => {
    
    navigation.navigate('MapPage', { nome });
  };

  return (
    <View style={styles.container}>
        <Image style={styles.icon}source={require('../../assets/icon.png')}/>
        <Text style={styles.title}> MarkTrip</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={(texto) => setNome(texto)}
      />
      <TouchableOpacity style={styles.botaoLogin} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#dadd66"
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff"
  },
  botaoLogin: {
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 160,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
  },

  icon: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },

  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 60,
    fontWeight: '700',
    marginTop: 3,
    marginBottom: 30
  }
});

export default LoginPage;
