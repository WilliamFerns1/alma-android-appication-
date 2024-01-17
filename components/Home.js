import { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Image,
} from "react-native";

import { useSession, useUser } from "@clerk/clerk-expo";

import BottomNavBar from "./BottomNavBar"

import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default function Home({ route, navigation}) {
    const { loading, session } = useSession();
    const {user} = useUser()
    const [ userData, setUserData ] = useState(null);
    const [reload, setReload] = useState(false)
    const [loadingCalendar, setLoadingCalendar] = useState(false)

    const { createdUserDocument } = route?.params || {};
    function getReloadPage() {
        setReload(!reload)
        console.log("reload changed")
    }

    // Usage example:
    const collectionName = "users";
    const documentID = user?.id;

    async function getUserData(db, collectionName, documentID) {
        try {
        // Check if the document ID is null or undefined
        if (!documentID) {
          console.log("Document ID is null or undefined.");
          return;
        }
        setLoadingCalendar(true)
        const collectionRef = collection(db, collectionName);
        const documentRef = doc(collectionRef, documentID);

        // Check if the document exists
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          console.log(`Document with ID ${documentID} already exists.`);
        setUserData(documentSnapshot.data());
        setLoadingCalendar(false)
        }
      } catch (error) {
        console.error("Error getting document:", error);
        setLoadingCalendar(false)
      }
    }

    useEffect(() => {
        getUserData(db, collectionName, documentID);
    }, [createdUserDocument, reload ])

    useEffect(() => {
        getUserData(db, collectionName, documentID);
    }, [reload])

    useEffect(() => {
        console.log("User Data: ");
        console.log(userData ? userData : "No user data");
        console.log(userData ? userData.currentMonthCalendar : "No current month calendar")
    }, [userData])

    const [toggleChangeMoodUI, setToggleChangeMoodUI] = useState(false)
    const [clickedDayObject, setClickedDayObject] = useState(null)
    function onClickCalendarDay(day) {
        setToggleChangeMoodUI(true)
        setClickedDayObject(day)
    }
    function ChangeMoodUI() {
        const day = clickedDayObject.day
        const monthAndYear = userData && userData.currentMonthYear
        return (
            <View
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 40,
                    paddingHorizontal: 20,
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 20,
                            width: "100%",
                        }}
                    >
                        {`${clickedDayObject.day} ${userData && userData.currentMonthYear}`}
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "90%",
                            alignItems: "center",
                            gap: 20,
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                borderRadius: 4,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: clickedDayObject.value === 0 ? "#464646" : (clickedDayObject.value === 1 ? "green" : (clickedDayObject.value === 2 ? "yellow" : "red")),
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: clickedDayObject.value === 2 ? "black" : "#fff",
                                    fontWeight: 'bold'
                                }}
                            >
                                {clickedDayObject.day}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: 15,
                            }}
                        >
                            {clickedDayObject.value === 0 ? "Not chosen yet" : (clickedDayObject.value === 1 ? "Good Day" : (clickedDayObject.value === 2 ? "Normal Day" : "Bad Day"))}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        width: "100%",
                        padding: 25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#9949FF",
                    }}
                    onPress={() => {
                        navigation.navigate('ChangeMood', {
                            day,
                            monthAndYear,
                            setReloadPage: getReloadPage,
                        });
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "#fff",
                        }}
                    >
                        Change Mood
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

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
                {
                    loadingCalendar ? (
                        <View
                            style={{
                                display: "flex",
                                alignItems: 'center',
                                justifyContent: "center",
                                width: "100%",
                                gap: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff"
                                }}
                            >
                                Getting Calendar...
                            </Text>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    ) : (
                            userData && userData.currentMonthCalendar.map((weekArray, index) => (
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
                                                <TouchableOpacity
                                                    key={dayIndex}
                                                    style={{
                                                        display: "flex",
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 10,
                                                        borderRadius: 4,
                                                        width: "13%",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: day.value === 0 ? "#464646" : (day.value === 1 ? "green" : (day.value === 2 ? "yellow" : "red")),
                                                        marginRight: index === userData.currentMonthCalendar.length - 1 ? "1.28%" : 0
                                                    }}
                                                    onPress={() => {
                                                        onClickCalendarDay(day);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: "center",
                                                            color: day.value === 2 ? "black" : "#fff",
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {day.day}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                        ))
                    )
                }
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                width: "100%",
                backgroundColor: "#030637",
                minHeight: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                paddingTop: 40,
            }}
        >
            <View
                style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                    width: "100%",
                }}
            >
                <View
                    style={{
                        backgroundColor: "#3C0753",
                        borderRadius: 4,
                        display: "flex",
                        gap: 10,
                        width: "90%",
                        paddingHorizontal: 18,
                        paddingVertical: 21,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            alignSelf: "stretch",
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
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
                        </View>
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <Text
                                style={{
                                    color:"#fff",
                                    fontWeight: "bold",

                                }}
                            >
                                M
                            </Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <Text
                                style={{
                                    color:"#fff",
                                    fontWeight: "bold",

                                }}
                            >
                                T
                            </Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <Text
                                style={{
                                    color:"#fff",
                                    fontWeight: "bold",

                                }}
                            >
                                W
                            </Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <Text
                                style={{
                                    color:"#fff",
                                    fontWeight: "bold",

                                }}
                            >
                                T
                            </Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <Text
                                style={{
                                    color:"#fff",
                                    fontWeight: "bold",

                                }}
                            >
                                F
                            </Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                width: "13%",
                                justifyContent: "center",
                                alignItems: "center",
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
                        </View>
                    </View>
                    <EmotionCalender />
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            width: "100%",
                        }}
                    >
                        {userData && userData.currentMonthYear}
                    </Text>
                </View>
                {
                    toggleChangeMoodUI && (
                        <ChangeMoodUI />
                    )
                }
            </View>
            <SafeAreaView
                style={{
                    width: "100%"
                }}
            >
                <BottomNavBar setReloadPage={getReloadPage}/>
            </SafeAreaView>
        </SafeAreaView>
    )
}
