import { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { SignedIn, SignedOut, useSession, useUser } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./components/SignUpScreen";
import Starter from "./components/Starter";
import Home from "./components/Home";
import SignUp from "./components/SignUpScreen";
import SignIn from "./components/SignInScreen";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebaseConfig from "./firebaseConfig"
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Stack = createStackNavigator();

export default function Main() {
    const { loading, session } = useSession();
    const { user } = useUser();

    useEffect(() => {
        async function checkAndCreateDocument(db, collectionName, documentID, data) {
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
                } else {
                    // Document doesn't exist, create a new one
                    await setDoc(documentRef, data);
                    console.log(`New document with ID ${documentID} created.`);
                }
            } catch (error) {
                console.error("Error checking/creating document:", error);
            }
        }

        // Usage example:
        const collectionName = "users";
        const documentID = user?.id;
        const data = {
            userId: user?.id || "",
            // Add other data properties as needed
        };

        checkAndCreateDocument(db, collectionName, documentID, data);

    }, [loading, session, user])


    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Starter" component={Starter} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                    <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
});

