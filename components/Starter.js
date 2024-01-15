
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignUpScreen from "./SignUpScreen";
import { SafeAreaView } from "react-native";

import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native';
export default function Starter() {

    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <SignedIn>
                {navigation.navigate('Home')}
            </SignedIn>
            <SignedOut>
                <SignUpScreen />
            </SignedOut>
        </SafeAreaView>
    )
}
