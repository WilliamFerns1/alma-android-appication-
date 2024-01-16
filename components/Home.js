
import { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";


export default function Home() {
    const [userExistingMonthOnFirestore, setUserExistingMonthOnFirestore] = useState(false)
    const [userMonthData, setUserMonthData] = useState({})
    function getCurrentDate() {
        const currentDate = new Date();

        // Get current date of the month
        const dayOfMonth = currentDate.getDate();

        // Get current month name
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[currentDate.getMonth()];

        // Get current year
        const year = currentDate.getFullYear();

        // Format current date and year as a string
        const formattedDate = `${monthName} ${year}`;

        return {
            dayOfMonth,
            formattedDate
        };
    }

    // Example usage
    const { dayOfMonth, formattedDate } = getCurrentDate();
    console.log(`Current date of the month: ${dayOfMonth}`);
    console.log(`Current date and year: ${formattedDate}`);



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
                    {
                        userExistingMonthOnFirestore ? (
                            <Text>userExistingMonthOnFirestore</Text>
                        ) : (
                            <Text>Not Existing Yet!</Text>
                        )
                    }
                </View>
                <Text
                    style={{
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: 20,
                    }}
                >{formattedDate}
                </Text>
            </View>
        </View>
    )
}
