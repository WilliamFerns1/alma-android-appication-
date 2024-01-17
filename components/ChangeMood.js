import {useEffect, useState } from "react"

import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';

import BottomNavBar from "./BottomNavBar"


export default function ChangeMood({ route }) {
    const [currentlyChosenColor, setCurrentlyChosenColor] = useState('')

    const { day, monthAndYear } = route.params;
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
                    <TouchableOpacity
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
                    </TouchableOpacity>
                    <TouchableOpacity
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
                    </TouchableOpacity>
                    <TouchableOpacity
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
                    </TouchableOpacity>
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
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#9949FF",
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
