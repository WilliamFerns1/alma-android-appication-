import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { SignedIn, SignedOut, useSession } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./components/SignUpScreen";
import Starter from "./components/Starter";
import Home from "./components/Home";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function Main() {

    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Starter" component={Starter} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
});

