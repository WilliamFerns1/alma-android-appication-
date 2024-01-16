
import { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";

import { useSession, useUser } from "@clerk/clerk-expo";

import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
    const { loading, session } = useSession();
    const {user} = useUser()
    const [ userData, setUserData ] = useState(null);
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

    useEffect(() => {
        console.log("User Data: ");
        console.log(userData ? userData : "No user data");
        console.log(userData.currentMonthCalendar ? userData.currentMonthCalendar : "No current month calendar")
    }, [userData])

    function EmotionCalender() {
        return (
            <View>
                {
                    userData.currentMonthCalendar && userData['currentMonthCalendar']?.map((day, index) => {
                        return (
                            <View>
                                <Text>{day['day']}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#030637",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
            }}
        >
            <Image
                source={require("../assets/logo-without-text.png")}
                style={{
                    width: 200,
                    height: 200,
                }}
            />
            <View
                style={{
                    backgroundColor: "#3C0753",

                    borderRadius: 4, // Adjust the value as needed
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20,
                    width: "90%",
                    paddingHorizontal: 18,
                    paddingVertical: 31,
                }}
            >
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        flexDirection: "row",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        S

                    </Text>
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        M

                    </Text>
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        T

                    </Text>
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        W
                    </Text>
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        T
                    </Text>
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        F
                    </Text>
                    <Text
                        style={{
                            color:"#fff",
                            fontWeight: "bold",
                        }}
                    >
                        S
                    </Text>
                </View>
                <EmotionCalender />
            </View>
        </View>
    )
}
