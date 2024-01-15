import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import SignInScreen from "./components/SignInScreen";

export default function App() {

    console.log(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY)
    const clerkPublishableKeyValue = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    return (
        <ClerkProvider publishableKey={clerkPublishableKeyValue}>
            <SafeAreaView styles={styles.container}>
                <SignedIn>
                    <Text>You are Signed in</Text>
                </SignedIn>
                <SignedOut>
                    <SignInScreen />
                </SignedOut>
            </SafeAreaView>
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
