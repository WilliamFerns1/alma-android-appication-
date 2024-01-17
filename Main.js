import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSession, useUser } from "@clerk/clerk-expo";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import ChangeMood from "./components/ChangeMood";

import { navigationRef } from './utils/navigationRef';
import SignUpScreen from "./components/SignUpScreen";
import Starter from "./components/Starter";
import Home from "./components/Home";
import SignUp from "./components/SignUpScreen";
import SignIn from "./components/SignInScreen";

import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Stack = createStackNavigator();

export default function Main() {
    const { loading, session } = useSession();
    const { user } = useUser();
    const [docData, setDocData] = useState(null);
    const [createdUserDocument, setCreatedUserDocument] = useState(false);

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
                    setDocData(documentSnapshot.data());

                } else {
                    // Document doesn't exist, create a new one
                    await setDoc(documentRef, data, {merge: true});
                    setCreatedUserDocument(true)
                    console.log(`New document with ID ${documentID} created.`);
                }
            } catch (error) {
                console.error("Error checking/creating document:", error);
            }
        }

        // Usage example:
        const collectionName = "users";
        const documentID = user?.id;
        const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        console.log(currentMonthYear);
        //get the total days of the current month
        const totalDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        console.log("Total Days: ", totalDays);

        let currentMonthCalendarValues = [];
        for (let i = 0; i < totalDays; i++) {
            currentMonthCalendarValues.push({
                day: i + 1,
                value: 0,
            })
        }
        // Grouping into weeks
        //
        let  weeksArray = [];
        const daysInWeek = 7;

        for (let i = 0; i < currentMonthCalendarValues.length; i += daysInWeek) {
            const week = currentMonthCalendarValues.slice(i, i + daysInWeek);
            weeksArray.push({ week });
        }

        console.log(weeksArray);
        let data;
        if (docData && docData.currentMonthCalendar) {
            data = {
                userId: user?.id || "",
                currentMonthYear: currentMonthYear,
            };
        }
        else {
            data = {
                userId: user?.id || "",
                currentMonthCalendar: weeksArray,
                currentMonthYear: currentMonthYear,
            };
        }
        checkAndCreateDocument(db, collectionName, documentID, data);
    }, [loading, session, user]);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen name="Starter" component={Starter} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Home"
                    options={{
                        initialParams: { createdUserDocument },
                        headerShown: false, // Set headerShown to false to hide the header
                    }}
                >
                    {(props) => <Home {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ChangeMood" component={ChangeMood} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
