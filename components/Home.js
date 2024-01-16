
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
        console.log(userData ? userData.currentMonthCalendar : "No current month calendar")
    }, [userData])

    function EmotionCalender() {
        return (
            <View
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10
                }}
            >
                {userData &&
                    userData.currentMonthCalendar.map((weekArray, index) => (
                        <View
                            key={index}
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: index === userData.currentMonthCalendar.length - 1 ? "flex-start" : "space-between",
                                alignItems: "center",
                                alignSelf: "stretch",
                            }}
                        >
                            {
                                weekArray.week.map((day, dayIndex) => {
                                    return (
                                        <View
                                            key={dayIndex}
                                            style={{
                                                display: "flex",
                                                paddingHorizontal: 10,
                                                paddingVertical: 10,
                                                width: "13%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: day.value === 0 ? "#464646" : (day.value === 1 ? "green" : (day.value === 2 ? "yellow" : "red")),
                                                marginRight: index === userData.currentMonthCalendar.length - 1 ? "1.28%" : 0
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: "center",
                                                    color: "#fff",
                                                }}
                                            >
                                                {day.day}
                                            </Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    ))}
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
