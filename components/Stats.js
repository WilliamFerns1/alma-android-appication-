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
    const [toggleTimeFrimePopup, setToggleTimeFrimePopup] = useState(false)

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
                paddingTop: 20,
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
                    marginBottom: toggleTimeFrimePopup ? 0 : "auto",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 20,
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
                                fontSize: 13,
                                color: "#fff",
                            }}
                        >

                            {`Green: ${pieChartData['green']}%`}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 13,
                                color: "#fff",
                            }}
                        >

                            {`Yellow: ${pieChartData['yellow']}%`}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 13,
                                color: "#fff",
                            }}
                        >

                            {`Red: ${pieChartData['red']}%`}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                backgroundColor:"#66940D"
                            }}
                        />
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: "#fff",
                            }}
                        >
                            Happy
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                backgroundColor:"#81FF06"
                            }}
                        />
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: "#fff",
                            }}
                        >
                            Fine
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                backgroundColor:"#FF0D01",
                            }}
                        />
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: "#fff",
                            }}
                        >
                           Bad Day
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            width: "100%",
                            padding: 10,
                            paddingHorizontal: 17,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: 10,
                            backgroundColor: "#9949FF",
                        }}
                        onPress={() => {
                            setToggleTimeFrimePopup(!toggleTimeFrimePopup);
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                        >
                            Select Time Frame
                        </Text>
                        <Image
                            source={require("../assets/down-icon.png")}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                toggleTimeFrimePopup ? (
                    <View
                        style={{
                            display: "flex",
                            width: "100%",
                            marginBottom: "auto",
                            padding: 8,
                            paddingHorizontal: 18,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            backgroundColor: "rgba(4, 6, 55, 0.95)",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                display: "flex",
                                width: "100%",
                                padding: 10,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#9949FF",
                                backgroundColor: "rgba(114, 4, 85, 0.88)",
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                1 Month
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                display: "flex",
                                width: "100%",
                                padding: 10,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#9949FF",
                                backgroundColor: "rgba(114, 4, 85, 0.88)",
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                1 Month
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                display: "flex",
                                width: "100%",
                                padding: 10,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#9949FF",
                                backgroundColor: "rgba(114, 4, 85, 0.88)",
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                1 Month
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                display: "flex",
                                width: "100%",
                                padding: 10,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#9949FF",
                                backgroundColor: "rgba(114, 4, 85, 0.88)",
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                1 Month
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                display: "flex",
                                width: "100%",
                                padding: 10,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#9949FF",
                                backgroundColor: "rgba(114, 4, 85, 0.88)",
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                1 Month
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                    >
                    </View>
                )
            }
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
