import React, {useState, useEffect} from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    View,
    SafeAreaView,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {

    const [loading, setLoading] = useState(false)
    const { isLoaded, signUp, setActive } = useSignUp(); // Use the correct hook
    const navigation = useNavigation();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState("");
    const [error, setError] = React.useState("");
    // start the sign up process.
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            setLoading(true)
            await signUp.create({
                emailAddress,
                password,
            });
            console.log("2")
            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            console.log("3")
            // change the UI to our pending section.
            setLoading(false)
            setPendingVerification(true);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err['errors'][0]['message']);
            setLoading(false)
        }
    };

    // This verifies the user using email code that is delivered.
    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }
        setLoading(true)
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
            setLoading(false)
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logo}>
                <Image
                    source={require('../assets/Logo.png')} // Replace with the actual path to your image
                />
            </View>
            {loading ? (
                <View
                    style={{
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: "center",
                        width: "100%",
                        gap: 20,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff"
                        }}
                    >
                        Signing up...
                    </Text>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            ) : (
                    <>
                        {!pendingVerification && (
                            <View
                                style={{
                                    width: "100%",
                                }}
                            >
                                <View
                                    style={{
                                        width: "99%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 9
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "99%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: 9,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#fff",
                                                fontSize: 19,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Email:
                                        </Text>
                                        <TextInput
                                            style={{
                                                width: "99%",
                                                height: 39,
                                                backgroundColor: 'white', // Set background color to white
                                                borderRadius: 4, // Add border radius for rounded corners
                                                borderWidth: 0, // Add border width for the stroke
                                                borderColor: '#ccc', // Set border color
                                                paddingHorizontal: 9, // Add horizontal padding
fontSize: 15, // Set font size
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
                                            width: "99%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: 9,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#fff",
                                                fontSize: 19,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Password
                                        </Text>
                                        <TextInput
                                            style={{
                                                width: "99%",
                                                height: 39,
                                                backgroundColor: 'white', // Set background color to white
                                                borderRadius: 4, // Add border radius for rounded corners
                                                borderWidth: 0, // Add border width for the stroke
                                                borderColor: '#ccc', // Set border color
                                                paddingHorizontal: 9, // Add horizontal padding
                                                fontSize: 15, // Set font size
                                                color: 'black', // Set text color
                                            }}
                                            value={password}
                                            placeholder="Type your password here..."
                                            secureTextEntry={true}
                                            onChangeText={(password) => setPassword(password)}
                                        />

                                        <Text
                                            style={{
                                                color: "white",
                                            }}
                                        >{error}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: "99%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingVertical: 10,
                                        gap: 25,
                                        marginTop: 20,
                                    }}
                                >

                                    <TouchableOpacity
                                        style={{
                                            display: "flex",
                                            paddingHorizontal: 14,
                                            paddingVertical: 21,
                                            flexDirection: "column",
                                            width: "99%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 9,
                                            backgroundColor: "#9948FF",
                                            gap: 15,
                                        }}
                                        onPress={onSignUpPress}
                                    >
                                        <Text
                                            style={{
                                                color: "#fff",
                                                fontSize: 23,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Sign up
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
                                            onPress={() => navigation.navigate('SignIn')}
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
                            </View>
                        )}
                        {pendingVerification && (
                            <View
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                    }}
                                >
                                    Check your email for a verification code.
                                </Text>
                                <View
                                    style={{
                                        width: "100%"
                                    }}
                                >
                                    <TextInput
                                        style={{
                                            width: "100%",
                                            height: 39,
                                            backgroundColor: 'white', // Set background color to white
                                            borderRadius: 4, // Add border radius for rounded corners
                                            borderWidth: 0, // Add border width for the stroke
                                            borderColor: '#ccc', // Set border color
                                            paddingHorizontal: 9, // Add horizontal padding
                                            fontSize: 15, // Set font size
                                            color: 'black', // Set text color
                                        }}
                                        value={code}
                                        placeholder="Code..."
                                        onChangeText={(code) => setCode(code)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={onPressVerify}

                                    style={{
                                        display: "flex",
                                        paddingHorizontal: 14,
                                        paddingVertical: 21,
                                        flexDirection: "column",
                                        width: "99%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 9,
                                        backgroundColor: "#9948FF",
                                        gap: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 23,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Verify Email
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
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
