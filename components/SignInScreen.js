import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

export default function SignInScreen() {

    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <SafeAreaView
            style={styles.container}
        >
            <View style={styles.logo}>
                <Image
                    style={styles.image}
                    source={require('../assets/Logo.png')} // Replace with the actual path to your image
                />
            </View>

            <View
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10
                }}
            >
                <View
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 10,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >
                        Email:
                    </Text>
                    <TextInput
                        style={{
                            width: "100%",
                            height: 40,
                            backgroundColor: 'white', // Set background color to white
                            borderRadius: 5, // Add border radius for rounded corners
                            borderWidth: 1, // Add border width for the stroke
                            borderColor: '#ccc', // Set border color
                            paddingHorizontal: 10, // Add horizontal padding
                            fontSize: 16, // Set font size
                            color: 'black', // Set text color
                        }}
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="example@gmail.com"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                    />
                </View>
                <View
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 10,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >
                        Password
                    </Text>
                    <TextInput
                        style={{
                            width: "100%",
                            height: 40,
                            backgroundColor: 'white', // Set background color to white
                            borderRadius: 5, // Add border radius for rounded corners
                            borderWidth: 1, // Add border width for the stroke
                            borderColor: '#ccc', // Set border color
                            paddingHorizontal: 10, // Add horizontal padding
                            fontSize: 16, // Set font size
                            color: 'black', // Set text color
                        }}
                        value={password}
                        placeholder="Type your password here..."
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>

                <View>
                    <Text>
                    </Text>
                    <TextInput
                    />
                </View>
            </View>
            <View
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 83,
                }}
            >

                <TouchableOpacity
                    style={{
                        display: "flex",
                        paddingHorizontal: 15,
                        paddingVertical: 22,
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: "#9949FF",
                        gap: 16,
                    }}
                    onPress={onSignInPress}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 24,
                            fontWeight: "bold"
                        }}
                    >
                        Sign in
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        width: "100%",
                        flexDirection: "row",
                    }}
                >
                    <Text
                        style={{
                            width: "45%",
                            color: "#fff",
                        }}
                    >
                        Have an account?
                    </Text>
                    <TouchableOpacity
                        style={{
                            width: "45%",
                            display: "flex",
                            height: 45,
                            paddingVertical: 5,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: '#9949FF',
                            paddingHorizontal: 15,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={onSignInPress}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: "bold"
                            }}
                        >
                            Log in
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#030637",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 10,

    },
    logo: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
    },
});
