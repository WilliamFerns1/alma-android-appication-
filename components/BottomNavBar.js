import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../utils/navigationRef';
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

export default function BottomNavBar(props) {
    const [userData, setUserData] = useState(null)
    const { signOut } = useClerk();
    const navigation = useNavigation();
    const {user} = useUser()
    const {loading, session} = useSession()

    const { setReloadPage } = props;

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
    useEffect(() => {
        getUserData(db, collectionName, documentID);
    }, [])

    useEffect(() => {
        console.log("User Data: ");
        console.log(userData ? userData : "No user data");
        console.log(userData ? userData.currentMonthCalendar : "No current month calendar")
    }, [userData])


    async function updateTodaysMood(userEmotionOption, setReloadPage) {

      try {
        // Check if the document ID is null or undefined
        if (!user?.id) {
          console.log("Document ID is null or undefined.");
          return;
        }

        const collectionRef = collection(db, 'users');
        const documentRef = doc(collectionRef, user?.id);

        // Check if the document exists
        const documentSnapshot = await getDoc(documentRef);

        let updatedCurrentsMonthCalendarData;
        const oldMonthCalendarData = documentSnapshot.data()['currentMonthCalendar']
        //Get the current data in a number (for example if the date is 17 january, it will be 17)
        const currentDate = new Date().getDate();
        console.log("Current Date: ", currentDate)

        //Here is the format: [{week: [{value: 0, day: 1}, {value: 0, day: 2}...goes so on for 7 days, and the repeat for the next and next week]}]
        //Update the current day value
        //lOOP THROUGH THE CURRENT MONTH CALENDAR DATA AND UPDATE THE VALUE OF THE CURRENT DATE
        console.log(oldMonthCalendarData)
        for (let i = 0; i < oldMonthCalendarData.length; i++) {
            for (let j = 0; j < oldMonthCalendarData[i].week.length; j++) {

            console.log("2")
            if (oldMonthCalendarData[i].week[j].day == currentDate) {
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
        setReloadPage()
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }


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
                <TouchableOpacity
                    onPress={() => {
                        updateTodaysMood(1, setReloadPage)
                    }}
                >

                    <Image
                        source={require('../assets/green-circle.png')} // Replace with the actual path to your image
                        style={{
                            width: 44,
                            height: 44,
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        updateTodaysMood(2, setReloadPage)
                    }}
                >
                    <Image
                        style={{
                            width: 44, height: 44,
                        }}
                        source={require('../assets/yellow-circle.png')} // Replace with the actual path to your image
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        updateTodaysMood(3, setReloadPage)
                    }}
                >

                    <Image
                        source={require('../assets/red-circle.png')} // Replace with the actual path to your image
                        style={{
                            width: 44,
                            height: 44,
                        }}
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
