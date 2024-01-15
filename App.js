import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut, useSession } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignUpScreen from "./components/SignUpScreen";
import Starter from "./components/Starter";
import Home from "./components/Home";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {

    console.log(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY)
    const clerkPublishableKeyValue = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    return (
        <ClerkProvider publishableKey={clerkPublishableKeyValue}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Starter" component={Starter} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </ClerkProvider>
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
