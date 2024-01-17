import {useEffect, useState } from "react"

import {
    SafeAreaView,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    View,
} from 'react-native';

import BottomNavBar from "./BottomNavBar"

import { useSession, useUser, useClerk } from "@clerk/clerk-expo";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { useNavigation } from '@react-navigation/native';

export default function ChangeMood({ route, navigation }) {
    const {user} = useUser();
    const [currentlyChosenColor, setCurrentlyChosenColor] = useState('')
    const { day, monthAndYear, setReloadPage } = route.params;
    const [changingMoodLoading, setChangingMoodLoading] = useState(false)

    async function updateSelectedDateMood(date, userEmotionOption, setReloadPage) {
      try {
        // Check if the document ID is null or undefined
        if (!user?.id) {
          console.log("Document ID is null or undefined.");
          return;
        }
        if (setReloadPage === null || setReloadPage === undefined) {
            navigation.navigate('Home');
            return;
        }

        setChangingMoodLoading(true)
        const collectionRef = collection(db, 'users');
        const documentRef = doc(collectionRef, user?.id);

        // Check if the document exists
        const documentSnapshot = await getDoc(documentRef);

        let updatedCurrentsMonthCalendarData;
        const oldMonthCalendarData = documentSnapshot.data()['currentMonthCalendar']
        console.log(oldMonthCalendarData)
        for (let i = 0; i < oldMonthCalendarData.length; i++) {
            for (let j = 0; j < oldMonthCalendarData[i].week.length; j++) {
            if (oldMonthCalendarData[i].week[j].day == date) {
                oldMonthCalendarData[i].week[j].value = userEmotionOption;
            }
            }
        }
        updatedCurrentsMonthCalendarData = oldMonthCalendarData;
        // log the entire updatedCurrentsMonthCalendarData, as a string.
        console.log("updatedCurrentsMonthCalendarData: ", JSON.stringify(updatedCurrentsMonthCalendarData))
        console.log("updatedCurrentsMonthCalendarData: ", JSON.stringify(updatedCurrentsMonthCalendarData))
        if (documentSnapshot.exists()) {
            console.log("updating user document exists")
            await setDoc(documentRef, {currentMonthCalendar: updatedCurrentsMonthCalendarData}, {merge: true});
            console.log(`New document with ID ${user?.id} created.`);
        }
        setChangingMoodLoading(true)
        setReloadPage()
        navigation.navigate('Home');
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }



    return (
        <SafeAreaView
            style={{
                display: "flex",
                width: '100%',
                height: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#030637",
                paddingTop: 40,
                paddingBottom: 0,
            }}
        >
            <Image
                source={require('../assets/logo-without-text.png')}
                style={{
                    width: 100,
                    height: 100,
                }}
            />

            {
                changingMoodLoading ? (

                    <View
                        style={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: "center",
                            width: "100%",
                            gap: 20,
                            marginTop: "auto",
                            marginTop: "auto",
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: 20,
                            }}
                        >
                            Updating Mood...
                        </Text>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                ) : (
                    <View
                        style={{
                            display: "flex",
                            marginTop: "auto",
                            flexDirection: "column",
                            width: "100%",
                            gap: 20,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "90%",
                            }}
                        >

                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (currentlyChosenColor === 'green') {
                                        setCurrentlyChosenColor('')
                                    } else {
                                        setCurrentlyChosenColor('green')

                                    }
                                }}
                            >
                                <Image
                                    source={require('../assets/green-circle.png')}
                                    style={{
                                        width: currentlyChosenColor === 'green' ? 120 : 100,        // Border width
                                        height: currentlyChosenColor === 'green' ? 120 : 100,        // Border width
                                    }}
                                />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (currentlyChosenColor === 'yellow') {
                                        setCurrentlyChosenColor('')
                                    } else {
                                        setCurrentlyChosenColor('yellow')
                                    }
                                }}
                            >
                                <Image
                                    source={require('../assets/yellow-circle.png')}
                                    style={{
                                        width: currentlyChosenColor === 'yellow' ? 120 : 100,        // Border width
                                        height: currentlyChosenColor === 'yellow' ? 120 : 100,        // Border width
                                    }}
                                />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (currentlyChosenColor === 'red') {
                                        setCurrentlyChosenColor('')
                                    } else {
                                        setCurrentlyChosenColor('red')
                                    }
                                }}
                            >
                                <Image
                                    source={require('../assets/red-circle.png')}
                                    style={{
                                        width: currentlyChosenColor === 'red' ? 120 : 100,        // Border width
                                        height: currentlyChosenColor === 'red' ? 120 : 100,        // Border width
                                    }}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                        <Text
                            style={{
                                color: '#fff',
                                width: "90%",
                                textAlign: "center",
                            }}
                        >
                            {`Pick a color represents your mood on ${day} ${monthAndYear}`}
                        </Text>
                    </View>
                )
            }
            <View
                style={{
                    marginTop: "auto",
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        padding: 20,
                        ActiveOpacity: 0,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#9949FF",
                    }}
                    onPress={() => {
                        let colorNumber;
                        if (currentlyChosenColor === 'green') {
                            colorNumber = 1;
                        }
                        else if (currentlyChosenColor === 'yellow') {
                            colorNumber = 2;
                        }
                        else if (currentlyChosenColor === 'red') {
                            colorNumber = 3;
                        }
                        else {
                            colorNumber = 0
                        }
                        updateSelectedDateMood(day, colorNumber, setReloadPage)
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: 25,
                            color: "#fff",
                        }}
                    >
                        Confirm Change
                    </Text>
                </TouchableOpacity>
            </View>
            <BottomNavBar />
        </SafeAreaView>
    )
}
