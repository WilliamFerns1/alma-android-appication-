import React, { useEffect } from "react";
import { SignedIn, SignedOut, useSession } from "@clerk/clerk-react";
import SignUpScreen from "./SignUpScreen";
import { SafeAreaView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';

export default function Starter() {
    const navigation = useNavigation();
    const { loading, session } = useSession();

    useEffect(() => {
        if (!loading && session) {
            // User is signed in, navigate to 'Home'
            console.log("User is signed in, navigate to 'Home'");
            console.log(session.user)
            navigation.navigate('Home');
        } else if (!loading && !session) {
            // User is not signed in, navigate to 'SignIn'
            console.log("User is not signed in, navigate to 'SignIn'");
            navigation.navigate('SignUp');
        }
    }, [loading, session, navigation]);

    return (
        <Text>Processing...</Text>
    )
}
