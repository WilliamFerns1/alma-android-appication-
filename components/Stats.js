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

export default function Stats({ route, navigation}) {
    const [timeFrameOption, setTimeFrameOption] = useState("1 Month Stats");
    const { setReloadPage } = route?.params || {};
    const {user} = useUser()
    const [userData, setUserData] = useState({})
    const [pieChartData, setPieChartData] = useState({})
    const [toggleTimeFramePopup, setToggleTimeFramePopup] = useState(false)
    const collectionName = "users";
    const documentID = user?.id;

    //previousMonths

    const [oneMonthCalendarAndChart, setOneMonthCalendarAndChart] = useState(true);
    const [threeMonthCalendarAndChart, setThreeMonthCalendarAndChart] = useState(false);
    const [sixMonthCalendarAndChart, setSixMonthCalendarAndChart] = useState(false);
    const [twelveMonthCalendarAndChart, setTwelveMonthCalendarAndChart] = useState(false);
    const [allTimeCalendarAndChart, setAllTimeCalendarAndChart ] = useState(false);


    const [threeMonthsData, setThreeMonthsData] = useState([])
    const [sixMonthsData, setSixMonthsData] = useState([])
    const [twelveMonthsData, setTwelveMonthsData] = useState([])
    const [allTimeData, setAllTimeData] = useState([])










    function untoggleAllTimeCalendarAndChart() {
        setOneMonthCalendarAndChart(false);
        setThreeMonthCalendarAndChart(false);
        setSixMonthCalendarAndChart(false);
        setTwelveMonthCalendarAndChart(false);
        setAllTimeCalendarAndChart(false);
    }


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

    // Helper function to get month data
    function getMonthData(month, year) {
        const formattedMonthAndYear = getFormattedMonthAndYear(month, year);

        // Search for the month data in userData.previousMonths
        const foundMonth = userData.previousMonths.find(
            (previousMonthObject) => previousMonthObject.monthAndYear === formattedMonthAndYear
        );

        if (foundMonth) {
            console.log(`Month data for ${formattedMonthAndYear} returned`);
            return foundMonth.monthData;
        }

        console.log(`Didn't find month data for ${formattedMonthAndYear}`);
        return `No Data`;
    }

    // Helper function to get formatted month and year
    function getFormattedMonthAndYear(month, year) {
        const monthNames = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        const monthName = monthNames[month];
        return `${monthName} ${year}`;
    }

    useEffect(() => {
        async function getThreeMonthData() {
            // Get the current date
            var currentDate = new Date();

            // Create an array to store the result
            var resultArray = [];

            // Add the current month data
            resultArray.push({
                monthData: userData.currentMonthCalendar,
                monthAndYear: getFormattedMonthAndYear(currentDate.getMonth(), currentDate.getFullYear())
            });

            if (userData.previousMonths.length >= 3) {
                // Calculate the previous two months
                for (var i = 0; i < 2; i++) {
                    currentDate.setMonth(currentDate.getMonth() - 1);

                    // Adjust the year if needed
                    if (currentDate.getMonth() === 11) {
                        currentDate.setFullYear(currentDate.getFullYear() - 1);
                    }

                    // Add the month data to the result array
                    resultArray.push({
                        monthData: getMonthData(currentDate.getMonth(), currentDate.getFullYear()),
                        monthAndYear: getFormattedMonthAndYear(currentDate.getMonth(), currentDate.getFullYear())
                    });
                }

                // Output the resulting array
                console.log(resultArray);
            }
            setThreeMonthsData(resultArray);
        }

        getThreeMonthData();
    }, [threeMonthCalendarAndChart]);

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
                    marginBottom: toggleTimeFramePopup ? 0 : "auto",
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

                            {`Green: ${pieChartData['green']?.toFixed(2)}%`}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 13,
                                color: "#fff",
                            }}
                        >

                            {`Yellow: ${pieChartData['yellow']?.toFixed(2)}%`}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 13,
                                color: "#fff",
                            }}
                        >

                            {`Red: ${pieChartData['red']?.toFixed(2)}%`}
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
                            setToggleTimeFramePopup(!toggleTimeFramePopup);
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
                            source={toggleTimeFramePopup ? require('../assets/CloseIcon.png') : require("../assets/down-icon.png")}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                toggleTimeFramePopup ? (
                    <View
                        style={{
                            display: "flex",
                            width: "100%",
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
                            onPress={() => {
                                untoggleAllTimeCalendarAndChart();
                                setOneMonthCalendarAndChart(true);
                                setTimeFrameOption("1 Month Stats");
                                setToggleTimeFramePopup(false)
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
                            onPress={() => {
                                untoggleAllTimeCalendarAndChart();
                                setThreeMonthCalendarAndChart(true);
                                setTimeFrameOption("3 Months Stats");
                                setToggleTimeFramePopup(false)
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                3 Months
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
                            onPress={() => {
                                untoggleAllTimeCalendarAndChart();
                                setSixMonthCalendarAndChart(true);
                                setTimeFrameOption("6 Months Stats");
                                setToggleTimeFramePopup(false)
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                6 Months
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
                            onPress={() => {
                                untoggleAllTimeCalendarAndChart();
                                setTwelveMonthCalendarAndChart(true);
                                setTimeFrameOption("12 Months Stats");
                                setToggleTimeFramePopup(false)
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                12 Months
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
                            onPress={() => {
                                untoggleAllTimeCalendarAndChart();
                                setAllTimeCalendarAndChart(true);
                                setTimeFrameOption("All Time Stats");
                                setToggleTimeFramePopup(false)
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                               All Time
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                        (oneMonthCalendarAndChart && userData?.currentMonthCalendar) && userData?.currentMonthCalendar.map((weekArray, index) => (
                            <View
                                style={{
                                    width: "100%",
                                    marginBottom: "auto",
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 10
                                }}
                            >
                                <View
                                    key={index}
                                    style={{
                                        width: "90%",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: index === userData.currentMonthCalendar.length - 1 ? "flex-start" : "space-between",
                                        alignItems: "center",
                                        alignSelf: "stretch",
                                    }}
                                >
                                    {weekArray.week.map((day, dayIndex) => (
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
                                                backgroundColor: day.value === 0 ? "#464646" : day.value === 1 ? "green" : day.value === 2 ? "yellow" : "red",
                                                marginRight: index === userData.currentMonthCalendar.length - 1 ? "1.28%" : 0,
                                            }}
                                            onPress={() => {
                                                navigation.navigate('ChangeMood', {
                                                    day: day.day,
                                                    monthAndYear: userData['currentMonthYear'],
                                                    setReloadPage: setReloadPage,
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: "center",
                                                    color: day.value === 2 ? "black" : "#fff",
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {day.day}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))
                    )
            }

    {/* const [allTimeCalendarAndChart, setAllTimeCalendarAndChart ] = useState(false); */}
            {
                (threeMonthCalendarAndChart && userData?.currentMonthCalendar) && userData?.currentMonthCalendar.map((weekArray, index) => (
                    <View
                        style={{
                            width: "100%",
                            marginBottom: "auto",
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10
                        }}
                    >
                        <View
                            key={index}
                            style={{
                                width: "90%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: index === userData.currentMonthCalendar.length - 1 ? "flex-start" : "space-between",
                                alignItems: "center",
                                alignSelf: "stretch",
                            }}
                        >
                            {weekArray.week.map((day, dayIndex) => (
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
                                        backgroundColor: day.value === 0 ? "#464646" : day.value === 1 ? "green" : day.value === 2 ? "yellow" : "red",
                                        marginRight: index === userData.currentMonthCalendar.length - 1 ? "1.28%" : 0,
                                    }}
                                    onPress={() => {
                                        navigation.navigate('ChangeMood', {
                                            day: day.day,
                                            monthAndYear: userData['currentMonthYear'],
                                            setReloadPage: setReloadPage,
                                        });
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color: day.value === 2 ? "black" : "#fff",
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {day.day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))
            }
            {
                sixMonthCalendarAndChart && (
                    <View>
                        <Text>Six Months</Text>
                    </View>
                )
            }
            {
                twelveMonthCalendarAndChart && (
                    <View>
                        <Text>12 Months</Text>
                    </View>
                )
            }
            {
                allTimeCalendarAndChart  && (
                    <View>
                        <Text>All Time</Text>
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
