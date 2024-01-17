import  { useState, useEffect } from "react";
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

import BottomNavBar from "./BottomNavBar"

import { useSession, useUser } from "@clerk/clerk-expo";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Stats() {
    const [timeFrameOption, setTimeFrameOption] = useState("Monthly Stats");
    const {user} = useUser()
    const [userData, setUserData] = useState({})
    const [pieChartData, setPieChartData] = useState({})

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

    let currentMonthCalendar;
    let formattedDataForPieChart;
    let totalGreenDays = 0;
    let totalYellowdays = 0;
    let totalRedDays = 0;
    let totalDaysFilledIn = 0;

    useEffect(() => {
        getUserData(db, collectionName, documentID)
    }, [])

    useEffect(() => {
        if (userData && userData['currentMonthCalendar']) {
            currentMonthCalendar = userData['currentMonthCalendar']

            currentMonthCalendar.map((weekObject, weekIndex) => {
                for (let i = 0; i < weekObject.week.length; i++) {
                    if (
                        weekObject.week[i]['value'] === 1 ||
                        weekObject.week[i]['value'] === 2 ||
                        weekObject.week[i]['value'] === 3
                    ) {
                        if (weekObject.week[i]['value'] === 1) {
                            totalGreenDays++;
                        } else if (weekObject.week[i]['value'] === 2) {
                            totalYellowdays++;
                        } else {
                            totalRedDays++;
                        }
                        totalDaysFilledIn++;
                    }
                    else {
                        console.log(`Day ${weekObject.week[i].day} is not filled in yet`)
                    }
                }
            })
            //formattedDataForPieChart
            // let totalGreenDays = 0;
            // let totalYellowdays = 0;
            // let totalRedDays = 0;
            // let totalDaysFilledIn = 0;
            //Calculate the percentages of each color, look at the totalDaysFilledIn to see how many days are filled in
            let greenPercentage = (totalGreenDays / totalDaysFilledIn) * 100;
            let yellowPercentage = (totalYellowdays / totalDaysFilledIn) * 100;
            let redPercentage = (totalRedDays / totalDaysFilledIn) * 100;
            formattedDataForPieChart = {
                green: greenPercentage,
                yellow: yellowPercentage,
                red: redPercentage,
            }
            console.log("formattedDataForPieChart")
            console.log(formattedDataForPieChart)
            setPieChartData(formattedDataForPieChart)
        }
    }, [userData])
    return (
        <SafeAreaView
            style={{
                display: "flex",
                width: "100%",
                minHeight: "100%",
                paddingTop: 40,
                paddingBottom: 0,
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                backgroundColor: "#030637",
            }}

        >
            <View
                style={{
                    display: "flex",
                    padding: 15,
                    paddingHorizontal: 17,
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: "#720455",
                    borderRadius: 10,
                    width: "90%",
                    marginBottom: "auto",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 24,
                        fontWeight: "bold",
                    }}
                >
                    {timeFrameOption}
                </Text>
            </View>
            <View
                style={{
                    width: "100%",
                }}
            >
                <BottomNavBar />
            </View>
        </SafeAreaView>
    )
}
