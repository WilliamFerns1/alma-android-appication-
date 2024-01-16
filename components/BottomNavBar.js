import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
}
from 'react-native'

import { useSession, useUser, useClerk } from "@clerk/clerk-expo";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


import { useNavigation } from '@react-navigation/native';

export default function BottomNavBar() {
    const { signOut } = useClerk();
    const navigation = useNavigation();
    const {user} = useUser()
    const {loading, session} = useSession()

    useEffect(() => {
        async function getUserData(db, collectionName, documentID) {
            try {
            // Check if the document ID is null or undefined
            if (!documentID) {
              console.log("Document ID is null or undefined.");
              return;
            }

            const collectionRef = collection(db, collectionName);
            const documentRef = doc(collectionRef, documentID);

            // Check if the document exists
            const documentSnapshot = await getDoc(documentRef);

            if (documentSnapshot.exists()) {
              console.log(`Document with ID ${documentID} already exists.`);
            setUserData(documentSnapshot.data());
            }
          } catch (error) {
            console.error("Error getting document:", error);
          }
        }

        // Usage example:
        const collectionName = "users";
        const documentID = user?.id;
        getUserData(db, collectionName, documentID);
    }, [])

    return (
        <View
            style={{
                width: '100%',
                display: "flex",
                height: "100%",
                backgroundColor: "#9949FF",
                height: 106,
                paddingVertical: 10,
                paddingHorizontal: 22,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                }}
            >

                <TouchableOpacity>

                    <Image
                        source={require('../assets/red-circle.png')} // Replace with the actual path to your image
                        style={{
                            width: 44,
                            height: 44,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity>

                    <Image
                        source={require('../assets/green-circle.png')} // Replace with the actual path to your image
                        style={{
                            width: 44,
                            height: 44,
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Image
                        style={{
                            width: 44, height: 44,
                        }}
                        source={require('../assets/yellow-circle.png')} // Replace with the actual path to your image
                    />
                </TouchableOpacity>

            </View>

            <TouchableOpacity>
                <Image
                    source={require('../assets/stats.png')} // Replace with the actual path to your image
                    style={{
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    display: "flex",
                    width: 86,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 4,
                    borderWidth: 2, // Border width
                    borderColor: 'white', // Border color
                }}
                onPress={async () => {
                    try {
                        signOut();
                        navigation.navigate('SignIn')
                    } catch (error) {
                        console.error('Error clearing local storage:', error);
                    }
                }}
            >
                <TouchableOpacity>
                    <Image
                        source={require('../assets/signout.png')} // Replace with the actual path to your image
                        style={{
                        }}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}
