import { onValue, push, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FlatList, View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../../firebase-config2";
import { ChatEntity } from "../entities/chat-entity";
import { getStoredData } from "../shared/secure-store-service";
import { MaterialIcons} from '@expo/vector-icons';


export default function ChatPage({ navigation, route }) {
    const[author, setAuthor] = useState('');
    const [messages, setMessages] = useState <ChatEntity[]>([]);
    const [listRef, setListRef] = useState(null);
    const [message, setMessage] = useState(''); 

    useEffect(() => {
        getAuthor();
        getMessages();
    }, [])

    async function getAuthor(){
        const author = await getStoredData('user');
        setAuthor(author);
    }

    async function getMessages() {
        return onValue(ref(db, `/messages/${route.params.place.id}`), (snapshot) => {
          try {
            setMessages([]);
            if (snapshot !== undefined) {
              snapshot.forEach((childSnapshot) => {
    
                const childkey = childSnapshot.key;
                let childValue = childSnapshot.val();
                childValue.id = childkey;
                setMessages((messages) => [...messages, (childValue as ChatEntity)])
              });
            }
          } catch (e) {
            console.log(e);
          }
    
        });
    }

    async function sendMessage(){
        const newMessage: ChatEntity = {
            id: Math.random(). toString(),
            date: Date.now(),
            message: message,
            sender: author
        }

        push(ref(db, `/messages/${route.params.place.id}`), newMessage);
        setMessage('');
    }

    function convertTimestampToDate(timestamp:number) {
        let date = new Date (timestamp);
        return date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    }

    return (
        <View style={{ justifyContent: "center", backgroundColor: '#fff', height: '100%', width: "100%" }}>
            <FlatList
                ref={(ref) => { setListRef(ref) }}
                data={messages}
                renderItem={({ item }) => {
                    return (
                        item.sender !== author ?
                        
                                    <View style={styles.container}>
                                        <View style={styles.containerMessage}>
                                            <View style={{ backgroundColor: 'transparent', width: 200, flexDirection: 'row', marginBottom: 16 }}>
                                             <Image source={{ uri: `https://robohash.org/${item.sender}.png?set=set2` }}
                                                style={{ backgroundColor: '#ccc', width: 40, height: 40, marginRight: 8, borderRadius: 20 }} />
                                                <View style={{ backgroundColor: '#ccc', width: 'auto', borderRadius: 7, paddingVertical: 2, paddingHorizontal: 4 }}>
                                                    <Text style={{ fontSize: 13, fontWeight: '700', }}> {item.sender}</Text>
                                                    <Text style={{}}>{item.message}</Text>
                                                    <Text style={{ textAlign: "left", fontSize: 8 }}>{convertTimestampToDate(item.date)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.containerReverse}>
                                        <View style={styles.containerMessageReverse}>
                                            <View style={{ backgroundColor: 'transparent', width: 200, flexDirection: 'row', marginBottom: 16 }}>
                                             <Image source={{ uri: `https://robohash.org/${item.sender}.png?set=set2` }}
                                                style={{ backgroundColor: '#ccc', width: 40, height: 40, marginRight: 8, borderRadius: 20 }} />
                                                <View style={{ backgroundColor: '#ccc', width: 'auto', borderRadius: 7, paddingVertical: 2, paddingHorizontal: 4 }}>
                                                    <Text style={{ fontSize: 13, fontWeight: '700', }}> {item.sender}</Text>
                                                    <Text style={{}}>{item.message}</Text>
                                                    <Text style={{ textAlign: "left", fontSize: 8 }}>{convertTimestampToDate(item.date)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                            
                    )
                }} 
                keyExtractor={(item) => item.id}
                />
                <View style={{flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 8, marginBottom: 8}}>
                    <TextInput placeholder="Digite aqui sua mensagem" numberOfLines={1} onChangeText={setMessage}
                    style={{
                        backgroundColor: '#ccc',
                        flex: 4,
                        borderRadius: 7,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        maxHeight: 80,
                        marginRight: 8
                    }}
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <MaterialIcons name="send" type="google" size={20} color="000"/>
                    </TouchableOpacity>
                </View>
        </View>
    )
}

const styles= StyleSheet.create ({
    container:{
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: "flex-end",
        paddingLeft: 16,      
    },

    containerMessage:{
        backgroundColor: 'tranparent',
        width: '100%',
        alignItems: 'flex-start',
        marginVertical: 4
    },

    containerReverse:{
        backgroundColor: "transparente",
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 16,
        width: '100%'
    }, 

    containerMessageReverse: {
        backgroundColor: 'tranparent',
        width: '100%',
        alignItems: 'flex-end',
        marginVertical: 4
    }

})