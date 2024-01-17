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
import PieChart from 'react-native-pie-chart';

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
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        width: "100%",
                        gap: 20,
                        flexDirection: "row",
                    }}
                >
                    {pieChartData && (
                        <View
                            style={{
                                padding: 20,
                                paddingHorizontal: 0,
                            }}>
                            <PieChart
                                widthAndHeight={130} // Adjust the width and height as needed
                                series={[
                                    pieChartData["green"],
                                    pieChartData["red"],
                                    pieChartData["yellow"],
                                ]}
                                sliceColor={["#66940D", "#81FF06", "#FF0D01"]}
                            />
                        </View>
                    )}
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#fff",
                            }}
                        >

                            {`Good Days: ${pieChartData['green']}%`}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#fff",
                            }}
                        >

                            {`Normal Days: ${pieChartData['yellow']}%`}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#fff",
                            }}
                        >

                            {`Bad Days: ${pieChartData['red']}%`}
                        </Text>
                    </View>
                </View>
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

const styles = StyleSheet.create({
  blackCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000000",
    position: "absolute",
    top: 90, // Adjust the position as needed
    left: 90, // Adjust the position as needed
    zIndex: 1,
  },
  blackLine: {
    width: 2,
    height: 100, // Adjust the height as needed
    backgroundColor: "#000000",
    position: "absolute",
    top: 50, // Adjust the position as needed
    left: 99, // Adjust the position as needed
    transform: [{ rotate: "120deg" }], // Adjust the rotation angle as needed
  },
});
