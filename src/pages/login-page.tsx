// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getStoredData, setStoredData } from '../shared/secure-store-service';


const LoginPage = ({ navigation }) => {
  const [author, setAuthor] = useState('');

  useEffect(()=>{
    getAuthor();
  }, []);

async function  getAuthor(){
  const localAuthor = await getStoredData('author')
  if (localAuthor){
    navigation.navigate('MapPage')
  }
}
  function Login () {
    setStoredData ('author,', author)
    navigation.navigate('MapPage', { author });
  };

  return (
    <View style={styles.container}>
        <Image style={styles.icon}source={require('../../assets/icon.png')}/>
        <Text style={styles.title}> MarkTrip </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={author}
        onChangeText={setAuthor}
      />
      <TouchableOpacity style={styles.botaoLogin} onPress={Login}>
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
    backgroundColor: "#dadd66",
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'black',
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
    backgroundColor: 'black',
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
